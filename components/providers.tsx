// components/providers.tsx
"use client"

import { SessionProvider } from "next-auth/react"
import { CartProvider } from "@/lib/CartProvider"
import { AuthProvider } from "@/lib/auth-context"
import { AdminAuthProvider } from "@/lib/admin-auth"
import { ToastProvider } from "@/components/ToastProvider"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <AdminAuthProvider>
        <AuthProvider>
          <CartProvider>
            <ToastProvider>
              {children}
            </ToastProvider>
          </CartProvider>
        </AuthProvider>
      </AdminAuthProvider>
    </SessionProvider>
  )
}