import { NextResponse } from "next/server"
import clientPromise from "@/lib/db"

export async function GET() {
  try {
    const client = await clientPromise
    const db = client.db("khat-alilan")

    // مثال: جدول المبيعات
    const sales = await db.collection("sales").aggregate([
      {
        $group: {
          _id: "$month",
          total: { $sum: "$amount" },
        },
      },
      { $sort: { _id: 1 } }
    ]).toArray()

    // مثال: جدول التصنيفات
    const categories = await db.collection("sales").aggregate([
      {
        $group: {
          _id: "$category",
          total: { $sum: "$amount" },
        },
      },
    ]).toArray()

    return NextResponse.json({
      salesData: sales.map(s => ({ name: s._id, value: s.total })),
      categoryData: categories.map(c => ({ name: c._id, value: c.total }))
    })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Failed to fetch reports" }, { status: 500 })
  }
}
