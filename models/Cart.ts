import mongoose, { Schema, Document } from "mongoose";

export interface ICart extends Document {
  userId: string; // identify which user owns the cart
  items: {
    productId: string;
    title: string;
    price: number;
    quantity: number;
    image?: string;
    category?: string;
    description?: string;
  }[];
  total: number;
}

const CartSchema = new Schema<ICart>(
  {
    userId: { type: String, required: true },
    items: [
      {
        productId: { type: String, required: true },
        title: String,
        price: Number,
        quantity: Number,
        image: String,
        category: String,
        description: String,
      },
    ],
    total: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.models.Cart || mongoose.model<ICart>("Cart", CartSchema);
