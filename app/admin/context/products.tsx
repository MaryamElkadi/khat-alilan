"use client"

import { createContext, useContext, useState, ReactNode } from "react"

const initialProducts = [
  {
    id: "logo-design-package",
    title: "باقة تصميم الشعار الاحترافية",
    description: "تصميم شعار احترافي مع دليل الهوية البصرية الكامل",
    price: 1500,
    image: "/professional-logo-design-package.jpg",
    category: "تصميم جرافيك",
    featured: true,
    status: "نشط",
    sales: 45,
  },
  // Add more products as needed
]

interface Product {
  id: string
  title: string
  description: string
  price: number
  image: string
  category: string
  featured: boolean
  status: string
  sales: number
}

interface ProductsContextType {
  products: Product[]
  setProducts: (products: Product[]) => void
}

const ProductsContext = createContext<ProductsContextType>({
  products: [],
  setProducts: () => {},
})

export const ProductsProvider = ({ children }: { children: ReactNode }) => {
  const [products, setProducts] = useState<Product[]>(initialProducts)
  
  return (
    <ProductsContext.Provider value={{ products, setProducts }}>
      {children}
    </ProductsContext.Provider>
  )
}

export const useProducts = () => useContext(ProductsContext)