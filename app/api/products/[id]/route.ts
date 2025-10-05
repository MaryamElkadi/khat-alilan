import { NextResponse } from "next/server";
import { connectDB } from "@/models/Product"; // Import from models/Product
import Product from "@/models/Product";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    await connectDB();

    const { id } = params;
    const product = await Product.findById(id);

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(product, { status: 200 });
  } catch (error) {
    console.error("Error fetching product:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const id = params.id;
    if (!id) {
      return NextResponse.json({ error: "Product ID is required" }, { status: 400 });
    }

    const formData = await req.formData();
    
    // Get text fields
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const price = parseFloat(formData.get("price") as string) || 0;
    const category = formData.get("category") as string;
    const featured = formData.get("featured") === "true";
    const status = formData.get("status") as string;

    // Parse options with proper error handling
    const sizeOptions = JSON.parse(formData.get("sizeOptions") as string || "[]");
    const sideOptions = JSON.parse(formData.get("sideOptions") as string || "[]");
    const materialOptions = JSON.parse(formData.get("materialOptions") as string || "[]");
    const quantityOptions = JSON.parse(formData.get("quantityOptions") as string || "[]");
    const existingImages = JSON.parse(formData.get("existingImages") as string || "[]");

    // Handle images
    const images: string[] = [...existingImages];
    
    // If new images are uploaded, add them (you'll need to implement actual file upload)
    const uploadedImages = formData.getAll("images") as File[];
    if (uploadedImages.length > 0 && uploadedImages[0].size > 0) {
      // For now, we'll just use placeholder URLs
      // You should implement actual file upload to cloud storage
      uploadedImages.forEach(file => {
        // This is just a placeholder - implement your actual file upload logic
        images.push(`/uploads/${file.name}`);
      });
    }

    const result = await Product.findByIdAndUpdate(
      id,
      {
        title,
        description,
        price,
        category,
        featured,
        status,
        sizeOptions,
        sideOptions,
        materialOptions,
        quantityOptions,
        image: images,
      },
      { new: true, runValidators: true }
    );

    if (!result) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Error updating product:", error);
    return NextResponse.json(
      { error: "Error updating product", details: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    if (!params?.id) {
      return NextResponse.json({ error: "Product ID is required" }, { status: 400 });
    }

    const deletedProduct = await Product.findByIdAndDelete(params.id);

    if (!deletedProduct) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Product deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("DELETE product error:", error);
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
  }
}