export interface Product {
  id: string
  title: string
  description: string
  price: number
  image: string
  category: string
  featured: boolean
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
