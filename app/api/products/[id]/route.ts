import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Product from "@/models/Product";

// GET single product
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params; // ✅ AWAIT THE PARAMS

    console.log("🔍 Fetching product with ID:", id);

    if (!id) {
      return NextResponse.json(
        { success: false, error: "معرف المنتج مطلوب" }, 
        { status: 400 }
      );
    }

    const product = await Product.findById(id);

    if (!product) {
      return NextResponse.json(
        { success: false, error: "المنتج غير موجود" }, 
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      product
    }, { status: 200 });

  } catch (error: any) {
    console.error("❌ Error fetching product:", error);
    return NextResponse.json(
      { success: false, error: "خطأ في السيرفر", message: error.message }, 
      { status: 500 }
    );
  }
}

// UPDATE product
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params; // ✅ AWAIT THE PARAMS

    console.log("🔄 Updating product with ID:", id);

    if (!id) {
      return NextResponse.json(
        { success: false, error: "معرف المنتج مطلوب" }, 
        { status: 400 }
      );
    }

    const updateData = await req.json();
    
    console.log("📦 Update data:", updateData);

    const result = await Product.findByIdAndUpdate(
      id,
      {
        ...updateData,
        updatedAt: new Date(),
      },
      { new: true, runValidators: true }
    );

    if (!result) {
      return NextResponse.json(
        { success: false, error: "المنتج غير موجود" }, 
        { status: 404 }
      );
    }

    console.log("✅ Product updated successfully:", id);

    return NextResponse.json({ 
      success: true, 
      product: result,
      message: "تم تحديث المنتج بنجاح"
    }, { status: 200 });

  } catch (error: any) {
    console.error("❌ Error updating product:", error);
    return NextResponse.json(
      { 
        success: false,
        error: "خطأ في تحديث المنتج", 
        details: error.message 
      },
      { status: 500 }
    );
  }
}

// DELETE product
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params; // ✅ AWAIT THE PARAMS

    console.log("🗑️ Attempting to delete product with ID:", id);

    if (!id) {
      return NextResponse.json(
        { success: false, error: "معرف المنتج مطلوب" }, 
        { status: 400 }
      );
    }

    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return NextResponse.json(
        { success: false, error: "المنتج غير موجود" }, 
        { status: 404 }
      );
    }

    console.log("✅ Product deleted successfully:", id);

    return NextResponse.json({ 
      success: true,
      message: "تم حذف المنتج بنجاح" 
    }, { status: 200 });

  } catch (error: any) {
    console.error("❌ DELETE product error:", error);
    return NextResponse.json({ 
      success: false,
      error: "فشل في حذف المنتج",
      details: error.message 
    }, { status: 500 });
  }
}