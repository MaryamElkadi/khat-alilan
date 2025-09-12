"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Save, ArrowRight, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { useProducts } from "@/app/admin/context/products"



const categories = [
  "تصميم جرافيك",
  "إعلانات وسائل التواصل",
  "تصميم مواقع ويب",
  "طباعة ونشر",
  "التصوير الفوتوغرافي",
  "الهوية التجارية",
  "التسويق الرقمي",
]

interface FormData {
  title: string
  description: string
  price: string
  category: string
  featured: boolean
  status: string
}

interface EditProductPageProps {
  products: any[]
  updateProduct: (id: string, data: FormData) => void
}

export default function EditProductPage() {
  const { products, setProducts } = useProducts()
  const params = useParams()
  const id = params?.id
  const product = products.find((p) => p.id === id)


  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState<FormData>({
    title: "",
    description: "",
    price: "",
    category: "",
    featured: false,
    status: "نشط",
  })

  useEffect(() => {
    if (product) {
      setFormData(product)
    }
    setLoading(false)
  }, [product])

  const handleInputChange = (field: keyof FormData, value: string | boolean) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

if (!id || !product) {
  return <div className="p-8">المنتج غير موجود</div>
}

const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault()
  if (!id || !product) return
  updateProduct(id, formData)
  alert("تم تعديل المنتج بنجاح ✅")
  router.push("/admin/products")
}



  if (loading) return <div className="p-8">جاري تحميل بيانات المنتج...</div>
  if (!product) return <div className="p-8">المنتج غير موجود</div>
}
  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Button variant="ghost" onClick={() => router.back()} className="p-2">
          <ArrowRight className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-brand-blue">تعديل المنتج</h1>
          <p className="text-muted-foreground mt-1">قم بتعديل بيانات المنتج ثم اضغط حفظ</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="max-w-4xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>معلومات المنتج</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="title">اسم المنتج *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="description">وصف المنتج *</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    rows={4}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="price">السعر (ر.س) *</Label>
                    <Input
                      id="price"
                      type="number"
                      value={formData.price}
                      onChange={(e) => handleInputChange("price", e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="category">الفئة *</Label>
                    <select
                      id="category"
                      value={formData.category}
                      onChange={(e) => handleInputChange("category", e.target.value)}
                      className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm"
                      required
                    >
                      <option value="">اختر الفئة</option>
                      {categories.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Image Upload */}
            <Card>
              <CardHeader>
                <CardTitle>صور المنتج</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                  <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground mb-4">اسحب الصور هنا أو انقر للتحديد</p>
                  <Button type="button" variant="outline">
                    اختيار الصور
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>إعدادات النشر</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="featured">منتج مميز</Label>
                  <Switch
                    id="featured"
                    checked={formData.featured}
                    onCheckedChange={(checked: boolean) => handleInputChange("featured", checked)}
                  />
                </div>

                <div>
                  <Label htmlFor="status">حالة المنتج</Label>
                  <select
                    id="status"
                    value={formData.status}
                    onChange={(e) => handleInputChange("status", e.target.value)}
                    className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm mt-2"
                  >
                    <option value="مسودة">مسودة</option>
                    <option value="نشط">نشط</option>
                    <option value="معطل">معطل</option>
                  </select>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>معاينة سريعة</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                    <span className="text-muted-foreground text-sm">صورة المنتج</span>
                  </div>
                  <h3 className="font-semibold">{formData.title || "اسم المنتج"}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {formData.description || "وصف المنتج سيظهر هنا..."}
                  </p>
                  <div className="text-lg font-bold text-brand-yellow">
                    {formData.price ? `${formData.price} ر.س` : "السعر"}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button type="submit" className="w-full bg-brand-blue hover:bg-brand-blue/90">
                <Save className="h-4 w-4 ml-2" />
                حفظ التعديلات
              </Button>
              <Button type="button" variant="outline" className="w-full" onClick={() => router.push("/admin/products")}>
                إلغاء
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
