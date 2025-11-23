import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Product from "@/models/Product";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;

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