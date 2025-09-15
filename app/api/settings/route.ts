import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Settings from "@/models/Settings";

// جلب الإعدادات (GET)
export async function GET() {
  await connectDB();
  const settings = await Settings.findOne();
  
  
  if (!settings) {
    const defaultSettings = await Settings.create({
      siteName: "خط الإعلان",
      email: "info@khat.com",
      phone: "+20123456789",
    });
    return NextResponse.json(defaultSettings);
  }

  return NextResponse.json(settings);
}

// تحديث الإعدادات (PUT)
export async function PUT(req: Request) {
  await connectDB();
  const body = await req.json();

  let settings = await Settings.findOne();
  if (!settings) {
    settings = await Settings.create(body);
  } else {
    settings.siteName = body.siteName;
    settings.email = body.email;
    settings.phone = body.phone;
    await settings.save();
  }

  return NextResponse.json(settings);
}
