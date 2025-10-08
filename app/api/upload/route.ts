import { NextResponse } from "next/server";
import { put } from "@vercel/blob";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: "Only image files are allowed" }, { status: 400 });
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB in bytes
    if (file.size > maxSize) {
      return NextResponse.json({ error: "File size too large. Maximum 10MB allowed" }, { status: 400 });
    }

    // Upload to Vercel Blob
    const blob = await put(`products/${Date.now()}-${file.name}`, file, {
      access: 'public',
    });

    console.log("✅ Image uploaded to Vercel Blob:", blob.url);

    return NextResponse.json({ 
      success: true,
      url: blob.url,
      pathname: blob.pathname,
      message: "File uploaded successfully"
    });

  } catch (err: any) {
    console.error("Upload error:", err);
    
    // Handle Vercel Blob specific errors
    if (err.message?.includes('No token found')) {
      return NextResponse.json(
        { error: "Storage configuration error. Please check BLOB_READ_WRITE_TOKEN environment variable." },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { error: "Upload failed", details: err.message },
      { status: 500 }
    );
  }
}