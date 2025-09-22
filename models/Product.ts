// models/Product.ts
import mongoose from "mongoose";

// Clear any existing model to force schema update
if (mongoose.models.Product) {
  delete mongoose.models.Product;
}

const ProductSchema = new mongoose.Schema({
  title: { type: String, required: true },  
  description: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: [String], default: ["/placeholder.svg"] },
  featured: { type: Boolean, default: false },
  category: { type: String, required: true },

  // Updated schema for options with price additions - FIXED STRUCTURE
  sizeOptions: { 
    type: [{
      name: { type: String, required: true },
      priceAddition: { type: Number, default: 0 }
    }], 
    default: [] 
  },     
  sideOptions: { 
    type: [{
      name: { type: String, required: true },
      priceAddition: { type: Number, default: 0 }
    }], 
    default: [] 
  },     
  materialOptions: { 
    type: [{
      name: { type: String, required: true },
      priceAddition: { type: Number, default: 0 }
    }], 
    default: [] 
  }, 
  quantityOptions: { 
    type: [{
      quantity: { type: Number, required: true },
      price: { type: Number, required: true }
    }], 
    default: [] 
  },

}, { timestamps: true });

// Create the model
const Product = mongoose.model("Product", ProductSchema);

export default Product;