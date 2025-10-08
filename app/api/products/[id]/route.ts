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
    const { id } = await params;

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

// UPDATE product
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;

    if (!id) {
      return NextResponse.json({ error: "Product ID is required" }, { status: 400 });
    }

    // Check content type
    const contentType = req.headers.get("content-type");
    
    if (contentType?.includes("application/json")) {
      // Handle JSON data (from your updated frontend)
      const updateData = await req.json();
      
      const result = await Product.findByIdAndUpdate(
        id,
        {
          ...updateData,
          updatedAt: new Date(),
        },
        { new: true, runValidators: true }
      );

      if (!result) {
        return NextResponse.json({ error: "Product not found" }, { status: 404 });
      }

      return NextResponse.json({ 
        success: true, 
        product: result,
        message: "تم تحديث المنتج بنجاح"
      });

    } else if (contentType?.includes("multipart/form-data")) {
      // Handle form data (original approach)
      const formData = await req.formData();
      
      // Get text fields
      const title = formData.get("title") as string;
      const description = formData.get("description") as string;
      const price = parseFloat(formData.get("price") as string) || 0;
      const category = formData.get("category") as string;
      const featured = formData.get("featured") === "true";
      const status = formData.get("status") as string;

      // Parse options with proper error handling
      const parseOptions = (data: string | null) => {
        try {
          if (!data) return [];
          return JSON.parse(data);
        } catch (error) {
          console.error("Error parsing options:", error);
          return [];
        }
      };

      const sizeOptions = parseOptions(formData.get("sizeOptions") as string);
      const sideOptions = parseOptions(formData.get("sideOptions") as string);
      const materialOptions = parseOptions(formData.get("materialOptions") as string);
      const quantityOptions = parseOptions(formData.get("quantityOptions") as string);
      const existingImages = parseOptions(formData.get("existingImages") as string);

      // Handle images
      const images: string[] = [...existingImages];
      
      // If new images are uploaded, add them
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
          updatedAt: new Date(),
        },
        { new: true, runValidators: true }
      );

      if (!result) {
        return NextResponse.json({ error: "Product not found" }, { status: 404 });
      }

      return NextResponse.json({ 
        success: true, 
        product: result,
        message: "تم تحديث المنتج بنجاح"
      });

    } else {
      return NextResponse.json(
        { error: "Unsupported content type" },
        { status: 400 }
      );
    }

  } catch (error: any) {
    console.error("Error updating product:", error);
    return NextResponse.json(
      { 
        success: false,
        error: "Error updating product", 
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
    const { id } = await params;

    if (!id) {
      return NextResponse.json({ error: "Product ID is required" }, { status: 400 });
    }

    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ 
      success: true,
      message: "Product deleted successfully" 
    }, { status: 200 });
  } catch (error) {
    console.error("DELETE product error:", error);
    return NextResponse.json({ 
      success: false,
      error: "Failed to delete product" 
    }, { status: 500 });
  }
}