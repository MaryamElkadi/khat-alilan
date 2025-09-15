// app/admin/works/edit/[id]/page.tsx
"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { ArrowRight, Save, Upload } from "lucide-react"

const categories = [
  "تصميم جرافيك",
  "إعلانات وسائل التواصل",
  "تصميم مواقع ويب",
  "طباعة ونشر",
  "التصوير الفوتوغرافي",
  "الهوية التجارية",
  "التسويق الرقمي",
]

export default function EditWorkPage() {
  const params = useParams()
  const router = useRouter()
  const { id } = params

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    featured: false,
    status: "مسودة",
  })
  const [file, setFile] = useState<File | null>(null)
  const [currentImage, setCurrentImage] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")

  // Fetch work data
  useEffect(() => {
    async function fetchWork() {
      try {
        setIsLoading(true)
        const res = await fetch(`/api/works/${id}`)
        
        if (!res.ok) {
          throw new Error("Failed to fetch work")
        }
        
        const data = await res.json()
        setFormData({
          title: data.title || "",
          description: data.description || "",
          category: data.category || "",
          featured: data.featured || false,
          status: data.status || "مسودة",
        })
        setCurrentImage(data.image || "")
      } catch (err) {
        setError("فشل في تحميل بيانات العمل")
        console.error("Error fetching work:", err)
      } finally {
        setIsLoading(false)
      }
    }
    
    if (id) fetchWork()
  }, [id])

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError("")

    try {
      let imagePath = currentImage

      // Upload new image if selected
      if (file) {
        const formData = new FormData()
        formData.append("file", file)

        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        })

        if (!uploadRes.ok) {
          throw new Error("Failed to upload image")
        }

        const uploadData = await uploadRes.json()
        imagePath = uploadData.path
      }

      // Update work in database
      const updateData = {
        ...formData,
        image: imagePath,
      }

      const res = await fetch(`/api/works/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      })

      if (!res.ok) {
        throw new Error("Failed to update work")
      }

      router.push("/admin/works")
      router.refresh()
    } catch (err) {
      setError("فشل في تحديث العمل")
      console.error("Error updating work:", err)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="flex items-center justify-center h-64">
          <p>جاري تحميل بيانات العمل...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Button variant="ghost" onClick={() => router.back()} className="p-2">
          <ArrowRight className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-brand-blue">تعديل العمل</h1>
          <p className="text-muted-foreground mt-1">تعديل العمل المحدد</p>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="max-w-4xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Info */}
            <Card>
              <CardHeader>
                <CardTitle>معلومات العمل الأساسية</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="title">عنوان العمل *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    placeholder="عنوان العمل"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="description">وصف العمل</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    placeholder="وصف مفصل للعمل"
                    rows={4}
                  />
                </div>
                <div>
                  <Label htmlFor="category">الفئة</Label>
                  <select
                    id="category"
                    value={formData.category}
                    onChange={(e) => handleInputChange("category", e.target.value)}
                    className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm"
                  >
                    <option value="">اختر الفئة</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
              </CardContent>
            </Card>

            {/* Image Upload */}
            <Card>
              <CardHeader>
                <CardTitle>صورة العمل</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {currentImage && (
                    <div>
                      <Label>الصورة الحالية</Label>
                      <img
                        src={currentImage}
                        alt="Current work"
                        className="w-full h-48 object-cover rounded-lg mt-2"
                      />
                    </div>
                  )}
                  
                  <div>
                    <Label>تغيير الصورة</Label>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="mt-2"
                    />
                  </div>
                  
                  {file && (
                    <div>
                      <Label>معاينة الصورة الجديدة</Label>
                      <img
                        src={URL.createObjectURL(file)}
                        alt="New work preview"
                        className="w-full h-48 object-cover rounded-lg mt-2"
                      />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Publishing Settings */}
            <Card>
              <CardHeader>
                <CardTitle>إعدادات النشر</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="featured">عمل مميز</Label>
                  <Switch
                    id="featured"
                    checked={formData.featured}
                    onCheckedChange={(checked) => handleInputChange("featured", checked)}
                  />
                </div>
                <div>
                  <Label htmlFor="status">حالة العمل</Label>
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

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button 
                type="submit" 
                className="w-full bg-brand-blue hover:bg-brand-blue/90"
                disabled={isSubmitting}
              >
                <Save className="h-4 w-4 ml-2" />
                {isSubmitting ? "جاري الحفظ..." : "حفظ التعديلات"}
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                className="w-full bg-transparent" 
                onClick={() => router.back()}
              >
                إلغاء
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}