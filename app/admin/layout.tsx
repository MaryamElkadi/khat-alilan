"use client"

import type React from "react"

import { motion } from "framer-motion"
import { Home, Package, ShoppingCart, Users, Settings, LogOut, BarChart3, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAdminAuth } from "@/lib/admin-auth"
import { ProtectedRoute } from "@/components/protected-route"
import { useRouter } from "next/navigation"
import { ProductsProvider } from "@/app/admin/context/products"

const sidebarItems = [
  { icon: Home, label: "الرئيسية", href: "/admin" },
  { icon: Package, label: "المنتجات", href: "/admin/products" },
  { icon: ShoppingCart, label: "الطلبات", href: "/admin/orders" },
  { icon: Users, label: "العملاء", href: "/admin/customers" },
  { icon: BarChart3, label: "التقارير", href: "/admin/reports" },
  { icon: FileText, label: "المحتوى", href: "/admin/content" },
  { icon: Settings, label: "الإعدادات", href: "/admin/settings" },
]

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, logout } = useAdminAuth()
  const router = useRouter()

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  return (
    <ProtectedRoute requireAdmin={true}>
      <ProductsProvider>
        <div className="min-h-screen bg-background flex">
          {/* Sidebar */}
          <motion.div
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            className="w-64 bg-card border-l border-border flex flex-col"
          >
            {/* Logo */}
            <div className="p-6 border-b border-border">
              <h2 className="text-xl font-bold text-brand-blue">خط الإعلان</h2>
              <p className="text-sm text-muted-foreground">لوحة التحكم</p>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4">
              <div className="space-y-2">
                {sidebarItems.map((item, index) => (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Button
                      variant="ghost"
                      className="w-full justify-start gap-3 h-12"
                      onClick={() => router.push(item.href)}
                    >
                      <item.icon className="h-5 w-5" />
                      {item.label}
                    </Button>
                  </motion.div>
                ))}
              </div>
            </nav>

            {/* User Info & Logout */}
            <div className="p-4 border-t border-border">
              <div className="mb-4">
                <p className="font-medium">{user?.name}</p>
                <p className="text-sm text-muted-foreground">{user?.email}</p>
              </div>
              <Button variant="outline" className="w-full gap-2 bg-transparent" onClick={handleLogout}>
                <LogOut className="h-4 w-4" />
                تسجيل الخروج
              </Button>
            </div>
          </motion.div>

          {/* Main Content */}
          <div className="flex-1">{children}</div>
        </div>
      </ProductsProvider>
    </ProtectedRoute>
  )
}