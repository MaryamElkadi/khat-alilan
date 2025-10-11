import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import mongoose from "mongoose";

// Define schema (optional — or import from your models folder)
const SaleSchema = new mongoose.Schema({
  month: String,
  category: String,
  amount: Number,
}, { collection: "sales" });

const Sale = mongoose.models.Sale || mongoose.model("Sale", SaleSchema);

export async function GET() {
  try {
    // Connect to MongoDB
    await connectDB();

    // Aggregate sales by month
    const sales = await Sale.aggregate([
      {
        $group: {
          _id: "$month",
          total: { $sum: "$amount" },
        },
      },
      { $sort: { _id: 1 } }
    ]);

    // Aggregate sales by category
    const categories = await Sale.aggregate([
      {
        $group: {
          _id: "$category",
          total: { $sum: "$amount" },
        },
      },
    ]);

    // Return response
    return NextResponse.json({
      salesData: sales.map((s) => ({ name: s._id, value: s.total })),
      categoryData: categories.map((c) => ({ name: c._id, value: c.total })),
    });

  } catch (error) {
    console.error("Error generating reports:", error);
    return NextResponse.json(
      { error: "Failed to fetch reports" },
      { status: 500 }
    );
  }
}
