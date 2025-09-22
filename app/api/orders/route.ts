import { NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import Order from "@/models/Orders"
import Product from "@/models/Product"
import Service from "@/models/Service"

export async function GET() {
  try {
    await connectDB()
    const orders = await Order.find({}).populate("items.product")
    return NextResponse.json(orders, { status: 200 })
  } catch (error) {
    console.error("Failed to fetch orders:", error)
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 })
  }
}
export async function POST(req: Request) {
  try {
    await connectDB()
    const body = await req.json()

    if (!body.customer || !body.paymentMethod || !body.items?.length) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    let total = 0
    const items = []

    for (const item of body.items) {
      let dbItem = null

      if (item.modelType === "Product") {
        dbItem = await Product.findById(item.product)
      } else if (item.modelType === "Service") {
        dbItem = await Service.findById(item.product)
      }

      if (!dbItem) {
        return NextResponse.json({ error: `${item.modelType} not found` }, { status: 404 })
      }
      
      // ✅ Critical Fix: Get price directly from the fetched database item
      const price = Number(dbItem.price);

// Ensure the price is a valid number before calculation
if (isNaN(price)) {
  console.error("Price is not a valid number:", dbItem.price);
  return NextResponse.json({ error: "Invalid price for service/product" }, { status: 400 });
}

      const quantity = item.quantity || 1
      total += price * quantity

      items.push({
        product: item.product,
        modelType: item.modelType,
        name: dbItem.title || dbItem.name,
        price,
        quantity,
      })
    }

    const newOrder = await Order.create({
      customer: body.customer,
      paymentMethod: body.paymentMethod,
      phone: body.phone,
      email: body.email,
      notes: body.notes,
      total,
      date: new Date().toISOString().split("T")[0],
      items,
    })

    return NextResponse.json(newOrder, { status: 201 })
  } catch (error) {
    console.error("Order creation error:", error)
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 })
  }
}