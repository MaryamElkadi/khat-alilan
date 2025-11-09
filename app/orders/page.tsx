"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Package, Clock, XCircle, CheckCircle, CreditCard, ArrowLeft } from "lucide-react"
import { useAdminAuth } from "@/lib/admin-auth"
import { OrderDetailModal } from "@/components/order-detail-modal"

interface Order {
  _id: string
  orderNumber: string
  total: number
  totalAmount: number
  status: string
  createdAt: string
  items?: Array<{
    name: string
    price: number
    quantity: number
  }>
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "completed":
      return "bg-green-100 text-green-800"
    case "in_progress":
      return "bg-blue-100 text-blue-800"
    case "pending":
      return "bg-yellow-100 text-yellow-800"
    case "cancelled":
      return "bg-red-100 text-red-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case "completed":
      return <CheckCircle className="h-4 w-4" />
    case "in_progress":
    case "pending":
      return <Clock className="h-4 w-4" />
    case "cancelled":
      return <XCircle className="h-4 w-4" />
    default:
      return <Package className="h-4 w-4" />
  }
}

export default function UserOrdersPage() {
  const { user, isLoading: authLoading } = useAdminAuth()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [modalOpen, setModalOpen] = useState(false)

  useEffect(() => {
    if (authLoading) return
    if (!user?.id) {
      setError("يجب تسجيل الدخول لعرض الطلبات")
      setLoading(false)
      return
    }

    const fetchOrders = async () => {
      try {
        setLoading(true)
        const res = await fetch(`/api/orders?userId=${user.id}`)
        if (!res.ok) throw new Error("فشل في جلب الطلبات")
        const data = await res.json()
        setOrders(data.orders || data)
      } catch (err) {
        console.error(err)
        setError("حدث خطأ أثناء جلب الطلبات")
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [user, authLoading])

  if (authLoading) return <div className="text-center text-gray-500 py-10">جاري تحميل البيانات...</div>
  if (loading) return <div className="text-center text-gray-500 py-10">جاري تحميل الطلبات...</div>
  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 text-xl mb-4">{error}</p>
          <button
            onClick={() => (window.location.href = "/login")}
            className="px-4 py-2 bg-brand-blue text-white rounded-lg hover:bg-brand-blue/90"
          >
            تسجيل الدخول
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background py-10">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-10">
          <span className="text-brand-yellow">طلباتي</span> <span className="text-brand-blue">الشخصية</span>
        </h1>

        {orders.length === 0 ? (
          <div className="text-center py-12 bg-muted/30 rounded-lg border-2 border-dashed border-gray-300">
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-3" />
            <p className="text-muted-foreground">لا توجد طلبات حالياً</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {orders.map((order) => (
              <Card key={order._id} className="border border-gray-200 bg-muted/20 shadow-sm flex flex-col">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg font-bold text-foreground">
                      {order.orderNumber ? `طلب ${order.orderNumber}` : order._id.slice(-6)}
                    </CardTitle>
                    <Badge className={`flex items-center gap-1 ${getStatusColor(order.status)}`}>
                      {getStatusIcon(order.status)}
                      {order.status}
                    </Badge>
                  </div>
                  <div className="text-sm text-muted-foreground flex items-center gap-1 mt-2">
                    <Calendar className="h-4 w-4" />
                    {new Date(order.createdAt).toLocaleDateString("ar-SA")}
                  </div>
                </CardHeader>

                <CardContent className="flex-1 flex flex-col">
                  <div className="flex-1">
                    <div className="flex justify-between text-sm text-muted-foreground border-b border-gray-200 py-2">
                      <span className="flex items-center gap-1">
                        <CreditCard className="h-4 w-4" /> المبلغ:
                      </span>
                      <span className="font-bold text-brand-blue">{order.total || order.totalAmount} ر.س</span>
                    </div>

                    {order.items && (
                      <div className="mt-3">
                        <p className="text-muted-foreground text-sm mb-2">الخدمات:</p>
                        {order.items.slice(0, 3).map((item, i) => (
                          <div key={i} className="flex justify-between text-sm">
                            <span className="text-foreground">{item.name}</span>
                            <span className="text-brand-blue">{item.price} ر.س</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <Button
                    onClick={() => {
                      setSelectedOrder(order)
                      setModalOpen(true)
                    }}
                    className="w-full mt-4 bg-brand-blue hover:bg-brand-blue/90 text-white gap-2"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    تتبع الطلب
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </motion.div>

      <OrderDetailModal order={selectedOrder} open={modalOpen} onOpenChange={setModalOpen} />
    </div>
  )
}
