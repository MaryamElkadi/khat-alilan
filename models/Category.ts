import mongoose, { Schema, Document } from 'mongoose'

export interface ICategory extends Document {
  name: string
  description?: string
  slug: string
  image?: string
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

const CategorySchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true
    },
    description: {
      type: String,
      trim: true,
      default: ""
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true
    },
    image: {
      type: String,
      default: '/placeholder-category.svg'
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
)

// Create slug from name before saving
CategorySchema.pre('save', function (next) {
  if (this.isModified('name')) {
    // Generate slug from name
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9\u0600-\u06FF -]/g, '') // Support Arabic characters
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
  }
  next()
})

// Also handle update operations
CategorySchema.pre('findOneAndUpdate', function (next) {
  const update = this.getUpdate() as any
  if (update.name) {
    update.slug = update.name
      .toLowerCase()
      .replace(/[^a-z0-9\u0600-\u06FF -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
  }
  next()
})

export default mongoose.models.Category || mongoose.model<ICategory>('Category', CategorySchema)