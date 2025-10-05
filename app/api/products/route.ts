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
    const products = await Product.find({}).sort({ createdAt: -1 })
    return NextResponse.json(products, { status: 200 })
  } catch (error: any) {
    console.error("❌ GET /api/products error:", error.message)
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();

    const formData = await req.formData();

    // Extract all form data
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

    // Parse numeric fields
    const priceValue = parseFloat(price);
    if (isNaN(priceValue) || priceValue < 0) {
      return NextResponse.json(
        { success: false, error: "السعر يجب أن يكون رقم صحيح" }, 
        { status: 400 }
      );
    }

    // Parse options with better error handling
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
        quantityOptions = JSON.parse(quantityData)
          .filter((opt: any) => opt && opt.quantity && opt.price)
          .map((opt: any) => ({
            quantity: parseInt(opt.quantity),
            price: parseFloat(opt.price)
          }));
      }
    } catch (error) {
      console.error("Error parsing quantity options:", error);
      quantityOptions = [];
    }

    // Handle image uploads
    const imageFiles = formData.getAll("images") as File[];
    const images: string[] = [];

    if (imageFiles.length > 0 && imageFiles[0].size > 0) {
      // Ensure upload directory exists
      const uploadDir = path.join(process.cwd(), "public/uploads");
      try {
        await mkdir(uploadDir, { recursive: true });
        console.log("Upload directory ready:", uploadDir);
      } catch (err) {
        console.error("Error creating upload directory:", err);
        return NextResponse.json(
          { success: false, error: "فشل في إنشاء مجلد التحميل" },
          { status: 500 }
        );
      }

      // Process each image
      for (const file of imageFiles) {
        if (file.size === 0) {
          console.log("Skipping empty file");
          continue;
        }
        
        try {
          const bytes = await file.arrayBuffer();
          const buffer = Buffer.from(bytes);
          
          // Create unique filename
          const fileExtension = file.name.split('.').pop() || 'jpg';
          const fileName = `${uuidv4()}.${fileExtension}`;
          const filePath = path.join(uploadDir, fileName);
          
          await writeFile(filePath, buffer);
          
          // Use the correct path that will be accessible from the browser
          const imageUrl = `/uploads/${fileName}`;
          images.push(imageUrl);
          
          console.log("Image saved successfully:", imageUrl);
        } catch (err) {
          console.error("Error saving image:", err);
          return NextResponse.json(
            { success: false, error: "فشل في حفظ الصور" },
            { status: 500 }
          );
        }
      }
    } else {
      // If no images uploaded, use placeholder
      images.push("/placeholder.svg");
    }

    // Create product data object
    const productData = {
      title: title.trim(),
      description: description.trim(),
      price: priceValue,
      category: category.trim(),
      featured: featured === "true",
      status: status,
      image: images, // Use 'image' field to match your schema
      sizeOptions,
      sideOptions,
      materialOptions,
      quantityOptions
    };

    console.log("Creating product with data:", JSON.stringify(productData, null, 2));

    // Create and save product
    const product = new Product(productData);
    
    // Validate the product
    const validationError = product.validateSync();
    if (validationError) {
      console.error("Validation error details:", validationError);
      const errorMessages = Object.values(validationError.errors).map((err: any) => err.message);
      return NextResponse.json(
        { 
          success: false, 
          error: "فشل في التحقق من البيانات",
          details: errorMessages 
        }, 
        { status: 400 }
      );
    }

    const savedProduct = await product.save();
    console.log("Product saved successfully:", savedProduct._id);

    return NextResponse.json({ 
      success: true, 
      product: savedProduct,
      message: "تم إنشاء المنتج بنجاح" 
    }, { status: 201 });

  } catch (err: any) {
    console.error("❌ Error in POST /api/products:", err);
    
    // Handle different types of errors
    if (err.name === 'ValidationError') {
      const errorDetails = Object.values(err.errors).map((e: any) => ({
        field: e.path,
        message: e.message
      }));
      
      return NextResponse.json(
        { 
          success: false, 
          error: "فشل في التحقق من البيانات",
          details: errorDetails
        }, 
        { status: 400 }
      );
    }
    
    if (err.code === 11000) {
      return NextResponse.json(
        { 
          success: false, 
          error: "منتج بنفس الاسم موجود مسبقاً" 
        }, 
        { status: 409 }
      );
    }
    
    return NextResponse.json(
      { 
        success: false, 
        error: "فشل في حفظ المنتج",
        message: err.message 
      }, 
      { status: 500 }
    );
  }
}