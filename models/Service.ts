import mongoose, { Schema, models } from "mongoose";

const serviceSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    icon: { type: String },
    price: { 
  type: Number, 
  required: true, 
  set: (v: any) => Number(v) // يجبر أي قيمة تتحول لرقم
},

    duration: { type: String },
    rating: { type: Number, default: 0 },
    features: [{ type: String }],
  },
  { timestamps: true }
);

const Service = models.Service || mongoose.model("Service", serviceSchema);

export default Service;