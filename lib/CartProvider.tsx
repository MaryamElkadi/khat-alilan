"use client"

import { createContext, useContext, useReducer, useEffect, type ReactNode } from "react"

export interface CartItem {
  _id: string
  name: string
  price: number
  quantity: number
}

interface CartState {
  items: CartItem[]
  total: number
  itemCount: number
}

type CartAction =
  | { type: "SET_CART"; payload: CartItem[] }
  | { type: "ADD_ITEM"; payload: CartItem }
  | { type: "REMOVE_ITEM"; payload: string }
  | { type: "UPDATE_QUANTITY"; payload: { id: string; quantity: number } }
  | { type: "CLEAR_CART" }

const CartContext = createContext<{
  state: CartState
  dispatch: React.Dispatch<CartAction>
} | null>(null)

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "SET_CART": {
      const total = action.payload.reduce((sum, item) => sum + item.price * item.quantity, 0)
      const itemCount = action.payload.reduce((sum, item) => sum + item.quantity, 0)
      return { items: action.payload, total, itemCount }
    }

    case "ADD_ITEM": {
      const existing = state.items.find((item) => item._id === action.payload._id)
      let newItems
      if (existing) {
        newItems = state.items.map((item) =>
          item._id === action.payload._id ? { ...item, quantity: item.quantity + 1 } : item
        )
      } else {
        newItems = [...state.items, { ...action.payload, quantity: 1 }]
      }
      return {
        items: newItems,
        total: newItems.reduce((sum, i) => sum + i.price * i.quantity, 0),
        itemCount: newItems.reduce((sum, i) => sum + i.quantity, 0),
      }
    }

    case "REMOVE_ITEM": {
      const newItems = state.items.filter((i) => i._id !== action.payload)
      return {
        items: newItems,
        total: newItems.reduce((sum, i) => sum + i.price * i.quantity, 0),
        itemCount: newItems.reduce((sum, i) => sum + i.quantity, 0),
      }
    }

    case "UPDATE_QUANTITY": {
      const updatedItems = state.items
        .map((i) =>
          i._id === action.payload.id ? { ...i, quantity: Math.max(1, action.payload.quantity) } : i
        )
      return {
        items: updatedItems,
        total: updatedItems.reduce((sum, i) => sum + i.price * i.quantity, 0),
        itemCount: updatedItems.reduce((sum, i) => sum + i.quantity, 0),
      }
    }

    case "CLEAR_CART":
      return { items: [], total: 0, itemCount: 0 }

    default:
      return state
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [], total: 0, itemCount: 0 })

  // Load from backend
  useEffect(() => {
    const fetchCart = async () => {
      const res = await fetch("/api/cart?userId=123")
      if (res.ok) {
        const data = await res.json()
        dispatch({ type: "SET_CART", payload: data.items || [] })
      }
    }
    fetchCart()
  }, [])

  return <CartContext.Provider value={{ state, dispatch }}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error("useCart must be used within a CartProvider")
  return {
    items: ctx.state.items,
    total: ctx.state.total,
    itemCount: ctx.state.itemCount,
    addItem: (p: CartItem) => ctx.dispatch({ type: "ADD_ITEM", payload: p }),
    removeItem: (id: string) => ctx.dispatch({ type: "REMOVE_ITEM", payload: id }),
    updateQuantity: (id: string, q: number) => ctx.dispatch({ type: "UPDATE_QUANTITY", payload: { id, quantity: q } }),
    clearCart: () => ctx.dispatch({ type: "CLEAR_CART" }),
  }
}
