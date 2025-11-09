"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

interface OrderItem {
  name: string
  price: number
  quantity: number
}

interface Order {
  _id: string
  orderNumber: string
  total: number
  totalAmount: number
  status: string
  createdAt: string
  type?: "product" | "service"
  items?: OrderItem[]
}

interface OrderDetailModalProps {
  order: Order | null
  open: boolean
  onOpenChange: (open: boolean) => void
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

export function OrderDetailModal({ order, open, onOpenChange }: OrderDetailModalProps) {
  if (!order) return null

  const totalAmount = order.total || order.totalAmount || 0

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>تفاصيل الطلب</DialogTitle>
            <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Order Header */}
          <div className="flex items-center justify-between pb-4 border-b">
            <div>
              <p className="text-sm text-muted-foreground">رقم الطلب</p>
              <p className="text-xl font-bold">{order.orderNumber || order._id.slice(-6)}</p>
            </div>
            <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
          </div>

          {/* Order Info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">التاريخ</p>
              <p className="font-medium">{new Date(order.createdAt).toLocaleDateString("ar-SA")}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">النوع</p>
              <p className="font-medium">{order.type === "product" ? "منتج" : "خدمة"}</p>
            </div>
          </div>

          {/* Items */}
          {order.items && order.items.length > 0 && (
            <div>
              <p className="font-semibold mb-3">{order.type === "product" ? "المنتجات" : "الخدمات"}</p>
              <div className="space-y-2 bg-muted/50 p-4 rounded-lg">
                {order.items.map((item, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-muted-foreground">الكمية: {item.quantity}</p>
                    </div>
                    <p className="font-semibold">{item.price} ر.س</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Total */}
          <div className="pt-4 border-t">
            <div className="flex justify-between items-center text-lg">
              <span className="font-semibold">الإجمالي:</span>
              <span className="text-xl font-bold text-brand-blue">{totalAmount} ر.س</span>
            </div>
          </div>

          {/* Action Button */}
          <Button onClick={() => onOpenChange(false)} className="w-full bg-brand-blue hover:bg-brand-blue/90">
            إغلاق
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
