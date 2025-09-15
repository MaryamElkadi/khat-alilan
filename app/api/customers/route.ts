// app/api/customers/route.ts
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import mongoose from "mongoose";
import { ObjectId } from "mongodb";

// GET all customers
export async function GET() {
  try {
    await connectDB();
    const customers = await mongoose.connection.db
      .collection("customers")
      .find({})
      .toArray();

    return NextResponse.json(customers);
  } catch (error) {
    console.error("Error fetching customers:", error);
    return NextResponse.json({ error: "Failed to fetch customers" }, { status: 500 });
  }
}

// POST create new customer
export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();

    const result = await mongoose.connection.db
      .collection("customers")
      .insertOne(body);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error creating customer:", error);
    return NextResponse.json({ error: "Failed to add customer" }, { status: 500 });
  }
}
