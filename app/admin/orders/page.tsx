"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Search, Eye, Trash2, Edit, ShoppingCart, Package } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const orders = [
  {
    id: "ORD-001",
    customer: "أحمد علي",
    total: 3500,
    status: "مكتمل",
    items: 3,
  },
  {
    id: "ORD-002",
    customer: "سارة محمد",
    total: 1200,
    status: "قيد التنفيذ",
    items: 2,
  },
  {
    id: "ORD-003",
    customer: "محمد حسن",
    total: 800,
    status: "ملغي",
    items: 1,
  },
]

export default function OrdersManagement() {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredOrders = orders.filter(
    (order) =>
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-brand-blue">إدارة الطلبات</h1>
          <p className="text-muted-foreground mt-1">
            متابعة الطلبات وحالة التنفيذ
          </p>
        </div>
      </div>

      {/* Search */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="relative flex-1">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="البحث في الطلبات..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pr-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Orders List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredOrders.map((order, index) => (
          <motion.div
            key={order.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="overflow-hidden hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-lg">{order.id}</CardTitle>
                <Badge
                  variant={
                    order.status === "مكتمل"
                      ? "default"
                      : order.status === "قيد التنفيذ"
                      ? "secondary"
                      : "destructive"
                  }
                >
                  {order.status}
                </Badge>
              </CardHeader>
              <CardContent>
                <p className="text-sm mb-2">العميل: {order.customer}</p>
                <p className="text-sm mb-2">عدد المنتجات: {order.items}</p>
                <p className="font-bold text-brand-yellow">
                  {order.total.toLocaleString()} ر.س
                </p>
                <div className="flex gap-2 mt-4">
                  <Button size="sm" variant="outline" className="flex-1">
                    <Eye className="h-4 w-4 ml-1" />
                    عرض
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1">
                    <Edit className="h-4 w-4 ml-1" />
                    تعديل
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-red-500 hover:text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
        <Card>
          <CardContent className="p-6 text-center">
            <ShoppingCart className="h-8 w-8 text-brand-blue mx-auto mb-2" />
            <div className="text-2xl font-bold">{orders.length}</div>
            <div className="text-sm text-muted-foreground">إجمالي الطلبات</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <Package className="h-8 w-8 text-green-500 mx-auto mb-2" />
            <div className="text-2xl font-bold">
              {orders.filter((o) => o.status === "مكتمل").length}
            </div>
            <div className="text-sm text-muted-foreground">مكتملة</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="h-8 w-8 bg-red-500 rounded-full mx-auto mb-2"></div>
            <div className="text-2xl font-bold">
              {orders.filter((o) => o.status === "ملغي").length}
            </div>
            <div className="text-sm text-muted-foreground">ملغاة</div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
