"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Plus, Search, Edit, Trash2, Eye, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"

export default function WorksManagement() {
  const [works, setWorks] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const router = useRouter()

  // ✅ Fetch works from API
  useEffect(() => {
    const fetchWorks = async () => {
      try {
        const res = await fetch("/api/works")
        if (res.ok) {
          const data = await res.json()
          setWorks(data)
        }
      } catch (error) {
        console.error("Error fetching works:", error)
      }
    }
    fetchWorks()
  }, [])

  const filteredWorks = works.filter(
    (work) =>
      work.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      work.category.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // 🗑️ حذف عمل
  const handleDelete = async (id: string) => {
    if (confirm("هل أنت متأكد من حذف هذا العمل؟")) {
      await fetch(`/api/works/${id}`, { method: "DELETE" })
      setWorks(works.filter((w) => w._id !== id))
    }
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-brand-blue">إدارة الأعمال</h1>
          <p className="text-muted-foreground mt-1">إدارة وتحرير أعمال الشركة</p>
        </div>
        <Button
          className="bg-brand-blue hover:bg-brand-blue/90"
          onClick={() => router.push("/admin/works/new")}
        >
          <Plus className="h-4 w-4 ml-2" />
          إضافة عمل جديد
        </Button>
      </div>

      {/* Search */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="البحث في الأعمال..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pr-10"
              />
            </div>
            <Button variant="outline">تصفية</Button>
          </div>
        </CardContent>
      </Card>

      {/* Works Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredWorks.map((work, index) => (
          <motion.div
            key={work._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative">
                <img
                  src={work.image || "/placeholder.svg"}
                  alt={work.title}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-4 right-4 flex gap-2">
                  {work.featured && (
                    <Badge className="bg-brand-yellow text-black">
                      <Star className="h-3 w-3 ml-1" />
                      مميز
                    </Badge>
                  )}
                </div>
              </div>

              <CardHeader>
                <CardTitle className="text-lg leading-tight mb-2">{work.title}</CardTitle>
                <Badge variant="outline">{work.category}</Badge>
              </CardHeader>

              <CardContent>
                <p className="text-muted-foreground text-sm mb-4 line-clamp-2">{work.description}</p>

                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 bg-transparent"
                    onClick={() => router.push(`/admin/works/${work._id}`)}
                  >
                    <Eye className="h-4 w-4 ml-1" />
                    عرض
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 bg-transparent"
                    onClick={() => router.push(`/admin/works/edit/${work._id}`)}
                  >
                    <Edit className="h-4 w-4 ml-1" />
                    تحرير
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-red-500 hover:text-red-600 bg-transparent"
                    onClick={() => handleDelete(work._id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
