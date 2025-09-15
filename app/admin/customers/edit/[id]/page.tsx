"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function EditCustomer() {
  const { id } = useParams()
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    status: "نشط",
    orders: 0,
  })

useEffect(() => {
  if (!id) return
  fetch(`/api/customers/${id}`)
    .then((res) => res.json())
    .then((data) =>
      setFormData({
        name: data.name || "",
        email: data.email || "",
        status: data.status || "نشط",
        orders: data.orders || 0,
      })
    )
}, [id])

  const handleUpdate = async () => {
    const res = await fetch(`/api/customers/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    })

    if (res.ok) {
      router.push("/admin/customers") // رجوع لقائمة العملاء
    }
  }

  return (
    <div className="p-8 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-6">تعديل بيانات العميل</h1>

      <div className="space-y-4">
        <div>
          <Label>الاسم</Label>
          <Input
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </div>
        <div>
          <Label>البريد الإلكتروني</Label>
          <Input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
        </div>
        <div>
          <Label>الحالة</Label>
          <Select
            value={formData.status}
            onValueChange={(value) => setFormData({ ...formData, status: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="اختر الحالة" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="نشط">نشط</SelectItem>
              <SelectItem value="معلق">معلق</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>عدد الطلبات</Label>
          <Input
            type="number"
            value={formData.orders}
            onChange={(e) => setFormData({ ...formData, orders: Number(e.target.value) })}
          />
        </div>
        <Button onClick={handleUpdate} className="bg-brand-blue text-white w-full">
          حفظ التغييرات
        </Button>
      </div>
    </div>
  )
}
