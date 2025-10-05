"use client"

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAdminAuth } from '@/lib/admin-auth'

export function useAdminRoute() {
  const { user, isAdmin, checkAuth } = useAdminAuth()
  const router = useRouter()

  useEffect(() => {
    const currentUser = checkAuth()
    
    if (!currentUser) {
      // Not logged in, redirect to login
      router.push('/login')
      return
    }

    if (!isAdmin()) {
      // Logged in but not admin, redirect to home
      router.push('/')
      return
    }
  }, [user, isAdmin, checkAuth, router])

  return { user, isAdmin }
}