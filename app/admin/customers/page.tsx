"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Search, Eye, Edit, Trash2, Users, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select"

export default function CustomersManagement() {
  const [searchTerm, setSearchTerm] = useState("")
  const [customers, setCustomers] = useState<any[]>([])
  const [open, setOpen] = useState(false)

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    status: "نشط",
    orders: 0,
  })

  const router = useRouter()

  // ✅ fetch from API
  useEffect(() => {
    fetch("/api/customers")
      .then((res) => res.json())
      .then((data) => setCustomers(data))
  }, [])

  const handleDelete = async (id: string) => {
    await fetch(`/api/customers/${id}`, { method: "DELETE" })
    setCustomers(customers.filter((c) => c._id !== id))
  }

  const handleAddCustomer = async () => {
    const res = await fetch("/api/customers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    })

    if (res.ok) {
      const newCustomer = await res.json()
      setCustomers([...customers, { ...formData, _id: newCustomer.insertedId }])
      setFormData({ name: "", email: "", status: "نشط", orders: 0 })
      setOpen(false)
    }
  }

  const filteredCustomers = customers.filter(
    (c) =>
      c.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-brand-blue">إدارة العملاء</h1>
          <p className="text-muted-foreground mt-1">عرض وتعديل بيانات العملاء</p>
        </div>

        {/* زرار إضافة عميل جديد */}
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-brand-blue text-white">
              <Plus className="h-4 w-4 ml-2" />
              إضافة عميل جديد
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>إضافة عميل جديد</DialogTitle>
            </DialogHeader>
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
              <Button onClick={handleAddCustomer} className="w-full bg-brand-blue text-white">
                إضافة
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="relative flex-1">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="البحث عن عميل..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pr-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Customers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCustomers.map((c, index) => (
          <motion.div
            key={c._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-lg">{c.name}</CardTitle>
                <Badge variant={c.status === "نشط" ? "default" : "secondary"}>
                  {c.status}
                </Badge>
              </CardHeader>
              <CardContent>
                <p className="text-sm mb-2">{c.email}</p>
                <p className="text-sm mb-2">عدد الطلبات: {c.orders}</p>
                <div className="flex gap-2 mt-4">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1"
                    onClick={() => router.push(`/admin/customers/${c._id}`)}
                  >
                    <Eye className="h-4 w-4 ml-1" />
                    عرض
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1"
                    onClick={() => router.push(`/admin/customers/edit/${c._id}`)}
                  >
                    <Edit className="h-4 w-4 ml-1" />
                    تعديل
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-red-500 hover:text-red-600"
                    onClick={() => handleDelete(c._id)}
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
            <Users className="h-8 w-8 text-brand-blue mx-auto mb-2" />
            <div className="text-2xl font-bold">{customers.length}</div>
            <div className="text-sm text-muted-foreground">إجمالي العملاء</div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
