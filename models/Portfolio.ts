import mongoose, { Schema, models } from "mongoose"

const portfolioSchema = new Schema(
  {
    title: { type: String, required: true },
    category: { type: String, required: true },
    description: { type: String },
    image: { type: String },
    tags: [String],
    featured: { type: Boolean, default: false },
  },
  { timestamps: true }
)

const Portfolio = models.Portfolio || mongoose.model("Portfolio", portfolioSchema)
export default Portfolio
