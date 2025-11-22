import { NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import Portfolio from "@/models/Portfolio"

// GET: Fetch ALL portfolio items
export async function GET() {
  try {
    await connectDB()
    const items = await Portfolio.find({}).sort({ createdAt: -1 })
    return NextResponse.json(items)
  } catch (error) {
    console.error("Error fetching portfolio:", error)
    return NextResponse.json(
      { error: "Failed to fetch portfolio items" },
      { status: 500 }
    )
  }
}

// POST: Add a new portfolio item
export async function POST(req: Request) {
  try {
    await connectDB()
    const body = await req.json()

    const { title, description, category, image, tags, featured } = body

    if (!title || !category || !image) {
      return NextResponse.json(
        { error: "العنوان، التصنيف، والصورة مطلوبة" },
        { status: 400 }
      )
    }

    const newPortfolio = await Portfolio.create({
      title,
      description: description || "",
      category,
      image,
      tags: tags || [],
      featured: featured || false,
    })

    return NextResponse.json(newPortfolio, { status: 201 })
  } catch (error) {
    console.error("Error creating portfolio:", error)
    return NextResponse.json(
      { error: "فشل في إنشاء عنصر البورتفوليو" },
      { status: 500 }
    )
  }
}
