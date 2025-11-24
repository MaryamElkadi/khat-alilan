import { NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import Category from "@/models/Category"

// GET single category
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB()
    const { id } = await params

    const category = await Category.findById(id)

    if (!category) {
      return NextResponse.json(
        { success: false, error: "الفئة غير موجودة" }, 
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      category
    })

  } catch (err: any) {
    console.error("❌ Error in GET /api/categories/[id]:", err)
    return NextResponse.json(
      { success: false, error: "فشل في جلب الفئة", message: err.message }, 
      { status: 500 }
    )
  }
}

// UPDATE category
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB()
    const { id } = await params
    const { name, description, image, isActive } = await req.json()

    if (!name?.trim()) {
      return NextResponse.json(
        { success: false, error: "اسم الفئة مطلوب" }, 
        { status: 400 }
      )
    }

    // Check if category exists with same name (excluding current category)
    const existingCategory = await Category.findOne({ 
      name: name.trim(),
      _id: { $ne: id }
    })

    if (existingCategory) {
      return NextResponse.json(
        { success: false, error: "فئة بنفس الاسم موجودة مسبقاً" }, 
        { status: 400 }
      )
    }

    const updatedCategory = await Category.findByIdAndUpdate(
      id,
      {
        name: name.trim(),
        description: description?.trim() || "",
        image: image || "/placeholder-category.svg",
        isActive: isActive !== undefined ? isActive : true
      },
      { new: true, runValidators: true }
    )

    if (!updatedCategory) {
      return NextResponse.json(
        { success: false, error: "الفئة غير موجودة" }, 
        { status: 404 }
      )
    }

    return NextResponse.json({ 
      success: true, 
      category: updatedCategory,
      message: "تم تحديث الفئة بنجاح"
    })

  } catch (err: any) {
    console.error("❌ Error in PUT /api/categories/[id]:", err)
    return NextResponse.json(
      { success: false, error: "فشل في تحديث الفئة", message: err.message }, 
      { status: 500 }
    )
  }
}

// DELETE category
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB()
    const { id } = await params

    const deletedCategory = await Category.findByIdAndDelete(id)

    if (!deletedCategory) {
      return NextResponse.json(
        { success: false, error: "الفئة غير موجودة" }, 
        { status: 404 }
      )
    }

    return NextResponse.json({ 
      success: true,
      message: "تم حذف الفئة بنجاح" 
    })

  } catch (err: any) {
    console.error("❌ Error in DELETE /api/categories/[id]:", err)
    return NextResponse.json(
      { success: false, error: "فشل في حذف الفئة", message: err.message }, 
      { status: 500 }
    )
  }
}