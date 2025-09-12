// context/products.tsx
import { createContext, useContext, useState, ReactNode } from "react"

const ProductsContext = createContext<any>(null)

export const ProductsProvider = ({ children }: { children: ReactNode }) => {
  const [products, setProducts] = useState(initialProducts)
  return (
    <ProductsContext.Provider value={{ products, setProducts }}>
      {children}
    </ProductsContext.Provider>
  )
}

export const useProducts = () => useContext(ProductsContext)
