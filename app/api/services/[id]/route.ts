import { NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import mongoose, { Schema } from "mongoose"

const serviceSchema = new Schema(
  {
    title: String,
    description: String,
    icon: String,
    price: String,
    duration: String,
    rating: Number,
    features: [String],
  },
  { timestamps: true }
)

const Service = mongoose.models.Service || mongoose.model("Service", serviceSchema)

// GET a single service by ID
export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params; // ✅ Correct way to get the ID
    await connectDB();
    const service = await Service.findById(id);

    if (!service) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 });
    }

    return NextResponse.json(service, { status: 200 });
  } catch (error) {
    console.error("GET service by ID error:", error);
    return NextResponse.json({ error: "Failed to fetch service" }, { status: 500 });
  }
}

// ✅ Update service by ID
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const body = await req.json();

    const updated = await Service.findByIdAndUpdate(params.id, body, { new: true });

    if (!updated) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch (error) {
    console.error("PUT service error:", error);
    return NextResponse.json({ error: "Failed to update service" }, { status: 500 });
  }
}

// ✅ Delete service by ID
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const deleted = await Service.findByIdAndDelete(params.id);

    if (!deleted) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Service deleted successfully" });
  } catch (error) {
    console.error("DELETE service error:", error);
    return NextResponse.json({ error: "Failed to delete service" }, { status: 500 });
  }
}