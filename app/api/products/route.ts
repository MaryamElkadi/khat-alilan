import { NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import Product from "@/models/Product"
import { writeFile } from "fs/promises"
import path from "path"
import { v4 as uuidv4 } from 'uuid';
import { mkdir } from "fs/promises"

export async function GET() {
  try {
    await connectDB()
    const products = await Product.find({})
    return NextResponse.json(products, { status: 200 })
  } catch (error: any) {
    console.error("❌ GET /api/products error:", error.message, error.stack)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();

    const formData = await req.formData();

    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const price = parseFloat(formData.get("price") as string);
    const category = formData.get("category") as string;
    const featured = formData.get("featured") === "true";

    // Parse options and filter out empty strings
    const sizeOptions = JSON.parse(formData.get("sizeOptions") as string || "[]")
      .filter((opt: string) => opt && opt.trim() !== "");
    
    const sideOptions = JSON.parse(formData.get("sideOptions") as string || "[]")
      .filter((opt: string) => opt && opt.trim() !== "");
    
    const materialOptions = JSON.parse(formData.get("materialOptions") as string || "[]")
      .filter((opt: string) => opt && opt.trim() !== "");
    
    const quantityOptions = JSON.parse(formData.get("quantityOptions") as string || "[]")
      .filter((opt: any) => opt && opt.quantity && opt.price);

    // Validate required fields
    if (!title || !description || !price || !category) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" }, 
        { status: 400 }
      );
    }

    // Save images
    const imageFiles = formData.getAll("images") as File[];
    const imagePaths: string[] = [];

    // Ensure upload directory exists
    const uploadDir = path.join(process.cwd(), "public/uploads");
    try {
      await mkdir(uploadDir, { recursive: true });
    } catch (err) {
      console.error("Error creating upload directory:", err);
    }

    for (const file of imageFiles) {
      if (file.size === 0) continue; // Skip empty files
      
      try {
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const fileName = `${uuidv4()}-${file.name}`;
        const filePath = path.join(uploadDir, fileName);
        await writeFile(filePath, buffer);
        imagePaths.push(`/uploads/${fileName}`);
      } catch (err) {
        console.error("Error saving image:", err);
      }
    }

    const product = new Product({
      title,
      description,
      price,
      category,
      featured,
      sizeOptions,
      sideOptions,
      materialOptions,
      quantityOptions,
      image: imagePaths.length ? imagePaths : ["/placeholder.svg"],
    });

    await product.save();

    return NextResponse.json({ 
      success: true, 
      product,
      message: "Product created successfully" 
    });
  } catch (err: any) {
    console.error("Error saving product:", err);
    return NextResponse.json(
      { 
        success: false, 
        error: "Failed to save product",
        details: err.message 
      }, 
      { status: 500 }
    );
  }
}