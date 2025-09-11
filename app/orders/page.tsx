"use client"

import { motion } from "framer-motion"
import { Package, Clock, CheckCircle, XCircle, Eye } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

const orders = [
  {
    id: "ORD-001",
    date: "2024-01-15",
    status: "completed",
    total: 1500,
    items: [{ name: "باقة تصميم الشعار الاحترافية", quantity: 1, price: 1500 }],
  },
  {
    id: "ORD-002",
    date: "2024-01-10",
    status: "processing",
    total: 2500,
    items: [{ name: "حملة إعلانية شاملة", quantity: 1, price: 2500 }],
  },
  {
    id: "ORD-003",
    date: "2024-01-05",
    status: "pending",
    total: 800,
    items: [{ name: "مواد طباعية متنوعة", quantity: 1, price: 800 }],
  },
]

const statusConfig = {
  pending: { label: "في الانتظار", color: "bg-yellow-500", icon: Clock },
  processing: { label: "قيد التنفيذ", color: "bg-blue-500", icon: Package },
  completed: { label: "مكتمل", color: "bg-green-500", icon: CheckCircle },
  cancelled: { label: "ملغي", color: "bg-red-500", icon: XCircle },
}

export default function OrdersPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        <h1 className="text-3xl font-bold mb-8 text-right">طلباتي</h1>

        <div className="space-y-6">
          {orders.map((order, index) => {
            const status = statusConfig[order.status as keyof typeof statusConfig]
            const StatusIcon = status.icon

            return (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="text-right">
                        <CardTitle className="text-lg">طلب رقم {order.id}</CardTitle>
                        <p className="text-muted-foreground text-sm mt-1">
                          تاريخ الطلب: {new Date(order.date).toLocaleDateString("ar-SA")}
                        </p>
                      </div>
                      <Badge className={`${status.color} text-white`}>
                        <StatusIcon className="h-3 w-3 ml-1" />
                        {status.label}
                      </Badge>
                    </div>
                  </CardHeader>

                  <CardContent>
                    <div className="space-y-3">
                      {order.items.map((item, itemIndex) => (
                        <div key={itemIndex} className="flex justify-between items-center">
                          <div className="text-right">
                            <p className="font-medium">{item.name}</p>
                            <p className="text-sm text-muted-foreground">الكمية: {item.quantity}</p>
                          </div>
                          <p className="font-semibold">{item.price.toLocaleString()} ر.س</p>
                        </div>
                      ))}

                      <Separator />

                      <div className="flex justify-between items-center">
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 ml-1" />
                            عرض التفاصيل
                          </Button>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-brand-yellow">
                            المجموع: {order.total.toLocaleString()} ر.س
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </div>
      </motion.div>
    </div>
  )
}
