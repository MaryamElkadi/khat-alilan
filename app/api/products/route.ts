// app/api/products/route.ts
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

    // Debug: Check if Product model has the correct schema
    console.log("Product schema paths:", Product.schema.paths);

    const formData = await req.formData();

    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const price = parseFloat(formData.get("price") as string);
    const category = formData.get("category") as string;
    const featured = formData.get("featured") === "true";

    // Parse options with better error handling
    const parseOptions = (optionsString: string | null, optionName: string) => {
      try {
        const rawOptions = optionsString || "[]";
        console.log(`${optionName} raw:`, rawOptions);
        
        const options = JSON.parse(rawOptions);
        console.log(`${optionName} parsed:`, options);
        
        // Handle both old string format and new object format
        const processedOptions = options.map((opt: any) => {
          if (typeof opt === 'string') {
            return { name: opt, priceAddition: 0 };
          }
          return {
            name: opt?.name || '',
            priceAddition: parseFloat(opt?.priceAddition) || 0
          };
        }).filter((opt: any) => opt.name && opt.name.trim() !== "");
        
        console.log(`${optionName} processed:`, processedOptions);
        return processedOptions;
      } catch (error) {
        console.error(`Error parsing ${optionName}:`, error);
        return [];
      }
    };

    const sizeOptions = parseOptions(formData.get("sizeOptions") as string, "sizeOptions");
    const sideOptions = parseOptions(formData.get("sideOptions") as string, "sideOptions");
    const materialOptions = parseOptions(formData.get("materialOptions") as string, "materialOptions");

    const quantityOptions = JSON.parse(formData.get("quantityOptions") as string || "[]")
      .filter((opt: any) => opt && opt.quantity && opt.price)
      .map((opt: any) => ({
        quantity: parseInt(opt.quantity),
        price: parseFloat(opt.price)
      }));

    // Validate required fields
    if (!title || !description || isNaN(price) || !category) {
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
      if (file.size === 0) continue;
      
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

    // Create product data
    const productData = {
      title: title.trim(),
      description: description.trim(),
      price: price,
      category: category.trim(),
      featured: featured,
      sizeOptions: sizeOptions,
      sideOptions: sideOptions,
      materialOptions: materialOptions,
      quantityOptions: quantityOptions,
      image: imagePaths.length ? imagePaths : ["/placeholder.svg"],
    };

    console.log("Final product data:", JSON.stringify(productData, null, 2));

    // Create and validate product
    const product = new Product(productData);

    // Test the schema by checking what Mongoose expects
    console.log("SizeOptions schema type:", Product.schema.path('sizeOptions'));
    console.log("SideOptions schema type:", Product.schema.path('sideOptions'));
    console.log("MaterialOptions schema type:", Product.schema.path('materialOptions'));

    const validationError = product.validateSync();
    if (validationError) {
      console.error("Detailed validation error:", validationError);
      return NextResponse.json(
        { 
          success: false, 
          error: "Validation failed",
          details: validationError.errors 
        }, 
        { status: 400 }
      );
    }

    await product.save();

    return NextResponse.json({ 
      success: true, 
      product,
      message: "Product created successfully" 
    });
  } catch (err: any) {
    console.error("Error saving product:", err);
    
    // More detailed error response
    if (err.name === 'ValidationError') {
      const errorDetails = Object.values(err.errors).map((e: any) => ({
        field: e.path,
        message: e.message,
        value: e.value
      }));
      
      return NextResponse.json(
        { 
          success: false, 
          error: "Validation failed",
          details: errorDetails
        }, 
        { status: 400 }
      );
    }
    
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