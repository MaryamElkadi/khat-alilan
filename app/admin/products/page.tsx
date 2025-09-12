"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Plus, Search, Edit, Trash2, Eye, Package, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"

const initialProducts = [
  {
    id: "logo-design-package",
    title: "باقة تصميم الشعار الاحترافية",
    description: "تصميم شعار احترافي مع دليل الهوية البصرية الكامل",
    price: 1500,
    image: "/professional-logo-design-package.jpg",
    category: "تصميم جرافيك",
    featured: true,
    status: "نشط",
    sales: 45,
  },
  // باقي المنتجات...
]

export default function ProductsManagement() {
  const [searchTerm, setSearchTerm] = useState("")
  const [products, setProducts] = useState(initialProducts)
  const router = useRouter()

  const filteredProducts = products.filter(
    (product) =>
      product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // حذف المنتج
  const handleDelete = (id: string) => {
    if (confirm("هل أنت متأكد من حذف هذا المنتج؟")) {
      setProducts(products.filter((p) => p.id !== id))
    }
  }

  // عرض المنتج
  const handleView = (id: string) => {
    router.push(`/admin/products/${id}`)
  }

  // تعديل المنتج
  const handleEdit = (id: string) => {
    router.push(`/admin/products/edit/${id}`)
  }

  // تحديث المنتج بعد التعديل
  const updateProduct = (id, updatedData) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updatedData } : p))
    )
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-brand-blue">إدارة المنتجات</h1>
          <p className="text-muted-foreground mt-1">إدارة وتحرير منتجات وخدمات الشركة</p>
        </div>
        <Button
          className="bg-brand-blue hover:bg-brand-blue/90"
          onClick={() => router.push("/admin/products/new")}
        >
          <Plus className="h-4 w-4 ml-2" />
          إضافة منتج جديد
        </Button>
      </div>

      {/* Search */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="البحث في المنتجات..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pr-10"
              />
            </div>
            <Button variant="outline">تصفية</Button>
          </div>
        </CardContent>
      </Card>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product, index) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative">
                <img
                  src={product.image || "/placeholder.svg"}
                  alt={product.title}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-4 right-4 flex gap-2">
                  {product.featured && (
                    <Badge className="bg-brand-yellow text-black">
                      <Star className="h-3 w-3 ml-1" />
                      مميز
                    </Badge>
                  )}
                  <Badge
                    variant={product.status === "نشط" ? "default" : "secondary"}
                    className={product.status === "نشط" ? "bg-green-500" : ""}
                  >
                    {product.status}
                  </Badge>
                </div>
              </div>

              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg leading-tight mb-2">{product.title}</CardTitle>
                    <Badge variant="outline" className="text-xs">
                      {product.category}
                    </Badge>
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                <p className="text-muted-foreground text-sm mb-4 line-clamp-2">{product.description}</p>

                <div className="flex items-center justify-between mb-4">
                  <div className="text-2xl font-bold text-brand-yellow">{product.price.toLocaleString()} ر.س</div>
                  <div className="text-sm text-muted-foreground">{product.sales} مبيعة</div>
                </div>

                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 bg-transparent"
                    onClick={() => handleView(product.id)}
                  >
                    <Eye className="h-4 w-4 ml-1" />
                    عرض
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 bg-transparent"
                    onClick={() => handleEdit(product.id)}
                  >
                    <Edit className="h-4 w-4 ml-1" />
                    تحرير
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-red-500 hover:text-red-600 bg-transparent"
                    onClick={() => handleDelete(product.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8">
        <Card>
          <CardContent className="p-6 text-center">
            <Package className="h-8 w-8 text-brand-blue mx-auto mb-2" />
            <div className="text-2xl font-bold">{products.length}</div>
            <div className="text-sm text-muted-foreground">إجمالي المنتجات</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <Star className="h-8 w-8 text-brand-yellow mx-auto mb-2" />
            <div className="text-2xl font-bold">{products.filter((p) => p.featured).length}</div>
            <div className="text-sm text-muted-foreground">منتجات مميزة</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <div className="h-8 w-8 bg-green-500 rounded-full mx-auto mb-2 flex items-center justify-center">
              <div className="w-3 h-3 bg-white rounded-full"></div>
            </div>
            <div className="text-2xl font-bold">{products.filter((p) => p.status === "نشط").length}</div>
            <div className="text-sm text-muted-foreground">منتجات نشطة</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <div className="h-8 w-8 bg-muted rounded-full mx-auto mb-2 flex items-center justify-center">
              <div className="w-3 h-3 bg-muted-foreground rounded-full"></div>
            </div>
            <div className="text-2xl font-bold">{products.filter((p) => p.status === "مسودة").length}</div>
            <div className="text-sm text-muted-foreground">مسودات</div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
