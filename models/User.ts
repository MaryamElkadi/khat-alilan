// models/User.ts
import mongoose, { Schema, models } from "mongoose";

const userSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    phone: { type: String },
    password: { type: String, required: true },
    role: { 
      type: String, 
      enum: ['admin', 'user'], 
      default: 'user' 
    },
    orders: [{
      type: Schema.Types.ObjectId,
      ref: 'Order'
    }]
  },
  { timestamps: true }
);

const User = models.User || mongoose.model("User", userSchema);
export default User;