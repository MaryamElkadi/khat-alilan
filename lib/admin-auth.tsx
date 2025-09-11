"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface User {
  id: string
  email: string
  name: string
  role: "admin" | "user"
}

interface AdminAuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  isAdmin: boolean
}

const AdminAuthContext = createContext<AdminAuthContextType | null>(null)

// Mock admin credentials - in real app, this would be handled by a backend
const ADMIN_CREDENTIALS = {
  email: "admin@khat-al-ilan.com",
  password: "admin123",
  user: {
    id: "admin-1",
    email: "admin@khat-al-ilan.com",
    name: "مدير الموقع",
    role: "admin" as const,
  },
}

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user is logged in from localStorage
    const savedUser = localStorage.getItem("khat-al-ilan-user")
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser))
      } catch (error) {
        localStorage.removeItem("khat-al-ilan-user")
      }
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true)

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Check admin credentials
    if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
      setUser(ADMIN_CREDENTIALS.user)
      localStorage.setItem("khat-al-ilan-user", JSON.stringify(ADMIN_CREDENTIALS.user))
      setIsLoading(false)
      return true
    }

    // For demo purposes, any other email/password creates a regular user
    if (email && password) {
      const regularUser: User = {
        id: `user-${Date.now()}`,
        email,
        name: email.split("@")[0],
        role: "user",
      }
      setUser(regularUser)
      localStorage.setItem("khat-al-ilan-user", JSON.stringify(regularUser))
      setIsLoading(false)
      return true
    }

    setIsLoading(false)
    return false
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("khat-al-ilan-user")
  }

  const isAdmin = user?.role === "admin"

  return (
    <AdminAuthContext.Provider value={{ user, isLoading, login, logout, isAdmin }}>
      {children}
    </AdminAuthContext.Provider>
  )
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext)
  if (!context) {
    throw new Error("useAdminAuth must be used within AdminAuthProvider")
  }
  return context
}
