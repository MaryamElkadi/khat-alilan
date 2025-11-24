"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Plus, Search, Edit, Trash2, Tag, Eye, EyeOff, Package } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface Category {
  _id: string
  name: string
  description: string
  slug: string
  image: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

interface Product {
  _id: string
  title: string
  description: string
  price: number
  category: string
  featured: boolean
  status: string
  image: string | string[]
  quantityOptions?: any[]
  sizeOptions?: any[]
  sideOptions?: any[]
  materialOptions?: any[]
  createdAt: string
  updatedAt: string
}

interface LegacyCategory {
  name: string
  type: "legacy"
  productCount: number
}

export default function CategoriesManagement() {
  const [categories, setCategories] = useState<Category[]>([])
  const [legacyCategories, setLegacyCategories] = useState<LegacyCategory[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    image: "/placeholder-category.svg"
  })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchAllData()
  }, [])

  const fetchAllData = async () => {
    try {
      setLoading(true)
      await Promise.all([
        fetchCategories(),
        fetchLegacyCategories()
      ])
    } catch (error) {
      console.error("Error fetching data:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/categories")
      if (res.ok) {
        const data = await res.json()
        setCategories(data.categories || [])
      } else {
        console.error("فشل في جلب الفئات الرسمية")
      }
    } catch (error) {
      console.error("خطأ في الاتصال", error)
    }
  }

  const fetchLegacyCategories = async () => {
    try {
      console.log("🔄 Fetching products for legacy categories...")
      const res = await fetch('/api/products?limit=1000')
      
      if (res.ok) {
        const data = await res.json()
        console.log("📡 Products data for legacy categories:", data)
        
        // Extract unique categories from products and count products per category
        const categoryCountMap = new Map<string, number>()
        
        let products: Product[] = []
        if (data.products && Array.isArray(data.products)) {
          products = data.products
        } else if (Array.isArray(data)) {
          products = data
        }

        products.forEach((product: Product) => {
          if (product.category && product.category.trim() !== "") {
            const categoryName = product.category.trim()
            categoryCountMap.set(categoryName, (categoryCountMap.get(categoryName) || 0) + 1)
          }
        })

        // Convert to array and sort by product count (descending)
        const legacyCats = Array.from(categoryCountMap.entries())
          .map(([name, productCount]) => ({
            name,
            type: "legacy" as const,
            productCount
          }))
          .sort((a, b) => b.productCount - a.productCount)

        console.log("📊 Legacy categories found:", legacyCats)
        setLegacyCategories(legacyCats)
      } else {
        console.error('Failed to fetch products for legacy categories')
      }
    } catch (error) {
      console.error('Error fetching legacy categories:', error)
    }
  }

  // Filter categories based on search term
  const filteredOfficialCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const filteredLegacyCategories = legacyCategories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const hasSearchResults = filteredOfficialCategories.length > 0 || filteredLegacyCategories.length > 0

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const res = await fetch("/api/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const result = await res.json()

      if (res.ok && result.success) {
        alert("تم إضافة الفئة بنجاح")
        setFormData({ name: "", description: "", image: "/placeholder-category.svg" })
        setIsAddDialogOpen(false)
        fetchAllData()
      } else {
        alert(result.error || "فشل في إضافة الفئة")
      }
    } catch (error) {
      console.error("Error adding category:", error)
      alert("حدث خطأ أثناء إضافة الفئة")
    } finally {
      setSaving(false)
    }
  }

  const handleEditCategory = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingCategory) return

    setSaving(true)

    try {
      const res = await fetch(`/api/categories/${editingCategory._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const result = await res.json()

      if (res.ok && result.success) {
        alert("تم تحديث الفئة بنجاح")
        setFormData({ name: "", description: "", image: "/placeholder-category.svg" })
        setEditingCategory(null)
        setIsEditDialogOpen(false)
        fetchAllData()
      } else {
        alert(result.error || "فشل في تحديث الفئة")
      }
    } catch (error) {
      console.error("Error updating category:", error)
      alert("حدث خطأ أثناء تحديث الفئة")
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteCategory = async (id: string) => {
    if (confirm("هل أنت متأكد من حذف هذه الفئة؟")) {
      try {
        const res = await fetch(`/api/categories/${id}`, {
          method: "DELETE"
        })

        const result = await res.json()

        if (res.ok && result.success) {
          alert("تم حذف الفئة بنجاح")
          fetchAllData()
        } else {
          alert(result.error || "فشل في حذف الفئة")
        }
      } catch (error) {
        console.error("Error deleting category:", error)
        alert("حدث خطأ أثناء حذف الفئة")
      }
    }
  }

  const handleToggleStatus = async (category: Category) => {
    try {
      const res = await fetch(`/api/categories/${category._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...category,
          isActive: !category.isActive
        }),
      })

      const result = await res.json()

      if (res.ok && result.success) {
        fetchAllData()
      } else {
        alert(result.error || "فشل في تغيير حالة الفئة")
      }
    } catch (error) {
      console.error("Error toggling category status:", error)
      alert("حدث خطأ أثناء تغيير حالة الفئة")
    }
  }

  const openEditDialog = (category: Category) => {
    setEditingCategory(category)
    setFormData({
      name: category.name,
      description: category.description,
      image: category.image
    })
    setIsEditDialogOpen(true)
  }

  // Convert legacy category to official category
  const handleConvertLegacyCategory = async (legacyCategory: LegacyCategory) => {
    if (confirm(`هل تريد تحويل الفئة "${legacyCategory.name}" إلى فئة رسمية؟`)) {
      setSaving(true)
      try {
        const res = await fetch("/api/categories", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: legacyCategory.name,
            description: `تم تحويل هذه الفئة تلقائياً من المنتجات (${legacyCategory.productCount} منتج)`,
            image: "/placeholder-category.svg"
          }),
        })

        const result = await res.json()

        if (res.ok && result.success) {
          alert("تم تحويل الفئة بنجاح")
          fetchAllData()
        } else {
          alert(result.error || "فشل في تحويل الفئة")
        }
      } catch (error) {
        console.error("Error converting category:", error)
        alert("حدث خطأ أثناء تحويل الفئة")
      } finally {
        setSaving(false)
      }
    }
  }

  if (loading) {
    return (
      <div className="p-8">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg">جاري تحميل الفئات...</div>
        </div>
      </div>
    )
  }

  const totalCategories = categories.length + legacyCategories.length

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-brand-blue">إدارة الفئات</h1>
          <p className="text-muted-foreground mt-1">إدارة وتنظيم فئات المنتجات</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-brand-blue hover:bg-brand-blue/90">
              <Plus className="h-4 w-4 ml-2" />
              إضافة فئة جديدة
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>إضافة فئة جديدة</DialogTitle>
              <DialogDescription>
                أدخل معلومات الفئة الجديدة
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddCategory}>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">اسم الفئة *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="أدخل اسم الفئة"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">وصف الفئة</Label>
                  <Input
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="أدخل وصف الفئة (اختياري)"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  إلغاء
                </Button>
                <Button type="submit" disabled={saving} className="bg-brand-blue hover:bg-brand-blue/90">
                  {saving ? "جاري الإضافة..." : "إضافة الفئة"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Edit Category Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>تعديل الفئة</DialogTitle>
            <DialogDescription>
              تعديل معلومات الفئة
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditCategory}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">اسم الفئة *</Label>
                <Input
                  id="edit-name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="أدخل اسم الفئة"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-description">وصف الفئة</Label>
                <Input
                  id="edit-description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="أدخل وصف الفئة (اختياري)"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                إلغاء
              </Button>
              <Button type="submit" disabled={saving} className="bg-brand-blue hover:bg-brand-blue/90">
                {saving ? "جاري التحديث..." : "تحديث الفئة"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="البحث في الفئات..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pr-10"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {totalCategories === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Tag className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">لا توجد فئات</h3>
            <p className="text-muted-foreground mb-6">لم تقم بإضافة أي فئات بعد</p>
            <Button
              className="bg-brand-blue hover:bg-brand-blue/90"
              onClick={() => setIsAddDialogOpen(true)}
            >
              <Plus className="h-4 w-4 ml-2" />
              إضافة أول فئة
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Official Categories Section */}
          {filteredOfficialCategories.length > 0 && (
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-6">
                <Tag className="h-6 w-6 text-brand-blue" />
                <h2 className="text-2xl font-bold text-brand-blue">الفئات الرسمية</h2>
                <Badge variant="secondary" className="text-sm">
                  {filteredOfficialCategories.length} فئة
                </Badge>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredOfficialCategories.map((category, index) => (
                  <motion.div
                    key={category._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                      <div className="relative h-32 bg-gradient-to-br from-blue-50 to-blue-100">
                        <img
                          src={category.image}
                          alt={category.name}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-3 left-3">
                          <Badge variant={category.isActive ? "default" : "secondary"} className={category.isActive ? "bg-green-500" : "bg-gray-500"}>
                            {category.isActive ? "نشطة" : "غير نشطة"}
                          </Badge>
                        </div>
                      </div>

                      <CardHeader>
                        <CardTitle className="text-lg">{category.name}</CardTitle>
                        <p className="text-muted-foreground text-sm line-clamp-2">
                          {category.description || "لا يوجد وصف"}
                        </p>
                      </CardHeader>

                      <CardContent>
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-2">
                            <Label htmlFor={`status-${category._id}`} className="text-sm">
                              {category.isActive ? "نشطة" : "غير نشطة"}
                            </Label>
                            <Switch
                              id={`status-${category._id}`}
                              checked={category.isActive}
                              onCheckedChange={() => handleToggleStatus(category)}
                            />
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {category.slug}
                          </Badge>
                        </div>

                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="flex-1 bg-transparent" 
                            onClick={() => openEditDialog(category)}
                          >
                            <Edit className="h-4 w-4 ml-1" />
                            تحرير
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="text-red-500 hover:text-red-600 bg-transparent" 
                            onClick={() => handleDeleteCategory(category._id)}
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
          )}

          {/* Legacy Categories Section */}
          {filteredLegacyCategories.length > 0 && (
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-6">
                <Package className="h-6 w-6 text-orange-500" />
                <h2 className="text-2xl font-bold text-orange-500">فئات من المنتجات</h2>
                <Badge variant="secondary" className="text-sm">
                  {filteredLegacyCategories.length} فئة
                </Badge>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredLegacyCategories.map((category, index) => (
                  <motion.div
                    key={category.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="overflow-hidden hover:shadow-lg transition-shadow border-orange-200">
                      <div className="relative h-32 bg-gradient-to-br from-orange-50 to-orange-100">
                        <div className="w-full h-full flex items-center justify-center">
                          <Package className="h-12 w-12 text-orange-400" />
                        </div>
                        <div className="absolute top-3 left-3">
                          <Badge variant="secondary" className="bg-orange-500">
                            من المنتجات
                          </Badge>
                        </div>
                      </div>

                      <CardHeader>
                        <CardTitle className="text-lg">{category.name}</CardTitle>
                        <p className="text-muted-foreground text-sm">
                          {category.productCount} منتج
                        </p>
                      </CardHeader>

                      <CardContent>
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="flex-1 bg-transparent border-orange-200 text-orange-600 hover:bg-orange-50" 
                            onClick={() => handleConvertLegacyCategory(category)}
                            disabled={saving}
                          >
                            <Plus className="h-4 w-4 ml-1" />
                            {saving ? "جاري التحويل..." : "تحويل إلى رسمية"}
                          </Button>
                        </div>
                        <p className="text-xs text-muted-foreground mt-2 text-center">
                          هذه الفئة مستخدمة في المنتجات ولكنها غير مسجلة في النظام الرسمي
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* No search results */}
          {!hasSearchResults && searchTerm && (
            <Card>
              <CardContent className="p-12 text-center">
                <Search className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">لا توجد نتائج</h3>
                <p className="text-muted-foreground mb-6">لم نعثر على فئات تطابق بحثك</p>
                <Button
                  variant="outline"
                  onClick={() => setSearchTerm("")}
                >
                  مسح البحث
                </Button>
              </CardContent>
            </Card>
          )}
        </>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8">
        <Card>
          <CardContent className="p-6 text-center">
            <Tag className="h-8 w-8 text-brand-blue mx-auto mb-2" />
            <div className="text-2xl font-bold">{totalCategories}</div>
            <div className="text-sm text-muted-foreground">إجمالي الفئات</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <Eye className="h-8 w-8 text-green-500 mx-auto mb-2" />
            <div className="text-2xl font-bold">
              {categories.filter(c => c.isActive).length}
            </div>
            <div className="text-sm text-muted-foreground">فئات رسمية نشطة</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <Package className="h-8 w-8 text-orange-500 mx-auto mb-2" />
            <div className="text-2xl font-bold">
              {legacyCategories.length}
            </div>
            <div className="text-sm text-muted-foreground">فئات من المنتجات</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <EyeOff className="h-8 w-8 text-gray-500 mx-auto mb-2" />
            <div className="text-2xl font-bold">
              {categories.filter(c => !c.isActive).length}
            </div>
            <div className="text-sm text-muted-foreground">فئات غير نشطة</div>
          </CardContent>
        </Card>
      </div>
    </div>
  )

  
}