// models/Order.ts
import mongoose, { Schema, models } from "mongoose";

// 🚀 Force delete existing model to ensure fresh schema
if (mongoose.models.Order) {
  delete mongoose.models.Order;
}

const orderSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: false, // Explicitly set to false
      default: null // Add default value
    },

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
        quantity: { type: Number, required: true, default: 1 },
        designFile: { type: String, required: false }
      }
    ],

    shippingInfo: {
      customer: { type: String, trim: true },
      email: { type: String, trim: true },
      phone: { type: String, trim: true },
      address: { type: String, trim: true },
      city: { type: String, trim: true },
      postalCode: { type: String, trim: true },
      country: { type: String, trim: true, default: "السعودية" },
    },

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

    status: {
      type: String,
      enum: ["جديد", "قيد التنفيذ", "مكتمل", "ملغي"],
      default: "جديد",
    },

    totalAmount: { 
      type: Number, 
      required: true, 
      min: 0 
    },

    notes: { type: String, trim: true },

    // 🚀 FIX: Make orderNumber not required and let the pre-save hook handle it
    orderNumber: { 
      type: String, 
      unique: true,
      required: false // Remove required constraint
    }
  },
  { 
    timestamps: true 
  }
);

// ✅ Generate order number before saving
orderSchema.pre('save', async function(next) {
  if (this.isNew && !this.orderNumber) {
    try {
      const count = await mongoose.model('Order').countDocuments();
      this.orderNumber = `ORD-${Date.now()}-${count + 1}`;
    } catch (error) {
      // Fallback if count fails
      this.orderNumber = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    }
  }
  next();
});

const Order = models.Order || mongoose.model("Order", orderSchema);
export default Order;