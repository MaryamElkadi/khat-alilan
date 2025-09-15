import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db"; 
import Contact from "@/models/contact"; // هننشئه تحت

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();

    const newMessage = await Contact.create(body);

    return NextResponse.json(newMessage, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
  }
}
