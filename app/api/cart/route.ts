// /app/api/cart/route.ts

import { NextResponse } from "next/server";
import Cart from "@/models/Cart";
import { connectDB } from "@/lib/db";

// Helper function to calculate total from items
const calculateCartTotal = (items: any[]) => {
  return items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
};

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

    // --- Core Fix: Use $pull to remove the item and find the updated document ---
    const updatedCart = await Cart.findOneAndUpdate(
      { userId },
      {
        $pull: {
          items: { productId: productId }, // Use $pull to remove the item matching the productId
        },
      },
      { new: true } // Return the updated document
    );

    if (!updatedCart) {
      return NextResponse.json(
        { message: "Cart not found or item not present" },
        { status: 404 }
      );
    }

    // Recalculate and update the total based on the remaining items
    // This step is crucial if the total is a required field.
    const newSubtotal = calculateCartTotal(updatedCart.items);
    // Assuming a fixed 15% tax rate
    const newTax = newSubtotal * 0.15;
    const newTotal = newSubtotal + newTax;

    // Save the new total back to the cart document
    updatedCart.total = newTotal;

    // Saving the document will re-run the validation on the entire document (including remaining items)
    // If the validation is still failing here, it confirms an *existing* item is missing 'name'.
    await updatedCart.save(); 

    // console.log(`DELETE /api/cart - Saving cart with total: ${newTotal.toFixed(2)}`); // Debug log

    return NextResponse.json(
      { items: updatedCart.items, total: updatedCart.total },
      { status: 200 }
    );
  } catch (err) {
    console.error("Error in DELETE /api/cart:", err); // Log the error on the server
    return NextResponse.json(
      { message: "Server error", error: err },
      { status: 500 }
    );
  }
}