"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface CartItem {
  _id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  selectedOptions?: any;
}

interface CartContextType {
  items: CartItem[];
  total: number;
  addItem: (product: any) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  loading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  // Correct user ID getter
  const getUserId = () => {
    if (typeof window === "undefined") return "anonymous";

    let userId = localStorage.getItem("cart_userId");
    if (!userId) {
      userId = "user_" + Math.random().toString(36).substr(2, 9);
      localStorage.setItem("cart_userId", userId);
    }
    return userId;
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const userId = getUserId();

      const res = await fetch(`/api/cart?userId=${userId}`);

      if (res.ok) {
        const cart = await res.json();
        setItems(cart.items || []);
        setTotal(cart.total || 0);
      }
    } catch (error) {
      console.error("Error fetching cart:", error);
    } finally {
      setLoading(false);
    }
  };

  const addItem = async (product: any) => {
    try {
      const userId = getUserId();

      const finalUnitPrice = product.finalPrice || product.price;

      const requestBody = {
        userId,
        productId: product._id || product.productId,
        quantity: 1,
        name: product.title || product.name,
        price: finalUnitPrice,
        image: Array.isArray(product.image) ? product.image[0] : product.image,
        selectedOptions: product.selectedOptions || {},
      };

      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      if (res.ok) {
        const updatedCart = await res.json();
        setItems(updatedCart.items || []);
        setTotal(updatedCart.total || 0);
      } else {
        const error = await res.json();
        console.error("Error adding item:", error);
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };

  // FIXED removeItem
  const removeItem = async (productId: string) => {
    try {
      const userId = getUserId();

      const res = await fetch("/api/cart", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, productId }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message);

      setItems((prev) => prev.filter((i) => i.productId !== productId));
      setTotal(data.total || 0);
    } catch (err) {
      console.error("Error removing item:", err);
    }
  };

  // FIXED updateQuantity
  const updateQuantity = async (productId: string, quantity: number) => {
    try {
      const userId = getUserId();

      const res = await fetch("/api/cart/update", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, productId, quantity }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message);

      // Update state
      setItems((prev) =>
        prev.map((item) =>
          item.productId === productId ? { ...item, quantity } : item
        )
      );

      setTotal(data.total || 0);
    } catch (err) {
      console.error("Error updating quantity:", err);
    }
  };

  const clearCart = async () => {
    try {
      const userId = getUserId();
      for (const item of items) {
        await removeItem(item.productId);
      }
    } catch (error) {
      console.error("Error clearing cart:", error);
    }
  };

  return (
    <CartContext.Provider
      value={{
        items,
        total,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        loading,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used inside CartProvider");
  return context;
}
