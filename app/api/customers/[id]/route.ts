// app/api/customers/[id]/route.ts
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import mongoose from "mongoose";
import { ObjectId } from "mongodb";

// DELETE customer
export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    await mongoose.connection.db
      .collection("customers")
      .deleteOne({ _id: new ObjectId(params.id) });

    return NextResponse.json({ message: "Customer deleted" });
  } catch (error) {
    console.error("Error deleting customer:", error);
    return NextResponse.json({ error: "Failed to delete customer" }, { status: 500 });
  }
}


export async function GET(_: Request, { params }: { params: { id: string } }) {
  try {
    await connectDB()
    const customer = await mongoose.connection.db
      .collection("customers")
      .findOne({ _id: new ObjectId(params.id) })

    return NextResponse.json(customer)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch customer" }, { status: 500 })
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    await connectDB()
    const body = await req.json()

    const result = await mongoose.connection.db
      .collection("customers")
      .updateOne(
        { _id: new ObjectId(params.id) },
        { $set: body }
      )

    if (result.modifiedCount === 0) {
      return NextResponse.json({ error: "Customer not found or not updated" }, { status: 404 })
    }

    return NextResponse.json({ message: "Customer updated successfully ✅" })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Failed to update customer" }, { status: 500 })
  }
}
