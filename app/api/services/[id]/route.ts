import { NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import mongoose, { Schema } from "mongoose"

// Define schema (or import it if you already created one)
const serviceSchema = new Schema({
  title: String,
  description: String,
  icon: String,
  price: String,
  duration: String,
  rating: Number,
  features: String,
}, { timestamps: true })

const Service = mongoose.models.Service || mongoose.model("Service", serviceSchema)

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    await connectDB()
    const body = await req.json()

    await Service.findByIdAndUpdate(params.id, body, { new: true })

    return NextResponse.json({ message: "Service updated" })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Failed to update service" }, { status: 500 })
  }
}
