// app/api/products/route.ts
import { NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import Product from "@/models/Product"
import { put } from '@vercel/blob';

// Fallback for development without blob
async function uploadToBlobFallback(file: File): Promise<string> {
  console.log("📝 Using fallback storage for file:", file.name);
  
  // Convert file to base64 for simple storage
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const base64 = buffer.toString('base64');
  
  return `data:${file.type};base64,${base64}`;
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const formData = await req.formData();

    // Extract form data
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const price = formData.get("price") as string;
    const category = formData.get("category") as string;
    const featured = formData.get("featured") as string;
    const status = formData.get("status") as string || "مسودة";

    // Validate required fields
    if (!title?.trim() || !description?.trim() || !price || !category?.trim()) {
      return NextResponse.json(
        { success: false, error: "جميع الحقول المطلوبة يجب ملؤها" }, 
        { status: 400 }
      );
    }

    // Parse options
    const parseOptions = (optionsString: string | null, optionName: string) => {
      try {
        if (!optionsString) return [];
        const options = JSON.parse(optionsString);
        if (!Array.isArray(options)) return [];
        return options
          .map((opt: any) => {
            if (typeof opt === 'string') {
              return { name: opt, priceAddition: 0 };
            }
            return {
              name: String(opt?.name || ''),
              priceAddition: parseFloat(opt?.priceAddition) || 0
            };
          })
          .filter((opt: any) => opt.name && opt.name.trim() !== "");
      } catch (error) {
        console.error(`Error parsing ${optionName}:`, error);
        return [];
      }
    };

    const sizeOptions = parseOptions(formData.get("sizeOptions") as string, "sizeOptions");
    const sideOptions = parseOptions(formData.get("sideOptions") as string, "sideOptions");
    const materialOptions = parseOptions(formData.get("materialOptions") as string, "materialOptions");

    // Parse quantity options
    let quantityOptions: any[] = [];
    try {
      const quantityData = formData.get("quantityOptions") as string;
      if (quantityData) {
        const parsedData = JSON.parse(quantityData);
        if (Array.isArray(parsedData)) {
          quantityOptions = parsedData
            .filter((opt: any) => opt && opt.quantity !== undefined && opt.price !== undefined)
            .map((opt: any) => ({
              quantity: parseInt(opt.quantity) || 0,
              price: parseFloat(opt.price) || 0
            }));
        }
      }
    } catch (error) {
      console.error("Error parsing quantity options:", error);
      quantityOptions = [];
    }

    // Handle image uploads
    const imageFiles = formData.getAll("images") as File[];
    const images: string[] = [];

    if (imageFiles.length > 0 && imageFiles[0].size > 0) {
      console.log(`📤 Processing ${imageFiles.length} images...`);
      
      for (const file of imageFiles) {
        if (file.size === 0) {
          console.log("Skipping empty file");
          continue;
        }

        try {
          let imageUrl: string;
          
          // Try Vercel Blob first
          if (process.env.BLOB_READ_WRITE_TOKEN) {
            console.log(`🔄 Uploading ${file.name} to Vercel Blob...`);
            const blob = await put(`products/${Date.now()}-${file.name}`, file, {
              access: 'public',
            });
            imageUrl = blob.url;
            console.log("✅ Uploaded to Vercel Blob:", imageUrl);
          } else {
            // Fallback for development
            console.log(`🔄 Using fallback storage for ${file.name}`);
            imageUrl = await uploadToBlobFallback(file);
            console.log("⚠️ Using fallback storage");
          }
          
          images.push(imageUrl);
          
        } catch (err: any) {
          console.error("❌ Upload error:", err);
          // Continue with other images even if one fails
          images.push("/placeholder.svg");
        }
      }
    } else {
      console.log("No images provided, using placeholder");
      images.push("/placeholder.svg");
    }

    // Create product data object
    const productData = {
      title: title.trim(),
      description: description.trim(),
      price: parseFloat(price),
      category: category.trim(),
      featured: featured === "true",
      status: status,
      image: images,
      sizeOptions,
      sideOptions,
      materialOptions,
      quantityOptions,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    console.log("📦 Creating product with data:", {
      title: productData.title,
      category: productData.category,
      price: productData.price,
      imagesCount: productData.image.length,
      featured: productData.featured,
      status: productData.status,
      sizeOptions: productData.sizeOptions,
      sideOptions: productData.sideOptions,
      materialOptions: productData.materialOptions,
      quantityOptions: productData.quantityOptions
    });

    // Create and save product
    const product = new Product(productData);
    const savedProduct = await product.save();

    console.log("✅ Product created successfully:", savedProduct._id);

    return NextResponse.json({ 
      success: true, 
      product: {
        id: savedProduct._id,
        title: savedProduct.title,
        description: savedProduct.description,
        price: savedProduct.price,
        category: savedProduct.category,
        featured: savedProduct.featured,
        status: savedProduct.status,
        image: savedProduct.image,
        sizeOptions: savedProduct.sizeOptions,
        sideOptions: savedProduct.sideOptions,
        materialOptions: savedProduct.materialOptions,
        quantityOptions: savedProduct.quantityOptions
      },
      message: "تم إنشاء المنتج بنجاح",
      storage: process.env.BLOB_READ_WRITE_TOKEN ? "vercel-blob" : "fallback"
    }, { status: 201 });

  } catch (err: any) {
    console.error("❌ Error in POST /api/products:", err);
    
    // MongoDB validation errors
    if (err.name === 'ValidationError') {
      const errorDetails = Object.values(err.errors).map((e: any) => ({
        field: e.path,
        message: e.message
      }));
      return NextResponse.json(
        { success: false, error: "فشل في التحقق من البيانات", details: errorDetails }, 
        { status: 400 }
      );
    }
    
    // MongoDB duplicate key errors
    if (err.code === 11000) {
      return NextResponse.json(
        { success: false, error: "منتج بنفس الاسم موجود مسبقاً" }, 
        { status: 400 }
      );
    }
    
    // General server error
    return NextResponse.json(
      { success: false, error: "فشل في حفظ المنتج", message: err.message }, 
      { status: 500 }
    );
  }
}

// GET all products
export async function GET(req: Request) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const category = searchParams.get('category');
    const featured = searchParams.get('featured');
    const status = searchParams.get('status');
    const search = searchParams.get('search');

    const skip = (page - 1) * limit;

    // Build filter object
    const filter: any = {};
    
    if (category && category !== 'all') {
      filter.category = category;
    }
    
    if (featured) {
      filter.featured = featured === 'true';
    }
    
    if (status) {
      filter.status = status;
    }
    
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Get products with pagination
    const products = await Product.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select('-__v');

    // Get total count for pagination
    const total = await Product.countDocuments(filter);
    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      success: true,
      products,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    });

  } catch (err: any) {
    console.error("❌ Error in GET /api/products:", err);
    return NextResponse.json(
      { success: false, error: "فشل في جلب المنتجات", message: err.message }, 
      { status: 500 }
    );
  }
}