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

    // ✅ Validation
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

    // ✅ Process each item - now accepting product names
    for (const item of body.items) {
      let dbItem = null
      const modelType = item.modelType || 'Product'
      const productIdentifier = item.product // This can now be ID or name

      if (modelType === "Product") {
        // Try to find by ID first, then by name/title
        if (isValidObjectId(productIdentifier)) {
          dbItem = await Product.findById(productIdentifier)
        } else {
          // Search by name or title
          dbItem = await Product.findOne({
            $or: [
              { name: { $regex: productIdentifier, $options: 'i' } },
              { title: { $regex: productIdentifier, $options: 'i' } }
            ],
            status: 'active' // Only active products
          })
        }
      } else if (modelType === "Service") {
        if (isValidObjectId(productIdentifier)) {
          dbItem = await Service.findById(productIdentifier)
        } else {
          dbItem = await Service.findOne({
            $or: [
              { name: { $regex: productIdentifier, $options: 'i' } },
              { title: { $regex: productIdentifier, $options: 'i' } }
            ],
            status: 'active'
          })
        }
      }

      if (!dbItem) {
        return NextResponse.json(
          { error: `${modelType} غير موجود: ${productIdentifier}` }, 
          { status: 404 }
        )
      }

      // Check if product is in stock
      if (modelType === "Product" && dbItem.stock !== undefined && dbItem.stock < (item.quantity || 1)) {
        return NextResponse.json(
          { error: `الكمية غير متوفرة للمنتج: ${dbItem.title || dbItem.name}. المتوفر: ${dbItem.stock}` }, 
          { status: 400 }
        )
      }

      const price = Number(dbItem.price) 
      const quantity = item.quantity || 1
      totalAmount += price * quantity

      items.push({
        product: dbItem._id, // Store the actual ID
        modelType: modelType,
        name: dbItem.title || dbItem.name,
        price: price,
        quantity: quantity,
        designFile: item.designFile || null,
      })
    }

    // ✅ Create the order (same as before)
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

    // ✅ Update product stock if applicable
    for (const item of items) {
      if (item.modelType === "Product") {
        await Product.findByIdAndUpdate(
          item.product,
          { $inc: { stock: -item.quantity } }
        )
      }
    }

    // ✅ Populate the response
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

// Helper function to check if string is a valid MongoDB ObjectId
function isValidObjectId(id: string) {
  return /^[0-9a-fA-F]{24}$/.test(id)
}