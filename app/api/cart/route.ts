// app/api/cart/route.ts
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Cart from "@/models/Cart";

// GET cart by userId
export async function GET(req: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    console.log("GET /api/cart - userId:", userId);

    if (!userId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }

    const cart = await Cart.findOne({ userId });
    console.log("GET /api/cart - Found cart:", cart ? "yes" : "no");
    
    return NextResponse.json(cart || { items: [], total: 0 });
  } catch (error: any) {
    console.error("Error in GET /api/cart:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST /api/cart - Add item to cart
export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    console.log("POST /api/cart - Request body:", body);

    const { userId, productId, quantity, name, price, image, selectedOptions } = body;

    if (!userId || !productId) {
      console.error("POST /api/cart - Missing required fields:", { userId, productId });
      return NextResponse.json({ 
        error: "Missing required fields: userId and productId are required",
        received: { userId, productId }
      }, { status: 400 });
    }

    // Find or create cart
    let cart = await Cart.findOne({ userId });
    if (!cart) {
      console.log("POST /api/cart - Creating new cart for user:", userId);
      cart = new Cart({ userId, items: [], total: 0 });
    }

    // Check if item already exists in cart
    const existingItemIndex = cart.items.findIndex(
      (item: any) => item.productId.toString() === productId.toString()
    );

    if (existingItemIndex > -1) {
      // Update existing item
      console.log("POST /api/cart - Updating existing item quantity");
      cart.items[existingItemIndex].quantity += (quantity || 1);
    } else {
      // Add new item
      console.log("POST /api/cart - Adding new item to cart");
      cart.items.push({
        productId,
        name: name || "منتج",
        price: Number(price) || 0,
        quantity: quantity || 1,
        image: image || "/placeholder.svg",
        selectedOptions: selectedOptions || {}
      });
    }

    // Recalculate total
    cart.total = cart.items.reduce(
      (acc: number, item: any) => acc + (item.price * item.quantity),
      0
    );

    console.log("POST /api/cart - Saving cart with total:", cart.total);
    await cart.save();
    
    return NextResponse.json(cart);
  } catch (error: any) {
    console.error("Error in POST /api/cart:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// UPDATE quantity
export async function PUT(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    console.log("PUT /api/cart - Request body:", body);

    const { userId, productId, quantity } = body;

    if (!userId || !productId || quantity === undefined) {
      console.error("PUT /api/cart - Missing required fields:", { userId, productId, quantity });
      return NextResponse.json({ 
        error: "Missing required fields: userId, productId, and quantity are required",
        received: { userId, productId, quantity }
      }, { status: 400 });
    }

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      console.error("PUT /api/cart - Cart not found for user:", userId);
      return NextResponse.json({ error: "Cart not found" }, { status: 404 });
    }

    const item = cart.items.find((i: any) => i.productId.toString() === productId.toString());
    if (item) {
      console.log("PUT /api/cart - Updating quantity from", item.quantity, "to", quantity);
      item.quantity = quantity;
    } else {
      console.error("PUT /api/cart - Item not found in cart:", productId);
      return NextResponse.json({ error: "Item not found in cart" }, { status: 404 });
    }

    // Recalculate total
    cart.total = cart.items.reduce(
      (acc: number, item: any) => acc + (item.price * item.quantity),
      0
    );

    console.log("PUT /api/cart - Saving cart with total:", cart.total);
    await cart.save();
    return NextResponse.json(cart);
  } catch (error: any) {
    console.error("Error in PUT /api/cart:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE item
export async function DELETE(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    console.log("DELETE /api/cart - Request body:", body);

    const { userId, productId } = body;

    if (!userId || !productId) {
      console.error("DELETE /api/cart - Missing required fields:", { userId, productId });
      return NextResponse.json({ 
        error: "Missing required fields: userId and productId are required",
        received: { userId, productId }
      }, { status: 400 });
    }

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      console.error("DELETE /api/cart - Cart not found for user:", userId);
      return NextResponse.json({ error: "Cart not found" }, { status: 404 });
    }

    console.log("DELETE /api/cart - Removing item:", productId);
    // Remove item from cart
    cart.items = cart.items.filter((i: any) => i.productId.toString() !== productId.toString());

    // Recalculate total
    cart.total = cart.items.reduce(
      (acc: number, item: any) => acc + (item.price * item.quantity),
      0
    );

    console.log("DELETE /api/cart - Saving cart with total:", cart.total);
    await cart.save();
    return NextResponse.json(cart);
  } catch (error: any) {
    console.error("Error in DELETE /api/cart:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}