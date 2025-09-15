import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Order from "@/models/Orders";
import Product from "@/models/Product";

export async function GET() {
  await connectDB();

  // الإحصائيات
  const totalSales = await Order.aggregate([
    { $group: { _id: null, total: { $sum: "$amount" } } }
  ]);

  const ordersCount = await Order.countDocuments();
  const customersCount = await Order.distinct("customer").then(res => res.length);
  const productsCount = await Product.countDocuments();

  // الطلبات الأخيرة (آخر 5)
  const recentOrders = await Order.find().sort({ createdAt: -1 }).limit(5);

  return NextResponse.json({
    stats: {
      totalSales: totalSales[0]?.total || 0,
      ordersCount,
      customersCount,
      productsCount,
    },
    recentOrders,
  });
}
