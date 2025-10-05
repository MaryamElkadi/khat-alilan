// models/Product.ts
import mongoose from "mongoose";

// Clear any existing model to force schema update
if (mongoose.models.Product) {
  delete mongoose.models.Product;
}

let isConnected = false;

export async function connectDB() {
  if (isConnected) return;

  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI as string, {
      dbName: "yourdbname", // 🔹 change if needed
    });

    isConnected = true;
    console.log("✅ MongoDB connected:", conn.connection.host);
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    throw error;
  }
}

const ProductSchema = new mongoose.Schema({
  title: { type: String, required: true },  
  description: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: [String], default: ["/placeholder.svg"] },
  featured: { type: Boolean, default: false },
  category: { type: String, required: true },
  status: { type: String, default: "نشط" }, // Added missing status field

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