// /app/api/cart/route.ts

import { NextResponse } from "next/server";
import Cart from "@/models/Cart";
import { connectDB } from "@/lib/db";

// Helper function to calculate total from items
const calculateCartTotal = (items: any[]) => {
  return items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
};

// Handle POST requests (add to cart)
export async function POST(req: Request) {
  try {
    await connectDB();
    const { userId, productId, name, price, image, selectedOptions, quantity = 1 } = await req.json();

    if (!userId || !productId || !name || price === undefined) {
      return NextResponse.json(
        { message: "Missing required fields: userId, productId, name, and price are required" },
        { status: 400 }
      );
    }

    // Find or create cart for user
    let cart = await Cart.findOne({ userId });

    if (!cart) {
      // Create new cart if it doesn't exist
      cart = new Cart({
        userId,
        items: [],
        total: 0
      });
    }

    // FIX: Clean up existing items that might be missing required fields
    const validItems = cart.items.filter(item => 
      item.name && item.price !== undefined && item.productId
    );

    if (validItems.length !== cart.items.length) {
      console.log(`Cleaned up ${cart.items.length - validItems.length} invalid items from cart`);
      cart.items = validItems;
    }

    // Check if item already exists in cart
    const existingItemIndex = cart.items.findIndex((item: any) => 
      item.productId.toString() === productId && 
      JSON.stringify(item.selectedOptions) === JSON.stringify(selectedOptions || {})
    );

    if (existingItemIndex > -1) {
      // Update quantity if item exists
      cart.items[existingItemIndex].quantity += quantity;
    } else {
      // Add new item to cart - make sure all required fields are present
      const newItem = {
        productId,
        name: name.trim(), // Ensure name is not empty
        price: Number(price), // Ensure price is a number
        image: image || "/placeholder.svg",
        selectedOptions: selectedOptions || {},
        quantity: Number(quantity) || 1
      };

      // Validate the new item before adding
      if (!newItem.name || newItem.price === undefined) {
        return NextResponse.json(
          { message: "Invalid item data: name and price are required" },
          { status: 400 }
        );
      }

      cart.items.push(newItem);
    }

    // Calculate new total
    const subtotal = calculateCartTotal(cart.items);
    const tax = subtotal * 0.15;
    cart.total = subtotal + tax;

    await cart.save();

    return NextResponse.json(
      { 
        message: "Product added to cart successfully",
        items: cart.items,
        total: cart.total 
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("Error in POST /api/cart:", err);
    return NextResponse.json(
      { message: "Server error", error: err },
      { status: 500 }
    );
  }
}

// Handle DELETE requests (remove from cart)
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

    // FIX: Clean up any invalid items first
    const validItems = cart.items.filter(item => 
      item.name && item.price !== undefined && item.productId
    );

    if (validItems.length !== cart.items.length) {
      console.log(`Cleaned up ${cart.items.length - validItems.length} invalid items before deletion`);
      cart.items = validItems;
    }

    // Remove the specific item
    const initialLength = cart.items.length;
    cart.items = cart.items.filter((item: any) => 
      item.productId.toString() !== productId
    );

    if (cart.items.length === initialLength) {
      return NextResponse.json(
        { message: "Item not found in cart" },
        { status: 404 }
      );
    }

    // Calculate new total
    const newSubtotal = calculateCartTotal(cart.items);
    const newTax = newSubtotal * 0.15;
    cart.total = newSubtotal + newTax;

    await cart.save();

    return NextResponse.json(
      { 
        message: "Item removed from cart successfully",
        items: cart.items, 
        total: cart.total 
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("Error in DELETE /api/cart:", err);
    return NextResponse.json(
      { message: "Server error", error: err },
      { status: 500 }
    );
  }
}