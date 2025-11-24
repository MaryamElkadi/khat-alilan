import { NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import Category from "@/models/Category"

// GET all categories
export async function GET() {
  try {
    await connectDB()

    const categories = await Category.find({})
      .sort({ name: 1 })
      .select('-__v')

    return NextResponse.json({
      success: true,
      categories
    })

  } catch (err: any) {
    console.error("❌ Error in GET /api/categories:", err)
    return NextResponse.json(
      { success: false, error: "فشل في جلب الفئات", message: err.message }, 
      { status: 500 }
    )
  }
}

// CREATE new category
export async function POST(req: Request) {
  try {
    await connectDB()
    const { name, description, image } = await req.json()

    console.log("📦 Creating category with data:", { name, description, image })

    // Validate required fields
    if (!name?.trim()) {
      return NextResponse.json(
        { success: false, error: "اسم الفئة مطلوب" }, 
        { status: 400 }
      )
    }

    const trimmedName = name.trim()

    // Improved slug generation
    let slug = trimmedName
      .toLowerCase()
      // Remove all non-alphanumeric, non-Arabic characters except spaces and hyphens
      .replace(/[^a-z0-9\u0600-\u06FF\s-]/g, '')
      // Replace spaces and multiple hyphens with single hyphen
      .replace(/[\s-]+/g, '-')
      // Remove leading/trailing hyphens
      .replace(/^-+|-+$/g, '')
      .trim()

    // If slug is empty after processing, generate a fallback
    if (!slug) {
      slug = `category-${Date.now()}`
      console.log("⚠️ Generated fallback slug:", slug)
    }

    console.log("🔗 Generated slug:", slug)

    // Check only for duplicate slug (allow duplicate names)
    const existingCategory = await Category.findOne({ 
      slug: slug 
    })

    if (existingCategory) {
      return NextResponse.json(
        { 
          success: false, 
          error: "فئة بنفس الرابط موجودة مسبقاً" 
        }, 
        { status: 400 }
      )
    }

    // Create category
    const category = new Category({
      name: trimmedName,
      description: description?.trim() || "",
      image: image || "/placeholder-category.svg",
      slug: slug,
      isActive: true
    })

    const savedCategory = await category.save()

    console.log("✅ Category created successfully:", savedCategory._id)

    return NextResponse.json({ 
      success: true, 
      category: savedCategory,
      message: "تم إنشاء الفئة بنجاح"
    }, { status: 201 })

  } catch (err: any) {
    console.error("❌ Error in POST /api/categories:", err)
    
    if (err.name === 'ValidationError') {
      const errorDetails = Object.values(err.errors).map((e: any) => ({
        field: e.path,
        message: e.message
      }))
      console.error("Validation errors:", errorDetails)
      return NextResponse.json(
        { success: false, error: "فشل في التحقق من البيانات", details: errorDetails }, 
        { status: 400 }
      )
    }
    
    if (err.code === 11000) {
      // Only show slug duplicate error (since we allow duplicate names)
      return NextResponse.json(
        { 
          success: false, 
          error: "فئة بنفس الرابط موجودة مسبقاً" 
        }, 
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { success: false, error: "فشل في حفظ الفئة", message: err.message }, 
      { status: 500 }
    )
  }
}