"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Package, Star } from "lucide-react"

export default function ServicesPage() {
  const [services, setServices] = useState<any[]>([])
  const [filteredServices, setFilteredServices] = useState<any[]>([])
  const [search, setSearch] = useState("")
  const [showForm, setShowForm] = useState(false)
  const [editService, setEditService] = useState<any | null>(null)
  const [viewService, setViewService] = useState<any | null>(null) // 👈 مودال العرض

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    icon: "⭐",
    price: "",
    duration: "",
    rating: 0,
    features: "",
  })

  const fetchServices = async () => {
    const res = await fetch("/api/services")
    const data = await res.json()
    setServices(data)
    setFilteredServices(data)
  }

  useEffect(() => {
    fetchServices()
  }, [])

  const handleSearch = (value: string) => {
    setSearch(value)
    if (!value) {
      setFilteredServices(services)
    } else {
      setFilteredServices(
        services.filter((s) => s.title.toLowerCase().includes(value.toLowerCase()))
      )
    }
  }

  const handleSubmit = async () => {
    await fetch("/api/services", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    })
    setShowForm(false)
    fetchServices()
  }

  const handleDelete = async (id: string) => {
    await fetch(`/api/services/${id}`, { method: "DELETE" })
    fetchServices()
  }

  const handleEdit = (service: any) => {
    setEditService(service)
    setFormData({
      title: service.title,
      description: service.description,
      icon: service.icon,
      price: service.price,
      duration: service.duration,
      rating: service.rating,
      features: service.features,
    })
  }

  const handleUpdate = async () => {
    if (!editService) return
    await fetch(`/api/services/${editService._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    })
    setEditService(null)
    fetchServices()
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">إدارة الخدمات</h1>
        <div className="flex gap-4">
          <Input
            placeholder="🔍 ابحث عن خدمة..."
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-64"
          />
          <Button className="bg-brand-blue text-white" onClick={() => setShowForm(true)}>
            ➕ اضافة خدمة جديدة
          </Button>
        </div>
      </div>

      {/* Add Service Form */}
      {showForm && (
        <Card className="p-4 mb-6">
          <div className="space-y-4">
            <div>
              <Label>العنوان</Label>
              <Input value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
            </div>
            <div>
              <Label>الوصف</Label>
              <Input value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
            </div>
            <div>
              <Label>الأيقونة</Label>
              <Select value={formData.icon} onValueChange={(value) => setFormData({ ...formData, icon: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="اختر أيقونة" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="⭐">⭐ نجمة</SelectItem>
                  <SelectItem value="⚙️">⚙️ إعدادات</SelectItem>
                  <SelectItem value="💻">💻 تقنية</SelectItem>
                  <SelectItem value="📦">📦 باقة</SelectItem>
                  <SelectItem value="📞">📞 دعم</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>السعر</Label>
              <Input value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} />
            </div>
            <div>
              <Label>المدة</Label>
              <Input value={formData.duration} onChange={(e) => setFormData({ ...formData, duration: e.target.value })} />
            </div>
            <div>
              <Label>التقييم</Label>
              <Input type="number" value={formData.rating} onChange={(e) => setFormData({ ...formData, rating: Number(e.target.value) })} />
            </div>
            <div>
              <Label>المميزات</Label>
              <Input value={formData.features} onChange={(e) => setFormData({ ...formData, features: e.target.value })} />
            </div>
            <Button onClick={handleSubmit}>حفظ</Button>
          </div>
        </Card>
      )}

      {/* Services List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
        {filteredServices.map((s) => (
          <Card key={s._id} className="p-4">
            <CardContent>
              <h2 className="text-lg font-bold">{s.icon} {s.title}</h2>
              <p>{s.description}</p>
              <p>💰 {s.price} | ⏱ {s.duration}</p>
              <p>⭐ {s.rating}</p>
              <p>📌 {s.features}</p>
              <div className="flex gap-2 mt-3">
                <Button onClick={() => setViewService(s)}>عرض</Button> {/* 👈 بدل alert */}
                <Button variant="secondary" onClick={() => handleEdit(s)}>تعديل</Button>
                <Button variant="destructive" onClick={() => handleDelete(s._id)}>🗑 حذف</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Edit Modal */}
      <Dialog open={!!editService} onOpenChange={() => setEditService(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>تعديل الخدمة</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>العنوان</Label>
              <Input value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
            </div>
            <div>
              <Label>الوصف</Label>
              <Input value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
            </div>
            <div>
              <Label>الأيقونة</Label>
              <Select value={formData.icon} onValueChange={(value) => setFormData({ ...formData, icon: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="اختر أيقونة" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="⭐">⭐ نجمة</SelectItem>
                  <SelectItem value="⚙️">⚙️ إعدادات</SelectItem>
                  <SelectItem value="💻">💻 تقنية</SelectItem>
                  <SelectItem value="📦">📦 باقة</SelectItem>
                  <SelectItem value="📞">📞 دعم</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>السعر</Label>
              <Input value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} />
            </div>
            <div>
              <Label>المدة</Label>
              <Input value={formData.duration} onChange={(e) => setFormData({ ...formData, duration: e.target.value })} />
            </div>
            <div>
              <Label>التقييم</Label>
              <Input type="number" value={formData.rating} onChange={(e) => setFormData({ ...formData, rating: Number(e.target.value) })} />
            </div>
            <div>
              <Label>المميزات</Label>
              <Input value={formData.features} onChange={(e) => setFormData({ ...formData, features: e.target.value })} />
            </div>
            <Button onClick={handleUpdate}>تحديث</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* View Modal */}
      <Dialog open={!!viewService} onOpenChange={() => setViewService(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>📋 تفاصيل الخدمة</DialogTitle>
          </DialogHeader>
          {viewService && (
            <div className="space-y-3">
              <p><strong>العنوان:</strong> {viewService.icon} {viewService.title}</p>
              <p><strong>الوصف:</strong> {viewService.description}</p>
              <p><strong>السعر:</strong> 💰 {viewService.price}</p>
              <p><strong>المدة:</strong> ⏱ {viewService.duration}</p>
              <p><strong>التقييم:</strong> ⭐ {viewService.rating}</p>
              <p><strong>المميزات:</strong> 📌 {viewService.features}</p>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6 text-center">
            <Package className="h-8 w-8 text-brand-blue mx-auto mb-2" />
            <div className="text-2xl font-bold">{services.length}</div>
            <div className="text-sm text-muted-foreground">إجمالي الخدمات</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <Star className="h-8 w-8 text-brand-yellow mx-auto mb-2" />
            <div className="text-2xl font-bold">{services.filter((s) => s.rating >= 4).length}</div>
            <div className="text-sm text-muted-foreground">خدمات مميزة</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <div className="h-8 w-8 bg-green-500 rounded-full mx-auto mb-2 flex items-center justify-center">
              <div className="w-3 h-3 bg-white rounded-full"></div>
            </div>
            <div className="text-2xl font-bold">
              {services.filter((s) => s.status === "نشط").length}
            </div>
            <div className="text-sm text-muted-foreground">خدمات نشطة</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <div className="h-8 w-8 bg-muted rounded-full mx-auto mb-2 flex items-center justify-center">
              <div className="w-3 h-3 bg-muted-foreground rounded-full"></div>
            </div>
            <div className="text-2xl font-bold">
              {services.filter((s) => s.status === "مسودة").length}
            </div>
            <div className="text-sm text-muted-foreground">مسودات</div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
