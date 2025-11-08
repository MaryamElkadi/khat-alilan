// app/api/orders/route.ts
import { NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import mongoose from "mongoose"
import Product from "@/models/Product"
import Service from "@/models/Service"
import User from "@/models/User"

// 🚀 Clear Mongoose model cache
delete mongoose.connection.models?.Order;
import Order from "@/models/Orders"

// GET all orders
export async function GET(req: Request) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    let query = {};
    let populateOptions = [
      { path: 'user', select: 'name email phone' },
      { path: 'items.product', select: 'title name price image' }
    ];

    if (userId) {
      query = { user: userId };
    }

    const orders = await Order.find(query)
      .populate(populateOptions)
      .sort({ createdAt: -1 });

    return NextResponse.json(orders, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch orders:", error);
    return NextResponse.json(
      { error: "Failed to fetch orders" }, 
      { status: 500 }
    );
  }
}

// POST - Create new order
export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();

    console.log("Received order data:", body);

    // ✅ Updated Validation - allow guest orders (no user)
    if (!body.items?.length) {
      return NextResponse.json(
        { error: "المنتجات مطلوبة" }, 
        { status: 400 }
      );
    }

    let totalAmount = 0;
    const items = [];

    // ✅ Process each item
    for (const item of body.items) {
      let dbItem = null;
      const modelType = item.modelType || 'Product';
      const productIdentifier = item.product;

      if (modelType === "Service") {
        if (isValidObjectId(productIdentifier)) {
          dbItem = await Service.findById(productIdentifier);
        } else {
          dbItem = await Service.findOne({
            $or: [
              { name: { $regex: productIdentifier, $options: 'i' } },
              { title: { $regex: productIdentifier, $options: 'i' } }
            ],
            status: 'active'
          });
        }
      } else {
        // Handle Product type
        if (isValidObjectId(productIdentifier)) {
          dbItem = await Product.findById(productIdentifier);
        } else {
          dbItem = await Product.findOne({
            $or: [
              { name: { $regex: productIdentifier, $options: 'i' } },
              { title: { $regex: productIdentifier, $options: 'i' } }
            ],
            status: 'active'
          });
        }
      }

      if (!dbItem) {
        return NextResponse.json(
          { error: `${modelType} غير موجود: ${productIdentifier}` }, 
          { status: 404 }
        );
      }

      // Check if product is in stock (only for products, not services)
      if (modelType === "Product" && dbItem.stock !== undefined && dbItem.stock < (item.quantity || 1)) {
        return NextResponse.json(
          { error: `الكمية غير متوفرة للمنتج: ${dbItem.title || dbItem.name}. المتوفر: ${dbItem.stock}` }, 
          { status: 400 }
        );
      }

      const price = Number(dbItem.price);
      const quantity = item.quantity || 1;
      totalAmount += price * quantity;

      items.push({
        product: dbItem._id,
        modelType: modelType,
        name: dbItem.title || dbItem.name,
        price: price,
        quantity: quantity,
      });
    }

    // 🚀 FIX: Generate orderNumber manually to ensure it's set
    const orderCount = await Order.countDocuments();
    const orderNumber = `ORD-${Date.now()}-${orderCount + 1}`;

    // ✅ Create the order data
    const orderData: any = {
      orderNumber: orderNumber, // 🚀 Manually set orderNumber
      items: items,
      shippingInfo: body.shippingInfo || {},
      paymentMethod: body.paymentMethod || "cash",
      paymentStatus: body.paymentMethod === "card" ? "paid" : "pending",
      totalAmount: totalAmount,
      notes: body.notes || "",
      status: body.status || "جديد"
    };

    // 🚀 FIX: Explicitly set user to null for guest orders
    if (body.user) {
      orderData.user = body.user;
    } else {
      orderData.user = null; // Explicitly set to null for guest orders
    }

    console.log("Creating order with data:", orderData);

    const newOrder = await Order.create(orderData);

    // ✅ Update user's orders array only if user exists
    if (body.user) {
      await User.findByIdAndUpdate(
        body.user,
        { $push: { orders: newOrder._id } }
      );
    }

    // ✅ Update product stock if applicable
    for (const item of items) {
      if (item.modelType === "Product") {
        await Product.findByIdAndUpdate(
          item.product,
          { $inc: { stock: -item.quantity } }
        );
      }
    }

    // ✅ Populate the response
    let populatedOrder;
    if (body.user) {
      populatedOrder = await Order.findById(newOrder._id)
        .populate('user', 'name email phone')
        .populate('items.product', 'title name price image');
    } else {
      populatedOrder = await Order.findById(newOrder._id)
        .populate('items.product', 'title name price image');
    }

    return NextResponse.json(
      { 
        success: true,
        order: populatedOrder,
        message: "تم إنشاء الطلب بنجاح" 
      }, 
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Order creation error details:", error);
    
    if (error.code === 11000) {
      // Retry with different order number if duplicate
      return NextResponse.json(
        { error: "رقم الطلب مكرر، يرجى المحاولة مرة أخرى" }, 
        { status: 409 }
      );
    }
    
    return NextResponse.json(
      { error: `فشل في إنشاء الطلب: ${error.message}` }, 
      { status: 500 }
    );
  }
}

// Helper function to check if string is a valid MongoDB ObjectId
function isValidObjectId(id: string) {
  return /^[0-9a-fA-F]{24}$/.test(id);
}