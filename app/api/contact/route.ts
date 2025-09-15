import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db"; 
import Contact from "@/models/contact"; // هننشئه تحت


export async function POST(req: Request) {
  try {
    const db = await connectDB()
    const body = await req.json()

    const result = await db.connection.db.collection("contacts").insertOne({
      ...body,
      createdAt: new Date(),
    })

    return NextResponse.json({ success: true, id: result.insertedId })
  } catch (error) {
    return NextResponse.json({ error: "فشل الإرسال" }, { status: 500 })
  }
}

// 🟢 الأدمن يجيب كل الرسائل
export async function GET() {
  try {
    const db = await connectDB()
    const contacts = await db.connection.db.collection("contacts").find({}).sort({ createdAt: -1 }).toArray()
    return NextResponse.json(contacts)
  } catch (error) {
    return NextResponse.json({ error: "فشل في جلب الرسائل" }, { status: 500 })
  }
}