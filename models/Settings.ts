import mongoose, { Schema, models } from "mongoose";

const settingsSchema = new Schema({
  siteName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
}, { timestamps: true });

const Settings = models.Settings || mongoose.model("Settings", settingsSchema);
export default Settings;
