"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, Package, Clock, CheckCircle, MapPin, Phone, Mail, AlertCircle } from "lucide-react"

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

interface OrderDetailModalProps {
  order: Order | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "completed":
      return "bg-green-600"
    case "in_progress":
      return "bg-blue-600"
    case "pending":
      return "bg-yellow-600"
    case "cancelled":
      return "bg-red-600"
    default:
      return "bg-gray-600"
  }
}

const getStatusArabic = (status: string) => {
  const statusMap: Record<string, string> = {
    completed: "مكتمل",
    in_progress: "قيد المعالجة",
    pending: "قيد الانتظار",
    cancelled: "ملغى",
  }
  return statusMap[status] || status
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case "completed":
      return <CheckCircle className="h-5 w-5" />
    case "in_progress":
    case "pending":
      return <Clock className="h-5 w-5" />
    case "cancelled":
      return <AlertCircle className="h-5 w-5" />
    default:
      return <Package className="h-5 w-5" />
  }
}

export function OrderDetailModal({ order, open, onOpenChange }: OrderDetailModalProps) {
  if (!order) return null

  const total = order.total || order.totalAmount || 0

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="
          max-w-md             /* smaller width */
          max-h-[90vh]         /* limit height */
          overflow-y-auto       /* make scrollable */
          bg-gray-900          /* darker background */
          border border-gray-700 
          text-white 
          rounded-2xl 
          scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-800
        "
      >
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-center">
            تفاصيل الطلب #{order.orderNumber || order._id.slice(-6)}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 pb-4">
          {/* Status Section */}
          <div className="bg-gray-800 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {getStatusIcon(order.status)}
                <div>
                  <p className="text-sm text-gray-400">حالة الطلب</p>
                  <p className="text-lg font-semibold">{getStatusArabic(order.status)}</p>
                </div>
              </div>
              <Badge className={`${getStatusColor(order.status)} text-white border-0`}>
                {getStatusArabic(order.status)}
              </Badge>
            </div>
          </div>

  {/* Timeline/Tracking */}
<div>
  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
    <MapPin className="h-5 w-5 text-blue-400" />
    تتبع الطلب
  </h3>

  <div className="space-y-3">
    {[
      {
        key: "pending",
        title: "تم تأكيد الطلب",
        desc: new Date(order.createdAt).toLocaleDateString("ar-SA"),
        icon: <CheckCircle className="h-5 w-5 text-white" />,
      },
      {
        key: "in_progress",
        title: "قيد المعالجة",
        desc:
          order.status === "in_progress" || order.status === "completed"
            ? "تم البدء في تجهيز الطلب"
            : "قريباً",
        icon: <Package className="h-5 w-5 text-white" />,
      },
      {
        key: "completed",
        title: "تم التسليم",
        desc: order.status === "completed" ? "تم تسليم الطلب بنجاح" : "قريباً",
        icon: <CheckCircle className="h-5 w-5 text-white" />,
      },
    ].map((step, i, arr) => {
      const statusOrder = ["pending", "in_progress", "completed"]
      const currentIndex = statusOrder.indexOf(order.status)
      const stepIndex = statusOrder.indexOf(step.key)

      const isCompleted = stepIndex < currentIndex
      const isActive = stepIndex === currentIndex
      const isUpcoming = stepIndex > currentIndex

      return (
        <div key={step.key} className="flex gap-4 items-start">
          {/* Step icon */}
          <div className="flex flex-col items-center">
            <div
              className={`h-8 w-8 rounded-full flex items-center justify-center transition-all duration-300
                ${
                  isActive
                    ? "bg-blue-600 shadow-lg scale-110 ring-2 ring-blue-300"
                    : isCompleted
                    ? "bg-blue-400"
                    : "bg-gray-600"
                }`}
            >
              {step.icon}
            </div>

            {/* Connector line */}
            {i < arr.length - 1 && (
              <div
                className={`w-0.5 h-10 my-2 transition-all duration-300 ${
                  isCompleted ? "bg-blue-500" : "bg-gray-600"
                }`}
              />
            )}
          </div>

          {/* Step details */}
          <div>
            <p
              className={`font-semibold transition-colors duration-300 ${
                isActive
                  ? "text-blue-400"
                  : isCompleted
                  ? "text-white"
                  : "text-gray-400"
              }`}
            >
              {step.title}
            </p>
            <p className="text-sm text-gray-400">{step.desc}</p>
          </div>
        </div>
      )
    })}
  </div>
</div>



          {/* Order Items */}
          {order.items && order.items.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-3">محتويات الطلب</h3>
              <Card className="bg-gray-800 border-gray-700">
                <CardContent className="pt-4">
                  <div className="space-y-2">
                    {order.items.map((item, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center py-2 border-b border-gray-700 last:border-0"
                      >
                        <div>
                          <p className="font-semibold text-white">{item.name}</p>
                          <p className="text-sm text-gray-400">الكمية: {item.quantity}</p>
                        </div>
                        <p className="font-semibold text-blue-400">{item.price} ر.س</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Order Summary */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">ملخص الطلب</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-300">رقم الطلب:</span>
                <span className="font-semibold text-white">
                  {order.orderNumber || order._id.slice(-6)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300 flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  تاريخ الطلب:
                </span>
                <span className="font-semibold text-white">
                  {new Date(order.createdAt).toLocaleDateString("ar-SA")}
                </span>
              </div>
              <div className="border-t border-gray-700 pt-3 mt-3 flex justify-between">
                <span className="text-gray-300 text-lg font-semibold">الإجمالي:</span>
                <span className="font-bold text-lg text-blue-400">{total} ر.س</span>
              </div>
            </CardContent>
          </Card>

          {/* Contact Info */}
          <div className="bg-gray-800 rounded-lg p-4 space-y-2 text-sm">
            <p className="text-gray-400">هل تحتاج إلى مساعدة؟</p>
            <div className="flex items-center gap-2 text-gray-300">
              <Phone className="h-4 w-4 text-blue-400" />
              <span>الهاتف: +966 503502717</span>
            </div>
            <div className="flex items-center gap-2 text-gray-300">
              <Mail className="h-4 w-4 text-blue-400" />
              <span>البريد: adline.sa@gmail.com</span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
