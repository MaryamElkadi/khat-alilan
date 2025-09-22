import { NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import mongoose, { Schema } from "mongoose"

// Define schema once
const serviceSchema = new Schema(
  {
    title: String,
    description: String,
    icon: String,
    price: String,
    duration: String,
    rating: Number,
    features: [String], // ✅ make it an array
  },
  { timestamps: true }
)

const Service = mongoose.models.Service || mongoose.model("Service", serviceSchema)

// GET all services
export async function GET() {
  try {
    await connectDB()
    const services = await Service.find()
    return NextResponse.json(services)
  } catch (error) {
    console.error("GET services error:", error)
    return NextResponse.json({ error: "Failed to fetch services" }, { status: 500 })
  }
}

// POST new service
export async function POST(req: Request) {
  try {
    await connectDB()
    const body = await req.json()
    const newService = new Service(body)
    await newService.save()
    return NextResponse.json(newService, { status: 201 })
  } catch (error) {
    console.error("POST service error:", error)
    return NextResponse.json({ error: "Failed to add service" }, { status: 500 })
  }
}
