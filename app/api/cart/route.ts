import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Cart from "@/models/Cart";
import Product from "@/models/Product" // make sure you have this model

// GET cart by userId
export async function GET(req: Request) {
  await connectDB();
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ error: "Missing userId" }, { status: 400 });
  }

  const cart = await Cart.findOne({ userId });
  return NextResponse.json(cart || { items: [], total: 0 });
}



// POST /api/cart
export async function POST(req: Request) {
  try {
    const { userId, productId, quantity } = await req.json()

    // find or create cart
    let cart = await Cart.findOne({ userId })
    if (!cart) {
      cart = new Cart({ userId, items: [], total: 0 })
    }

    // fetch product from DB to get price & name
    const product = await Product.findById(productId)
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

  // check if already in cart
const existingItem = cart.items.find((item: any) => item.productId.toString() === productId)

if (existingItem) {
  existingItem.quantity += quantity
} else {
  cart.items.push({
    productId: product._id,
    name: product.title, // ✅ title من Product schema
    price: Number((product.price * 1.15).toFixed(2)), // ✅ السعر بعد الضريبة
    quantity,
  })
}


    // recalc total safely
    cart.total = cart.items
      .filter((item: any) => item && item.price != null && item.quantity != null)
      .reduce((acc: number, item: any) => acc + item.price * item.quantity, 0)

    await cart.save()
    return NextResponse.json(cart, { status: 200 })
  } catch (error: any) {
    console.error("Error in POST /api/cart:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// UPDATE quantity
export async function PUT(req: Request) {
  await connectDB();
  const body = await req.json();
  const { userId, productId, quantity } = body;

  const cart = await Cart.findOne({ userId });
  if (!cart) return NextResponse.json({ error: "Cart not found" }, { status: 404 });

  const item = cart.items.find((i: any) => i.productId === productId);
  if (item) item.quantity = quantity;

  cart.total = cart.items.reduce((acc: number, item: any) => acc + item.price * item.quantity, 0);
  await cart.save();

  return NextResponse.json(cart);
}

// DELETE item
export async function DELETE(req: Request) {
  await connectDB();
  const body = await req.json();
  const { userId, productId } = body;

  const cart = await Cart.findOne({ userId });
  if (!cart) return NextResponse.json({ error: "Cart not found" }, { status: 404 });

  cart.items = cart.items.filter((i: any) => i.productId !== productId);
  cart.total = cart.items.reduce((acc: number, item: any) => acc + item.price * item.quantity, 0);
  await cart.save();

  return NextResponse.json(cart);
}
