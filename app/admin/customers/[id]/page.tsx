"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function CustomerDetails() {
  const { id } = useParams()
  const [customer, setCustomer] = useState<any>(null)

  useEffect(() => {
    if (!id) return
    fetch(`/api/customers/${id}`)
      .then((res) => res.json())
      .then((data) => setCustomer(data))
  }, [id])

  if (!customer) return <p className="p-8">جاري التحميل...</p>

  return (
    <div className="p-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">{customer.name}</CardTitle>
          <Badge variant={customer.status === "نشط" ? "default" : "secondary"}>
            {customer.status}
          </Badge>
        </CardHeader>
        <CardContent>
          <p className="mb-2">📧 {customer.email}</p>
          <p>🛒 عدد الطلبات: {customer.orders}</p>
        </CardContent>
      </Card>
    </div>
  )
}
