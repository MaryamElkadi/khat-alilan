import mongoose, { Schema, models } from "mongoose";

const userSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    phone: { type: String },
    password: { type: String, required: true }, // hashed if using auth
  },
  { timestamps: true }
);

const User = models.User || mongoose.model("User", userSchema);
export default User;
