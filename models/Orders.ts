import mongoose, { Schema, models } from "mongoose";

const orderSchema = new Schema(
  {
    customer: { type: String, required: true }, // could be userId or username

    // ✅ multiple products instead of single string
    items: [
      {
        product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
        name: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true },
      },
    ],

    // ✅ shipping info
    shippingInfo: {
      firstName: { type: String },
      lastName: { type: String },
      email: { type: String },
      phone: { type: String },
      address: { type: String },
      city: { type: String },
      postalCode: { type: String },
      country: { type: String },
    },

    // ✅ payment method
    paymentMethod: {
      type: String,
      enum: ["card", "cash"],
      required: true,
    },

    // ✅ total order amount
    total: { type: Number, required: true },

    // ✅ keep status in Arabic like before
    status: {
      type: String,
      enum: ["جديد", "قيد التنفيذ", "مكتمل"],
      default: "جديد",
    },

    // order date (string or auto timestamp)
    date: { type: String, required: true },
  },
  { timestamps: true }
);

const Order = models.Order || mongoose.model("Order", orderSchema);
export default Order;
