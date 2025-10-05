// app/api/orders/[id]/route.ts
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Order from "@/models/Orders";
import User from "@/models/User";

// GET single order by ID
export async function GET(req: Request, context: { params: { id: string } }) {
  try {
    const { id } = context.params;
    await connectDB();
    
    const order = await Order.findById(id)
      .populate('user', 'name email phone')
      .populate('items.product', 'title name price image description');
    
    if (!order) {
      return NextResponse.json(
        { error: "الطلب غير موجود" }, 
        { status: 404 }
      );
    }
    
    return NextResponse.json(order, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch order:", error);
    return NextResponse.json(
      { error: "فشل في جلب بيانات الطلب" }, 
      { status: 500 }
    );
  }
}

// UPDATE order by ID
export async function PUT(req: Request, context: { params: { id: string } }) {
  try {
    const { id } = context.params;
    await connectDB();
    const data = await req.json();

    // Find existing order first
    const existingOrder = await Order.findById(id);
    if (!existingOrder) {
      return NextResponse.json(
        { error: "الطلب غير موجود" }, 
        { status: 404 }
      );
    }

    let updateData = { ...data };

    // ✅ Recalculate total if items are updated
    if (data.items && Array.isArray(data.items)) {
      const totalAmount = data.items.reduce(
        (acc: number, item: any) => acc + (item.price * (item.quantity || 1)),
        0
      );
      updateData.totalAmount = totalAmount;
    }

    // ✅ Validate status values
    if (data.status && !["جديد", "قيد التنفيذ", "مكتمل", "ملغي"].includes(data.status)) {
      return NextResponse.json(
        { error: "حالة الطلب غير صالحة" }, 
        { status: 400 }
      );
    }

    if (data.paymentStatus && !["pending", "paid", "failed"].includes(data.paymentStatus)) {
      return NextResponse.json(
        { error: "حالة الدفع غير صالحة" }, 
        { status: 400 }
      );
    }

    if (data.paymentMethod && !["card", "cash"].includes(data.paymentMethod)) {
      return NextResponse.json(
        { error: "طريقة الدفع غير صالحة" }, 
        { status: 400 }
      );
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      id, 
      updateData, 
      { new: true, runValidators: true }
    )
      .populate('user', 'name email phone')
      .populate('items.product', 'title name price image description');

    return NextResponse.json(
      { 
        success: true,
        order: updatedOrder,
        message: "تم تحديث الطلب بنجاح" 
      }, 
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Failed to update order:", error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map((err: any) => err.message);
      return NextResponse.json(
        { error: "بيانات غير صالحة", details: errors }, 
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: "فشل في تحديث الطلب" }, 
      { status: 500 }
    );
  }
}

// DELETE order by ID
export async function DELETE(req: Request, context: { params: { id: string } }) {
  try {
    const { id } = context.params;
    await connectDB();

    // Find the order first to get user ID
    const order = await Order.findById(id);
    if (!order) {
      return NextResponse.json(
        { error: "الطلب غير موجود" }, 
        { status: 404 }
      );
    }

    // ✅ Remove order reference from user's orders array
    if (order.user) {
      await User.findByIdAndUpdate(
        order.user,
        { $pull: { orders: id } }
      );
    }

    const deletedOrder = await Order.findByIdAndDelete(id);

    return NextResponse.json(
      { 
        success: true,
        message: "تم حذف الطلب بنجاح",
        deletedOrder: deletedOrder 
      }, 
      { status: 200 }
    );
  } catch (error) {
    console.error("Failed to delete order:", error);
    return NextResponse.json(
      { error: "فشل في حذف الطلب" }, 
      { status: 500 }
    );
  }
}