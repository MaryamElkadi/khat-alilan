
import { NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import { ObjectId } from "mongodb"


export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const db = await connectDB()
    const portfolio = await db.connection.db.collection("portfolio").findOne({ 
      _id: new ObjectId(params.id) 
    })
    
    if (!portfolio) {
      return NextResponse.json({ error: "portfolio not found" }, { status: 404 })
    }
    
    return NextResponse.json(portfolio)
  } catch (error) {
    console.error("Error fetching work:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

// DELETE work
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const db = await connectDB()
    const result = await db.connection.db.collection("portfolio").deleteOne({ 
      _id: new ObjectId(params.id) 
    })
    
    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Work not found" }, { status: 404 })
    }
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting work:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

// UPDATE work
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const db = await connectDB()
    const body = await req.json()
    
    // Remove _id from body if present to avoid update issues
    const { _id, ...updateData } = body
    
    const result = await db.connection.db.collection("portfolio").updateOne(
      { _id: new ObjectId(params.id) },
      { $set: updateData }
    )
    
    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Work not found" }, { status: 404 })
    }
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error updating work:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}