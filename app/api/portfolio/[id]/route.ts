import { NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import Portfolio from "@/models/Portfolio"

// GET single item by ID
export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB()
    const { id } = await params

    const portfolio = await Portfolio.findById(id)

    if (!portfolio) {
      return NextResponse.json({ error: "لم يتم العثور على العمل" }, { status: 404 })
    }

    return NextResponse.json(portfolio)
  } catch (error) {
    console.error("Error fetching portfolio:", error)
    return NextResponse.json(
      { error: "خطأ في الخادم الداخلي" },
      { status: 500 }
    )
  }
}

// UPDATE item by ID
export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB()
    const { id } = await params
    const body = await req.json()

    const updatedPortfolio = await Portfolio.findByIdAndUpdate(
      id,
      body,
      { new: true, runValidators: true }
    )

    if (!updatedPortfolio) {
      return NextResponse.json({ error: "لم يتم العثور على العمل" }, { status: 404 })
    }

    return NextResponse.json(updatedPortfolio)
  } catch (error) {
    console.error("Error updating portfolio:", error)
    return NextResponse.json(
      { error: "خطأ في الخادم الداخلي" },
      { status: 500 }
    )
  }
}

// DELETE item by ID
export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB()
    const { id } = await params

    const deletedPortfolio = await Portfolio.findByIdAndDelete(id)

    if (!deletedPortfolio) {
      return NextResponse.json({ error: "لم يتم العثور على العمل" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      message: "تم حذف العمل بنجاح"
    })
  } catch (error) {
    console.error("Error deleting portfolio:", error)
    return NextResponse.json(
      { error: "خطأ في الخادم الداخلي" },
      { status: 500 }
    )
  }
}