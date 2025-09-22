export interface Product {
  _id: string
  id: string
  title: string
  name: string
  description: string
  price: number
  category: string
  image: string | string[]
  featured: boolean
  quantityOptions?: number[]
  createdAt?: string
  updatedAt?: string
}

export interface CartItem extends Product {
  quantity: number
  selectedQuantityOption?: number
}

export interface CartItem extends Product {
  quantity: number
}

export interface User {
  id: string
  name: string
  email: string
  phone?: string
}

export interface Category {
  id: string
  name: string
  description: string
  icon: string
  image: string
}
