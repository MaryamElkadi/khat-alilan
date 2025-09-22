"use client"
import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function TrackOrderPage() {
  const { id } = useParams()
  const [order, setOrder] = useState<any>(null)

  useEffect(() => {
    if (id) {
      fetch(`/api/orders/${id}`)
        .then(res => res.json())
        .then(data => setOrder(data))
    }
  }, [id])

  if (!order) return <p className="p-6">جاري تحميل الطلب...</p>

  return (
    <div className="p-8">
      <Card>
        <CardHeader>
          <CardTitle>تفاصيل الطلب</CardTitle>
        </CardHeader>
        <CardContent>
          <p><strong>رقم الطلب:</strong> {order._id}</p>
          <p><strong>الحالة:</strong> {order.status}</p>
          <p><strong>المجموع:</strong> {order.total} ر.س</p>
          <p><strong>العميل:</strong> {order.customer}</p>

          <div className="mt-4">
            <p className="font-semibold">الخدمات:</p>
            <ul className="list-disc list-inside">
              {order.items.map((item: any, i: number) => (
                <li key={i} className="text-black">
                  {item.name} × {item.quantity}
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
