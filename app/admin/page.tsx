"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { BarChart3, Package, Users, ShoppingCart, TrendingUp, Eye, Plus, Settings, FileText } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useAdminAuth } from "@/lib/admin-auth"

const statsCards = [
  {
    title: "إجمالي المبيعات",
    value: "125,430 ر.س",
    change: "+12.5%",
    icon: TrendingUp,
    color: "text-green-500",
  },
  {
    title: "الطلبات الجديدة",
    value: "23",
    change: "+5 اليوم",
    icon: ShoppingCart,
    color: "text-brand-blue",
  },
  {
    title: "العملاء النشطين",
    value: "1,234",
    change: "+8.2%",
    icon: Users,
    color: "text-brand-yellow",
  },
  {
    title: "المنتجات",
    value: "156",
    change: "+3 هذا الأسبوع",
    icon: Package,
    color: "text-purple-500",
  },
]

const recentOrders = [
  {
    id: "ORD-001",
    customer: "أحمد محمد",
    product: "باقة تصميم الشعار",
    amount: "1,500 ر.س",
    status: "جديد",
    date: "اليوم",
  },
  {
    id: "ORD-002",
    customer: "فاطمة علي",
    product: "حملة إعلانية شاملة",
    amount: "2,500 ر.س",
    status: "قيد التنفيذ",
    date: "أمس",
  },
  {
    id: "ORD-003",
    customer: "محمد سالم",
    product: "تصميم موقع ويب",
    amount: "5,000 ر.س",
    status: "مكتمل",
    date: "منذ يومين",
  },
]

const quickActions = [
  {
    title: "إضافة منتج جديد",
    description: "أضف منتج أو خدمة جديدة",
    icon: Plus,
    href: "/admin/products/new",
    color: "bg-brand-blue",
  },
  {
    title: "إدارة الطلبات",
    description: "عرض وإدارة الطلبات",
    icon: FileText,
    href: "/admin/orders",
    color: "bg-brand-yellow",
  },
  {
    title: "إعدادات الموقع",
    description: "تخصيص إعدادات الموقع",
    icon: Settings,
    href: "/admin/settings",
    color: "bg-green-500",
  },
]

export default function AdminDashboard() {
  const { user, isAdmin, isLoading } = useAdminAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && (!user || !isAdmin)) {
      router.push("/login")
    }
  }, [user, isAdmin, isLoading, router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-blue mx-auto mb-4"></div>
          <p>جاري التحميل...</p>
        </div>
      </div>
    )
  }

  if (!user || !isAdmin) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-brand-blue">لوحة التحكم الإدارية</h1>
              <p className="text-muted-foreground mt-1">مرحباً بك، {user.name}</p>
            </div>
            <div className="flex items-center gap-4">
              <Badge className="bg-brand-yellow text-black">مدير</Badge>
              <Button variant="outline" onClick={() => router.push("/")}>
                <Eye className="h-4 w-4 ml-2" />
                عرض الموقع
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statsCards.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
                  <stat.icon className={`h-4 w-4 ${stat.color}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <p className="text-xs text-muted-foreground mt-1">{stat.change}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  إجراءات سريعة
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {quickActions.map((action, index) => (
                  <motion.div
                    key={action.title}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                  >
                    <Button
                      variant="ghost"
                      className="w-full justify-start h-auto p-4 hover:bg-muted"
                      onClick={() => router.push(action.href)}
                    >
                      <div className={`p-2 rounded-lg ${action.color} text-white ml-3`}>
                        <action.icon className="h-4 w-4" />
                      </div>
                      <div className="text-right">
                        <div className="font-medium">{action.title}</div>
                        <div className="text-sm text-muted-foreground">{action.description}</div>
                      </div>
                    </Button>
                  </motion.div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Recent Orders */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5" />
                  الطلبات الأخيرة
                </CardTitle>
                <CardDescription>آخر الطلبات المستلمة من العملاء</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentOrders.map((order, index) => (
                    <motion.div
                      key={order.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.7 + index * 0.1 }}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium">{order.customer}</span>
                          <Badge
                            variant={
                              order.status === "جديد"
                                ? "default"
                                : order.status === "قيد التنفيذ"
                                  ? "secondary"
                                  : "outline"
                            }
                            className={
                              order.status === "جديد"
                                ? "bg-brand-blue text-white"
                                : order.status === "قيد التنفيذ"
                                  ? "bg-brand-yellow text-black"
                                  : "border-green-500 text-green-500"
                            }
                          >
                            {order.status}
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground">{order.product}</div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {order.date} • {order.id}
                        </div>
                      </div>
                      <div className="text-left">
                        <div className="font-bold text-brand-yellow">{order.amount}</div>
                        <Button size="sm" variant="ghost" className="mt-1">
                          عرض التفاصيل
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </div>
                <Button variant="outline" className="w-full mt-4 bg-transparent">
                  عرض جميع الطلبات
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Performance Chart Placeholder */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="mt-8"
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                أداء المبيعات
              </CardTitle>
              <CardDescription>إحصائيات المبيعات للأشهر الماضية</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center bg-muted/20 rounded-lg">
                <div className="text-center">
                  <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                  <p className="text-muted-foreground">سيتم إضافة الرسوم البيانية قريباً</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
