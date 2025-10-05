"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { User, Mail, Phone, Edit, Save, X, Package, Calendar, DollarSign } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { useAdminAuth } from "@/lib/admin-auth"
import { toast } from "react-toastify"

interface Order {
  _id: string
  orderNumber: string
  totalAmount: number
  status: string
  createdAt: string
  items: Array<{
    name: string
    price: number
    quantity: number
  }>
}

export default function ProfilePage() {
  const { user, isLoading: authLoading } = useAdminAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [orders, setOrders] = useState<Order[]>([])
  const [loadingOrders, setLoadingOrders] = useState(true)
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
  })

  // Fetch user orders
  useEffect(() => {
    if (user?.id) {
      fetchUserOrders()
    }
  }, [user])

  const fetchUserOrders = async () => {
    try {
      const res = await fetch(`/api/orders?userId=${user?.id}`)
      if (res.ok) {
        const ordersData = await res.json()
        setOrders(ordersData)
      }
    } catch (error) {
      console.error("Error fetching orders:", error)
    } finally {
      setLoadingOrders(false)
    }
  }

  const handleSave = async () => {
    try {
      const res = await fetch(`/api/users/${user?.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (!res.ok) throw new Error("Failed to update profile")

      const updatedUser = await res.json()
      // You might want to update the user in your auth context here
      setIsEditing(false)

      toast.success("تم تحديث الملف الشخصي بنجاح")
    } catch (err) {
      toast.error("تعذر تحديث الملف الشخصي")
    }
  }

  const handleCancel = () => {
    setFormData({
      name: user?.name || "",
      email: user?.email || "",
      phone: user?.phone || "",
    })
    setIsEditing(false)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800'
      case 'in_progress': return 'bg-blue-100 text-blue-800'
      case 'confirmed': return 'bg-yellow-100 text-yellow-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'قيد الانتظار'
      case 'confirmed': return 'تم التأكيد'
      case 'in_progress': return 'قيد التنفيذ'
      case 'completed': return 'مكتمل'
      case 'cancelled': return 'ملغي'
      default: return status
    }
  }

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-blue"></div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <main className="pt-8">
          <div className="container mx-auto px-4 py-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center max-w-md mx-auto"
            >
              <h1 className="text-3xl font-bold mb-4">يجب تسجيل الدخول</h1>
              <p className="text-muted-foreground mb-8">
                يجب عليك تسجيل الدخول أولاً للوصول إلى الملف الشخصي
              </p>
              <Button 
                onClick={() => window.location.href = '/login'}
                className="bg-brand-blue hover:bg-brand-blue/90"
              >
                تسجيل الدخول
              </Button>
            </motion.div>
          </div>
        </main>
      </div>
    )
  }

  const totalSpent = orders.reduce((sum, order) => sum + order.totalAmount, 0)
  const completedOrders = orders.filter(order => order.status === 'completed').length

  return (
    <div className="min-h-screen bg-background">
      <main className="pt-8">
        {/* Header */}
        <section className="py-12 bg-muted/30">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                <span className="text-brand-yellow">الملف</span> <span className="text-brand-blue">الشخصي</span>
              </h1>
              <p className="text-xl text-muted-foreground">إدارة معلوماتك الشخصية وتتبع طلباتك</p>
            </motion.div>
          </div>
        </section>

        {/* Profile Content */}
        <section className="py-12">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Profile Info */}
              <div className="lg:col-span-2">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  <Card className="border-0 shadow-lg">
                    <CardHeader className="text-center pb-6">
                      <div className="flex justify-center mb-4">
                        <Avatar className="h-24 w-24">
                          <AvatarImage src="/placeholder.svg" alt={user.name} />
                          <AvatarFallback className="bg-primary/10 text-primary font-bold text-2xl">
                            {user.name.split(" ").map(n => n[0]).join("")}
                          </AvatarFallback>
                        </Avatar>
                      </div>
                      <CardTitle className="text-2xl font-bold">{user.name}</CardTitle>
                      <p className="text-muted-foreground">{user.email}</p>
                      <Badge variant="secondary" className="mt-2">
                        {user.role === 'admin' ? 'مدير' : 'مستخدم'}
                      </Badge>
                    </CardHeader>

                    <CardContent className="space-y-6">
                      <div className="flex justify-between items-center">
                        <h3 className="text-lg font-semibold">المعلومات الشخصية</h3>
                        {!isEditing ? (
                          <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                            <Edit className="h-4 w-4 ml-2" />
                            تعديل
                          </Button>
                        ) : (
                          <div className="flex space-x-2 space-x-reverse">
                            <Button variant="outline" size="sm" onClick={handleCancel}>
                              <X className="h-4 w-4 ml-2" />
                              إلغاء
                            </Button>
                            <Button size="sm" onClick={handleSave}>
                              <Save className="h-4 w-4 ml-2" />
                              حفظ
                            </Button>
                          </div>
                        )}
                      </div>

                      <Separator />

                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">الاسم الكامل</Label>
                          <div className="relative">
                            <User className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                            <Input
                              id="name"
                              type="text"
                              value={formData.name}
                              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                              className="pr-10 text-right"
                              disabled={!isEditing}
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="email">البريد الإلكتروني</Label>
                          <div className="relative">
                            <Mail className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                            <Input
                              id="email"
                              type="email"
                              value={formData.email}
                              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                              className="pr-10 text-right"
                              disabled={!isEditing}
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="phone">رقم الهاتف</Label>
                          <div className="relative">
                            <Phone className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                            <Input
                              id="phone"
                              type="tel"
                              value={formData.phone}
                              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                              className="pr-10 text-right"
                              disabled={!isEditing}
                              placeholder="أدخل رقم هاتفك"
                            />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>

              {/* Stats and Orders Summary */}
              <div className="space-y-6">
                {/* Stats Card */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">إحصائيات الحساب</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                      <div className="flex items-center space-x-2 space-x-reverse">
                        <Package className="h-4 w-4 text-blue-600" />
                        <span className="text-sm">إجمالي الطلبات</span>
                      </div>
                      <span className="font-bold">{orders.length}</span>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                      <div className="flex items-center space-x-2 space-x-reverse">
                        <DollarSign className="h-4 w-4 text-green-600" />
                        <span className="text-sm">إجمالي المشتريات</span>
                      </div>
                      <span className="font-bold">{totalSpent.toLocaleString()} ر.س</span>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                      <div className="flex items-center space-x-2 space-x-reverse">
                        <Calendar className="h-4 w-4 text-purple-600" />
                        <span className="text-sm">الطلبات المكتملة</span>
                      </div>
                      <span className="font-bold">{completedOrders}</span>
                    </div>
                  </CardContent>
                </Card>

                {/* Recent Orders */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">آخر الطلبات</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {loadingOrders ? (
                      <div className="text-center py-4">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-brand-blue mx-auto"></div>
                      </div>
                    ) : orders.length === 0 ? (
                      <p className="text-muted-foreground text-center py-4">لا توجد طلبات سابقة</p>
                    ) : (
                      <div className="space-y-3">
                        {orders.slice(0, 3).map((order) => (
                          <div key={order._id} className="flex justify-between items-center p-3 border rounded-lg">
                            <div>
                              <p className="font-medium text-sm">{order.orderNumber}</p>
                              <p className="text-xs text-muted-foreground">
                                {new Date(order.createdAt).toLocaleDateString('ar-SA')}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-sm">{order.totalAmount.toLocaleString()} ر.س</p>
                              <Badge className={`text-xs ${getStatusColor(order.status)}`}>
                                {getStatusText(order.status)}
                              </Badge>
                            </div>
                          </div>
                        ))}
                        {orders.length > 3 && (
                          <Button variant="outline" className="w-full" onClick={() => {/* Navigate to orders page */}}>
                            عرض جميع الطلبات
                          </Button>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}