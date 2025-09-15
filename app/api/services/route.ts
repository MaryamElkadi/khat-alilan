// app/api/services/route.ts
import { NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import { ObjectId } from "mongodb"

export async function GET() {
  try {
    const db = await connectDB()
    const services = await db.connection.db
      .collection("services")
      .find({})
      .toArray()
    return NextResponse.json(services)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch services" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const db = await connectDB()
    const body = await req.json()
    const result = await db.connection.db.collection("services").insertOne(body)
    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json({ error: "Failed to add service" }, { status: 500 })
  }
}
