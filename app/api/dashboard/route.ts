import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Order from "@/models/Orders";
import Product from "@/models/Product";

export async function GET() {
  await connectDB();

  // 1. Fetch raw statistics
  const totalSalesResult = await Order.aggregate([
    { $group: { _id: null, total: { $sum: "$amount" } } }
  ]);
  const ordersCount = await Order.countDocuments();
  const customersCount = await Order.distinct("customer").then(res => res.length);
  const productsCount = await Product.countDocuments();
  
  // 2. Fetch recent orders
  const orders = await Order.find().sort({ createdAt: -1 }).limit(5);

  // 3. 🔥 NEW: Fetch sales data for the chart (last 6 months)
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  const salesData = await Order.aggregate([
    {
      $match: {
        createdAt: { $gte: sixMonthsAgo }
      }
    },
    {
      $group: {
        _id: {
          year: { $year: "$createdAt" },
          month: { $month: "$createdAt" }
        },
        value: { $sum: "$amount" }
      }
    },
    {
      $sort: { "_id.year": 1, "_id.month": 1 }
    }
  ]);

  // Format sales data for the chart
  const formattedSalesData = salesData.map(item => ({
    month: item._id.month,
    year: item._id.year,
    value: item.value
  }));

  // 4. 🔥 NEW: Get previous stats for comparison
  const lastMonth = new Date();
  lastMonth.setMonth(lastMonth.getMonth() - 1);
  
  const previousMonthSales = await Order.aggregate([
    {
      $match: {
        createdAt: { 
          $gte: new Date(lastMonth.getFullYear(), lastMonth.getMonth(), 1),
          $lt: new Date(lastMonth.getFullYear(), lastMonth.getMonth() + 1, 1)
        }
      }
    },
    { $group: { _id: null, total: { $sum: "$amount" } } }
  ]);

  const previousOrdersCount = await Order.countDocuments({
    createdAt: { $lt: new Date(new Date().getFullYear(), new Date().getMonth(), 1) }
  });

  // 5. Construct the response with ALIASING to match front-end keys
  return NextResponse.json({
    stats: {
      sales: totalSalesResult[0]?.total || 0,
      newOrders: ordersCount, 
      activeCustomers: customersCount, 
      products: productsCount,
      // Add more stats if available
      revenue: totalSalesResult[0]?.total || 0,
      visits: customersCount * 3, // Example calculation
      pendingOrders: await Order.countDocuments({ status: "pending" }),
      newUsers: customersCount,
      messages: 0 // Default value
    },
    previousStats: {
      sales: previousMonthSales[0]?.total || 0,
      newOrders: previousOrdersCount,
      activeCustomers: Math.max(0, customersCount - 5), // Example
      products: Math.max(0, productsCount - 2), // Example
      revenue: previousMonthSales[0]?.total || 0,
      visits: Math.max(0, customersCount * 3 - 10),
      pendingOrders: Math.max(0, (await Order.countDocuments({ status: "pending" })) - 1),
      newUsers: Math.max(0, customersCount - 3),
      messages: 0
    },
    salesData: formattedSalesData,
    orders: orders.map(order => ({
      _id: order._id,
      customer: order.customer || "عميل",
      product: `طلب #${order._id.toString().slice(-4)}`,
      amount: order.amount,
      status: order.status === "pending" ? "جديد" : 
              order.status === "processing" ? "قيد التنفيذ" : "مكتمل",
      date: order.createdAt
    })),
  });
}