import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Product from "@/models/Product";
import { ObjectId } from "mongodb";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    console.log("Fetching product with ID:", params.id);

    if (!params.id || params.id === "undefined") {
      return NextResponse.json({ error: "Product ID is required" }, { status: 400 });
    }

    await connectDB();
    
    // Using the Product model directly is simpler and more reliable
    const product = await Product.findById(params.id);

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error("Error fetching product:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const id = params.id;

    const formData = await req.formData();

    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const price = parseFloat(formData.get("price") as string) || 0;
    const category = formData.get("category") as string;
    const featured = formData.get("featured") === "true";
    const status = formData.get("status") as string;

const sizeOptions = parseOptions(formData.get("sizeOptions") as string);
const sideOptions = parseOptions(formData.get("sideOptions") as string);
const materialOptions = parseOptions(formData.get("materialOptions") as string);
    const quantityOptions = JSON.parse(formData.get("quantityOptions") as string || "[]");

    const images: string[] = [];

    if (formData.has("existingImages")) {
      images.push(...JSON.parse(formData.get("existingImages") as string || "[]"));
    }

    // handle uploaded images if needed
    const uploadedImages = formData.getAll("images") as File[];
    uploadedImages.forEach(file => {
      // Here you’d upload file somewhere (S3, cloudinary, etc.)
      // For now, push placeholder
      images.push(`/uploads/${file.name}`);
    });

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
      { new: true }
    );

    if (!result) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error updating product:", error);
    return NextResponse.json({ error: "Error updating product" }, { status: 500 });
  }
}


export async function DELETE(req: Request, context: { params: { id: string } }) {
  try {
    const { params } = await context;
    await connectDB();

    if (!params.id || params.id === "undefined") {
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
