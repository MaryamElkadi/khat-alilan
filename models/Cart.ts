// models/Cart.ts
import mongoose, { Schema, Document } from 'mongoose'

export interface ICartItem {
  productId: mongoose.Types.ObjectId
  name: string
  price: number
  quantity: number
  image?: string
  selectedOptions?: any
}

export interface ICart extends Document {
  userId: string
  items: ICartItem[]
  total: number
  createdAt: Date
  updatedAt: Date
}

const CartItemSchema: Schema = new Schema({
  productId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Product'
  },
  name: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
    default: 1
  },
  image: {
    type: String,
    default: '/placeholder.svg'
  },
  selectedOptions: {
    type: Schema.Types.Mixed,
    default: {}
  }
})

const CartSchema: Schema = new Schema({
  userId: {
    type: String,
    required: true,
    unique: true
  },
  items: [CartItemSchema],
  total: {
    type: Number,
    required: true,
    default: 0,
    min: 0
  }
}, {
  timestamps: true
})

export default mongoose.models.Cart || mongoose.model<ICart>('Cart', CartSchema)