import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Order from "@/models/orders";

export async function GET(req: Request, context: { params: { id: string } }) {
  try {
    const { id } = context.params;
    await connectDB();
    const order = await Order.findById(id).populate("items.product");
    if (!order) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(order, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch order" }, { status: 500 });
  }
}

export async function PUT(req: Request, context: { params: { id: string } }) {
  try {
    const { id } = context.params;
    await connectDB();
    const data = await req.json();

    // recalc total if items are updated
    if (data.items) {
      data.total = data.items.reduce(
        (acc: number, item: any) => acc + item.price * item.quantity,
        0
      );
    }

    const updatedOrder = await Order.findByIdAndUpdate(id, data, { new: true });
    if (!updatedOrder) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(updatedOrder, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update order" }, { status: 500 });
  }
}

export async function DELETE(req: Request, context: { params: { id: string } }) {
  try {
    const { id } = context.params;
    await connectDB();
    const deleted = await Order.findByIdAndDelete(id);
    if (!deleted) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ message: "Order deleted successfully" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete order" }, { status: 500 });
  }
}
