import mongoose, { Schema, models } from "mongoose";

const productSchema = new Schema({
  title: { type: String, required: true },
  price: { type: Number, required: true },
  featured: { type: Boolean, default: false },
  status: { type: String, enum: ["نشط", "مسودة"], default: "نشط" },
}, { timestamps: true });

const Product = models.Product || mongoose.model("Product", productSchema);
export default Product;
