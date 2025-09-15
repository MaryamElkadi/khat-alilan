import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Order from "@/models/orders";

export async function GET() {
  try {
    await connectDB();
    // populate product details inside items
    const orders = await Order.find({}).populate("items.product");
    return NextResponse.json(orders, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();

    // Ensure total is calculated on backend for security
    const total = body.items.reduce(
      (acc: number, item: any) => acc + item.price * item.quantity,
      0
    );

    const newOrder = await Order.create({
      ...body,
      total,
      date: new Date().toISOString().split("T")[0], // store as YYYY-MM-DD
    });

    return NextResponse.json(newOrder, { status: 201 });
  } catch (error) {
    console.error("Order creation error:", error);
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }
}
