// app/api/products/[id]/route.ts
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Product from "@/models/Product.ts";
import formidable from "formidable";

type Params = { params: { id: string } };

export async function GET(req: Request) {
  try {
    await connectDB();

    const url = new URL(req.url);
    const featured = url.searchParams.get("featured");

    // Only filter if featured=true
    const filter = featured === "true" ? { featured: true } : {};

    const products = await Product.find(filter);
    return NextResponse.json(products, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}


export async function PUT(req: Request, context: { params: { id: string } }) {
  await connectDB();
  const { params } = context;

  const form = new formidable.IncomingForm();
  form.keepExtensions = true;

  const data: any = await new Promise((resolve, reject) => {
    form.parse(req as any, (err, fields, files) => {
      if (err) reject(err);
      else resolve({ fields, files });
    });
  });

  const updateData: any = {
    ...data.fields,
    price: Number(data.fields.price),
    featured: data.fields.featured === "true",
  };

  // If images uploaded, save their paths (implement your own storage logic)
  if (data.files.images) {
    const files = Array.isArray(data.files.images)
      ? data.files.images
      : [data.files.images];
    updateData.image = files.map((f: any) => `/uploads/${f.newFilename}`);
  }

  const updatedProduct = await Product.findByIdAndUpdate(params.id, updateData, { new: true });
  if (!updatedProduct)
    return NextResponse.json({ error: "Product not found" }, { status: 404 });

  return NextResponse.json(updatedProduct, { status: 200 });
}


export async function DELETE(req: Request, context: Params) {
  try {
    const { params } = await context; // ✅ await context first
    await connectDB();

    const deletedProduct = await Product.findByIdAndDelete(params.id);

    if (!deletedProduct) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Product deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
  }
}
