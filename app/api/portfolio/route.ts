import { NextResponse } from "next/server"
import { connectDB } from "@/lib/db"  // لاحظ هنا {} لإنك عاملاه export function
import Portfolio from "@/models/Portfolio"

// ✅ GET: رجّع كل البورتفوليو
export async function GET() {
  await connectDB()
  const items = await Portfolio.find({})
  return NextResponse.json(items)
}

// ✅ POST: أضف بورتفوليو جديد
export async function POST(req: Request) {
  await connectDB()
  const formData = await req.formData()

  const title = formData.get("title") as string
  const description = formData.get("description") as string
  const categories = JSON.parse(formData.get("categories") as string)
  const image = formData.get("image") as File | null

  let imageUrl = ""
  if (image) {
    // تقدر ترفعها على Cloudinary أو تحفظها محلي
    imageUrl = `/uploads/${image.name}`
  }

  const newPortfolio = await Portfolio.create({
    title,
    description,
    category: categories[0] || "",
    image: imageUrl,
  })

  return NextResponse.json(newPortfolio, { status: 201 })
}
