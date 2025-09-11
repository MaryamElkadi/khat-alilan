"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAdminAuth } from "@/lib/admin-auth"

interface RoleBasedRedirectProps {
  adminRedirect?: string
  userRedirect?: string
  requireAuth?: boolean
  requireAdmin?: boolean
}

export function RoleBasedRedirect({
  adminRedirect = "/admin",
  userRedirect = "/",
  requireAuth = false,
  requireAdmin = false,
}: RoleBasedRedirectProps) {
  const { user, isAdmin, isLoading } = useAdminAuth()
  const router = useRouter()

  useEffect(() => {
    if (isLoading) return

    // If authentication is required but user is not logged in
    if (requireAuth && !user) {
      router.push("/login")
      return
    }

    // If admin access is required but user is not admin
    if (requireAdmin && (!user || !isAdmin)) {
      router.push("/login")
      return
    }

    // Redirect based on user role
    if (user && isAdmin && adminRedirect) {
      router.push(adminRedirect)
    } else if (user && !isAdmin && userRedirect) {
      router.push(userRedirect)
    }
  }, [user, isAdmin, isLoading, router, adminRedirect, userRedirect, requireAuth, requireAdmin])

  return null
}
