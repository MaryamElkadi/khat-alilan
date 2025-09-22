"use client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function MyOrdersPage() {
  const [orders, setOrders] = useState<any[]>([])
  const router = useRouter()
  const userEmail = "user@email.com" // ⚡️ غيريها بحيث تجي من الـ Auth

  useEffect(() => {
    fetch(`/api/orders?customer=${userEmail}`)
      .then(res => res.json())
      .then(data => setOrders(data))
  }, [])

  if (!orders.length) return <p className="p-6">لا توجد طلبات بعد.</p>

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">طلباتي</h1>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {orders.map((order) => (
          <Card key={order._id}>
            <CardHeader>
              <CardTitle>طلب رقم {order._id}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>الحالة: {order.status}</p>
              <p>المجموع: {order.total} ر.س</p>
              <div className="mt-2">
                <Button
                  size="sm"
                  className="text-black"
                  onClick={() => router.push(`/track-order/${order._id}`)}
                >
                  تتبع الطلب
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
