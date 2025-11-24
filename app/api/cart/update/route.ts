import { NextResponse } from "next/server";
import Cart from "@/models/Cart";
import { connectDB } from "@/lib/db";

export async function PUT(req: Request) {
  try {
    await connectDB();
    const { userId, productId, quantity } = await req.json();

    if (!userId || !productId || quantity === undefined) {
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

    const item = cart.items.find((i: any) => i.productId === productId);

    if (!item) {
      return NextResponse.json(
        { message: "Item not found" },
        { status: 404 }
      );
    }

    item.quantity = quantity;

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
