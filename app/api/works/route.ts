// app/api/works/route.ts
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import fs from "fs";
import path from "path";

export const config = {
  api: {
    bodyParser: false,
  },
};

// GET handler to fetch all works
export async function GET() {
  try {
    const db = await connectDB();
    const works = await db.connection.db.collection("works").find({}).toArray();
    
    return NextResponse.json(works);
  } catch (error) {
    console.error("Error fetching works:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST handler to create a new work
export async function POST(req: Request) {
  try {
    const db = await connectDB();
    
    const uploadDir = path.join(process.cwd(), "public/uploads");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // Get the form data
    const formData = await req.formData();
    
    // Convert to object for processing
    const fields: Record<string, any> = {};
    let imagePath = null;

    for (const [key, value] of formData.entries()) {
      if (value instanceof File) {
        // Handle file upload
        if (value.size > 0) { // Only process if file is not empty
          const file = value;
          const timestamp = Date.now();
          const extension = file.name.split('.').pop();
          const filename = `${timestamp}.${extension}`;
          const filepath = path.join(uploadDir, filename);
          
          // Save file
          const bytes = await file.arrayBuffer();
          const buffer = Buffer.from(bytes);
          fs.writeFileSync(filepath, buffer);
          
          imagePath = `/uploads/${filename}`;
        }
      } else {
        fields[key] = value;
      }
    }

    const work = {
      title: fields.title || "",
      description: fields.description || "",
      categories: fields.categories ? JSON.parse(fields.categories) : [],
      featured: fields.featured === "true",
      image: imagePath,
      createdAt: new Date(),
    };

    const result = await db.connection.db.collection("works").insertOne(work);
    
    return NextResponse.json({ 
      success: true, 
      id: result.insertedId,
      path: imagePath
    });

  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}