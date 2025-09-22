import mongoose, { Schema, models } from "mongoose";

const orderSchema = new Schema(
  {
    // customer (can be userId, username, or email)
    customer: { type: String, required: true },

    // ✅ multiple items (embedded array of products)
    items: [
      {
        product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
        name: { type: String, required: true },   // snapshot name in case product changes later
        price: { type: Number, required: true },  // snapshot price
        quantity: { type: Number, required: true },
      },
    ],

    // ✅ shipping info (optional fields allowed)
    shippingInfo: {
      firstName: { type: String, trim: true },
      lastName: { type: String, trim: true },
      email: { type: String, trim: true },
      phone: { type: String, trim: true },
      address: { type: String, trim: true },
      city: { type: String, trim: true },
      postalCode: { type: String, trim: true },
      country: { type: String, trim: true },
    },

    // ✅ payment method (limited options)
    paymentMethod: {
      type: String,
      enum: ["card", "cash"],
      required: true,
    },

    // ✅ total order amount
    total: { type: Number, required: true, min: 0 },

    // ✅ status in Arabic (default = جديد)
    status: {
      type: String,
      enum: ["جديد", "قيد التنفيذ", "مكتمل"],
      default: "جديد",
    },

    // ✅ order date (defaults to now if not provided)
    date: { type: String, default: () => new Date().toISOString() },
  },
  { timestamps: true } // will also add createdAt & updatedAt automatically
);

// Prevent model overwrite in dev
const Order = models.Order || mongoose.model("Order", orderSchema);

export default Order;
