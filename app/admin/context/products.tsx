// app/admin/context/products.tsx
"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface Product {
  _id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  featured: boolean;
  status: string;
  image: string[];
  sizeOptions: any[];
  sideOptions: any[];
  materialOptions: any[];
  quantityOptions: any[];
  createdAt: string;
  updatedAt: string;
}

interface ProductsContextType {
  products: Product[];
  setProducts: (products: Product[]) => void;
  loading: boolean;
  refreshProducts: () => Promise<void>;
}

const ProductsContext = createContext<ProductsContextType | undefined>(undefined);

export function ProductsProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const refreshProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/products');
      const result = await response.json();
      
      if (result.success && Array.isArray(result.products)) {
        setProducts(result.products);
      } else {
        console.error('Invalid products data:', result);
        setProducts([]);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshProducts();
  }, []);

  return (
    <ProductsContext.Provider value={{ 
      products, 
      setProducts, 
      loading, 
      refreshProducts 
    }}>
      {children}
    </ProductsContext.Provider>
  );
}

export function useProducts() {
  const context = useContext(ProductsContext);
  if (context === undefined) {
    throw new Error('useProducts must be used within a ProductsProvider');
  }
  return context;
}