import { NextResponse } from "next/server";
import Cart from "@/models/Cart";
import { connectDB } from "@/lib/db";

// Helper function to calculate total from items
const calculateCartTotal = (items: any[]) => {
  return items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
};

export async function PUT(req: Request) {
  try {
    await connectDB();
    const { userId, productId, quantity } = await req.json();

    if (!userId || !productId || quantity === undefined) {
      return NextResponse.json(
        { message: "Missing required fields: userId, productId, and quantity are required" },
        { status: 400 }
      );
    }

    // Validate quantity
    if (quantity < 1) {
      return NextResponse.json(
        { message: "Quantity must be at least 1" },
        { status: 400 }
      );
    }

    // Find the cart
    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return NextResponse.json(
        { message: "Cart not found" },
        { status: 404 }
      );
    }

    // Clean up any invalid items first
    const validItems = cart.items.filter(item => 
      item.name && item.price !== undefined && item.productId
    );

    if (validItems.length !== cart.items.length) {
      console.log(`Cleaned up ${cart.items.length - validItems.length} invalid items`);
      cart.items = validItems;
    }

    // Find the item to update
    const itemIndex = cart.items.findIndex((item: any) => 
      item.productId.toString() === productId
    );

    if (itemIndex === -1) {
      return NextResponse.json(
        { message: "Item not found in cart" },
        { status: 404 }
      );
    }

    // Update quantity
    cart.items[itemIndex].quantity = quantity;

    // Calculate new totals
    const subtotal = calculateCartTotal(cart.items);
    const tax = subtotal * 0.15;
    cart.total = subtotal + tax;

    // Save the updated cart
    await cart.save();

    return NextResponse.json(
      { 
        success: true,
        message: "Quantity updated successfully",
        items: cart.items,
        total: cart.total 
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("Error in PUT /api/cart/update:", err);
    return NextResponse.json(
      { message: "Server error", error: err },
      { status: 500 }
    );
  }
}