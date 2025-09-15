"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"

const categories = [
  { id: "graphic", name: "تصميم جرافيك" },
  { id: "web", name: "تصميم مواقع" },
  { id: "social", name: "وسائل التواصل" },
  { id: "branding", name: "هوية بصرية" },
]

export default function NewWork() {
  const [title, setTitle] = useState("")
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [description, setDescription] = useState("")
  const [file, setFile] = useState<File | null>(null)
  const router = useRouter()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
    }
  }

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((c) => c !== categoryId)
        : [...prev, categoryId]
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const formData = new FormData()
    formData.append("title", title)
    formData.append("description", description)
    formData.append("categories", JSON.stringify(selectedCategories))
    if (file) {
      formData.append("image", file)
    }

    try {
      const res = await fetch("/api/works", {
        method: "POST",
        body: formData,
      })

      if (res.ok) {
        router.push("/admin/works")
      }
    } catch (err) {
      console.error("Error uploading work:", err)
    }
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">إضافة عمل جديد</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardContent className="space-y-4 p-6">
            {/* صورة */}
            <div className="space-y-2">
              <Label>الصورة</Label>
              <div className="aspect-video bg-muted rounded-lg flex items-center justify-center overflow-hidden">
                {file ? (
                  <img
                    src={URL.createObjectURL(file)}
                    alt="معاينة"
                    className="object-cover w-full h-full rounded-lg"
                  />
                ) : (
                  <span className="text-muted-foreground text-sm">صورة العمل</span>
                )}
              </div>
              <Input type="file" accept="image/*" onChange={handleFileChange} />
            </div>

            {/* العنوان */}
            <div className="space-y-2">
              <Label>العنوان</Label>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>

            {/* الفئات */}
            <div className="space-y-2">
              <Label>الفئات</Label>
              <div className="flex flex-wrap gap-4">
                {categories.map((cat) => (
                  <label key={cat.id} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      value={cat.id}
                      checked={selectedCategories.includes(cat.id)}
                      onChange={() => handleCategoryChange(cat.id)}
                      className="h-4 w-4"
                    />
                    <span>{cat.name}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* الوصف */}
            <div className="space-y-2">
              <Label>الوصف</Label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <Button type="submit" className="bg-brand-blue hover:bg-brand-blue/90">
              حفظ
            </Button>
          </CardContent>
        </Card>
      </form>
    </div>
  )
}
