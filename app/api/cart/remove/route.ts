import { NextResponse } from "next/server";
import Cart from "@/models/Cart";
import { connectDB } from "@/lib/db";

export async function DELETE(req: Request) {
  try {
    await connectDB();
    const { userId, productId } = await req.json();

    if (!userId || !productId) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return NextResponse.json(
        { message: "Cart not found" },
        { status: 404 }
      );
    }

    cart.items = cart.items.filter((i: any) => i.productId !== productId);

    await cart.save();

    return NextResponse.json(
      { items: cart.items, total: cart.total },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json(
      { message: "Server error", error: err },
      { status: 500 }
    );
  }
}
