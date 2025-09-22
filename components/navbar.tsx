"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { CartDrawer } from "@/components/cart-drawer"
import { useCart } from "@/lib/cart-context"
import { useAuth } from "@/lib/auth-context"
import { useAdminAuth } from "@/lib/admin-auth"
import { useRouter } from "next/navigation"
import { 
  Search, Menu, ShoppingCart, User, LogIn, Shield, ChevronDown, LogOut, Settings 
} from "lucide-react"

const navigationItems = [
  { name: "الرئيسية", href: "/" },
  { name: "الخدمات", href: "/services" },
  { name: "المنتجات", href: "/products" },
  { name: "من نحن", href: "/about" },
  { name: "الطلبات", href: "/orders" },
  { name: "تواصل معنا", href: "/contact" },
]

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  const { items } = useCart()
  const { state, logout } = useAuth()
  const { user: adminUser, isAdmin, logout: adminLogout } = useAdminAuth()
  const router = useRouter()

  const totalItems = items?.reduce((sum, item) => sum + item.quantity, 0) || 0

  useEffect(() => {
    setMounted(true) // ✅ only animate after mount
  }, [])

  const handleLogout = () => {
    logout()
    setIsUserMenuOpen(false)
    router.push("/")
  }

  const handleAdminLogout = () => {
    adminLogout()
    router.push("/")
  }

  return (
    <motion.nav
      initial={mounted ? { y: -100, opacity: 0 } : false}
      animate={mounted ? { y: 0, opacity: 1 } : false}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur"
    >
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold flex items-center">
            <span className="text-brand-yellow">خط</span>
            <span className="text-brand-blue mx-2">الإعلان</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8 space-x-reverse">
            {navigationItems.map((item) => (
              <Link 
                key={item.name}
                href={item.href}
                className="text-foreground hover:text-primary transition-colors font-medium"
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Search */}
          <div className="hidden lg:flex items-center space-x-4 space-x-reverse">
            <div className="relative">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input type="search" placeholder="ابحث عن الخدمات..." className="w-64 pr-10 text-right" />
            </div>
          </div>

          {/* User Actions */}
          <div className="flex items-center space-x-4 space-x-reverse">

            {/* Admin shortcut */}
            {adminUser && isAdmin && (
              <Button variant="ghost" size="icon" onClick={() => router.push("/admin")}>
                <Shield className="h-5 w-5 text-brand-blue" />
              </Button>
            )}

            {/* Cart */}
            <CartDrawer>
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingCart className="h-5 w-5" />
                {totalItems > 0 && (
                  <Badge className="absolute -top-2 -right-2 bg-brand-yellow text-black text-xs h-5 w-5 flex items-center justify-center">
                    {totalItems}
                  </Badge>
                )}
              </Button>
            </CartDrawer>

            {/* ✅ New login/logout/profile logic */}
            {(adminUser || state.user) ? (
              <>
                {/* Profile */}
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => router.push("/profile")}
                  aria-label="الملف الشخصي"
                >
                  <User className="h-5 w-5" />
                </Button>

                {/* Logout */}
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={adminUser ? handleAdminLogout : handleLogout}
                  aria-label="تسجيل الخروج"
                >
                  <LogOut className="h-5 w-5 text-red-500" />
                </Button>
              </>
            ) : (
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => router.push("/login")}
                aria-label="تسجيل الدخول"
              >
                <LogIn className="h-5 w-5" />
              </Button>
            )}

            {/* Mobile menu toggle */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                {/* mobile nav content... */}
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </motion.nav>
  )
}
