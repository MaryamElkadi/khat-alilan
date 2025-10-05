// app/api/orders/route.ts
import { NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import Order from "@/models/Orders"
import Product from "@/models/Product"
import Service from "@/models/Service"
import User from "@/models/User"

// GET orders - with optional user filtering
export async function GET(req: Request) {
  try {
    await connectDB()
    
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
      .sort({ createdAt: -1 })

    return NextResponse.json(orders, { status: 200 })
  } catch (error) {
    console.error("Failed to fetch orders:", error)
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 })
  }
}

// POST - Create new order
export async function POST(req: Request) {
  try {
    await connectDB()
    const body = await req.json()

    // ✅ Validate required fields
    if (!body.user || !body.items?.length) {
      return NextResponse.json(
        { error: "المستخدم والمنتجات مطلوبة" }, 
        { status: 400 }
      )
    }

    // ✅ Check if user exists
    const user = await User.findById(body.user)
    if (!user) {
      return NextResponse.json(
        { error: "المستخدم غير موجود" }, 
        { status: 404 }
      )
    }

    let totalAmount = 0
    const items = []

    // ✅ Process each item and calculate total
    for (const item of body.items) {
      let dbItem = null
      let modelType = item.modelType || 'Product'

      if (modelType === "Product") {
        dbItem = await Product.findById(item.product)
      } else if (modelType === "Service") {
        dbItem = await Service.findById(item.product)
      }

      if (!dbItem) {
        return NextResponse.json(
          { error: `${modelType} غير موجود` }, 
          { status: 404 }
        )
      }
      
      // ✅ Get price from database item
      const price = Number(dbItem.price || dbItem.price)

      if (isNaN(price)) {
        console.error("Invalid price:", dbItem.price)
        return NextResponse.json(
          { error: `سعر غير صالح لـ ${modelType}` }, 
          { status: 400 }
        )
      }

      const quantity = item.quantity || 1
      totalAmount += price * quantity

      items.push({
        product: item.product,
        modelType: modelType,
        name: dbItem.title || dbItem.name,
        price: price,
        quantity: quantity,
      })
    }

    // ✅ Create the order
    const newOrder = await Order.create({
      user: body.user,
      items: items,
      shippingInfo: body.shippingInfo || {},
      paymentMethod: body.paymentMethod || "cash",
      paymentStatus: body.paymentMethod === "card" ? "paid" : "pending",
      totalAmount: totalAmount,
      notes: body.notes || "",
      status: body.status || "جديد"
    })

    // ✅ Update user's orders array
    await User.findByIdAndUpdate(
      body.user,
      { $push: { orders: newOrder._id } }
    )

    // ✅ Populate the response with user and product details
    const populatedOrder = await Order.findById(newOrder._id)
      .populate('user', 'name email phone')
      .populate('items.product', 'title name price image')

    return NextResponse.json(
      { 
        success: true,
        order: populatedOrder,
        message: "تم إنشاء الطلب بنجاح" 
      }, 
      { status: 201 }
    )
  } catch (error: any) {
    console.error("Order creation error:", error)
    
    // Handle duplicate order number (shouldn't happen with the pre-save hook)
    if (error.code === 11000) {
      return NextResponse.json(
        { error: "رقم الطلب مكرر، يرجى المحاولة مرة أخرى" }, 
        { status: 409 }
      )
    }
    
    return NextResponse.json(
      { error: "فشل في إنشاء الطلب" }, 
      { status: 500 }
    )
  }
}