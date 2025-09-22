// models/Product.ts
import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
  title: { type: String, required: true },  
  description: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: [String], default: ["/placeholder.svg"] },
  featured: { type: Boolean, default: false },
  category: { type: String, required: true },

  // خيارات مرنة حسب المنتج
  sizeOptions: { type: [String], default: [] },     
  sideOptions: { type: [String], default: [] },     
  materialOptions: { type: [String], default: [] }, 
  quantityOptions: { 
    type: [{
      quantity: { type: Number, required: true },
      price: { type: Number, required: true }
    }], 
    default: [] 
  },

}, { timestamps: true });

export default mongoose.models.Product || mongoose.model("Product", ProductSchema);