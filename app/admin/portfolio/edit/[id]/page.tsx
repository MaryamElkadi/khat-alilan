"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "react-toastify"

export default function EditPortfolioPage() {
  const { id } = useParams()
  const router = useRouter()
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return
    const fetchData = async () => {
      try {
        const res = await fetch(`/api/portfolio/${id}`)
        if (!res.ok) throw new Error("لم يتم العثور على العمل")
        const data = await res.json()
        setTitle(data.title || "")
        setDescription(data.description || "")
      } catch (error) {
        toast.error("خطأ أثناء تحميل البيانات ❌")
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [id])

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await fetch(`/api/portfolio/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description }),
      })
      if (res.ok) {
        toast.success("تم التحديث بنجاح ✅")
        router.push("/admin/portfolio")
      } else {
        toast.error("فشل التحديث ❌")
      }
    } catch {
      toast.error("مشكلة في الاتصال بالسيرفر ⚠️")
    }
  }

  if (loading) return <p>جاري التحميل...</p>

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">تعديل العمل</h1>
      <form onSubmit={handleUpdate} className="space-y-6">
        <div>
          <label>العنوان</label>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>
        <div>
          <label>الوصف</label>
          <Textarea value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>
        <Button type="submit" className="bg-brand-blue hover:bg-brand-blue/90">
          تحديث
        </Button>
      </form>
    </div>
  )
}
