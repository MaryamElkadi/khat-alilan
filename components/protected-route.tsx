"use client"

import { useEffect, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import { useAdminAuth } from "@/lib/admin-auth"

interface ProtectedRouteProps {
  children: ReactNode
  requireAdmin?: boolean
  fallbackPath?: string
}

export function ProtectedRoute({ children, requireAdmin = false, fallbackPath = "/login" }: ProtectedRouteProps) {
  const { user, isAdmin, isLoading } = useAdminAuth()
  const router = useRouter()

  useEffect(() => {
    if (isLoading) return

    // Check if user is authenticated
    if (!user) {
      router.push(fallbackPath)
      return
    }

    // Check if admin access is required
    if (requireAdmin && !isAdmin) {
      router.push("/")
      return
    }
  }, [user, isAdmin, isLoading, router, requireAdmin, fallbackPath])

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-blue mx-auto mb-4"></div>
          <p className="text-muted-foreground">جاري التحميل...</p>
        </div>
      </div>
    )
  }

  // Don't render if user doesn't have access
  if (!user || (requireAdmin && !isAdmin)) {
    return null
  }

  return <>{children}</>
}
