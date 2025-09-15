import { NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import User from "@/models/user" // هتعمل موديل User زي order

export async function POST(req: Request) {
  try {
    await connectDB()
    const { name, email, password } = await req.json()

    // Check if user exists
    const existing = await User.findOne({ email })
    if (existing) {
      return NextResponse.json({ error: "البريد مسجل بالفعل" }, { status: 400 })
    }

    // Create user
    const newUser = await User.create({ name, email, password })
    return NextResponse.json(newUser, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "فشل إنشاء الحساب" }, { status: 500 })
  }
}
