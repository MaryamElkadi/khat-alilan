// models/Order.ts
import mongoose, { Schema, models } from "mongoose";

const orderSchema = new Schema(
  {
    // ✅ Connect to User model
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    
    // ✅ Auto-generated order number
    orderNumber: {
      type: String,
      unique: true,
      required: true
    },

    // ✅ Multiple items supporting both Product and Service
    items: [
      {
        product: {
          type: Schema.Types.ObjectId,
          refPath: 'items.modelType',
          required: true
        },
        modelType: {
          type: String,
          enum: ['Product', 'Service'],
          required: true
        },
        name: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true, default: 1 }
      },
    ],

    // ✅ Shipping information
    shippingInfo: {
      firstName: { type: String, trim: true },
      lastName: { type: String, trim: true },
      email: { type: String, trim: true },
      phone: { type: String, trim: true },
      address: { type: String, trim: true },
      city: { type: String, trim: true },
      postalCode: { type: String, trim: true },
      country: { type: String, trim: true, default: "السعودية" },
    },

    // ✅ Payment information
    paymentMethod: {
      type: String,
      enum: ["card", "cash"],
      required: true,
      default: "cash"
    },
    
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending"
    },

    // ✅ Order status in Arabic
    status: {
      type: String,
      enum: ["جديد", "قيد التنفيذ", "مكتمل", "ملغي"],
      default: "جديد",
    },

    // ✅ Total amount
    totalAmount: { 
      type: Number, 
      required: true, 
      min: 0 
    },

    // ✅ Additional notes
    notes: { type: String, trim: true }
  },
  { 
    timestamps: true 
  }
);

// ✅ Generate order number before saving
orderSchema.pre('save', async function(next) {
  if (this.isNew) {
    const count = await mongoose.model('Order').countDocuments();
    this.orderNumber = `ORD-${Date.now()}-${count + 1}`;
  }
  next();
});

const Order = models.Order || mongoose.model("Order", orderSchema);
export default Order;