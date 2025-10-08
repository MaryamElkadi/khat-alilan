"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Plus, Search, Edit, Trash2, Eye, Package, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"
import { useProducts } from "@/app/admin/context/products"

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
}

export default function ProductsManagement() {
  const [searchTerm, setSearchTerm] = useState("")
  const { products, setProducts } = useProducts()
  const router = useRouter()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        const res = await fetch("/api/products")
        if (res.ok) {
          const data = await res.json()
          console.log("API Response:", data) // Debug log
          
          // Handle different response structures
          if (Array.isArray(data)) {
            setProducts(data)
          } else if (data.products && Array.isArray(data.products)) {
            setProducts(data.products)
          } else if (data.success && Array.isArray(data.products)) {
            setProducts(data.products)
          } else {
            console.error("Invalid data format:", data)
            setProducts([])
          }
        } else {
          console.error("فشل في جلب المنتجات")
          setProducts([])
        }
      } catch (error) {
        console.error("خطأ في الاتصال", error)
        setProducts([])
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [setProducts])

  // Safe filtering with array check and null safety
  const safeProducts = Array.isArray(products) ? products : []
  const filteredProducts = safeProducts.filter(
    (product) =>
      product?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product?.category?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleDelete = async (id: string) => {
    if (confirm("هل أنت متأكد من حذف هذا المنتج؟")) {
      try {
        const res = await fetch(`/api/products?id=${id}`, { 
          method: "DELETE" 
        })
        
        if (res.ok) {
          setProducts(safeProducts.filter((p) => p._id !== id))
        } else {
          console.error("فشل في حذف المنتج")
          alert("فشل في حذف المنتج")
        }
      } catch (error) {
        console.error("خطأ في الاتصال", error)
        alert("حدث خطأ أثناء حذف المنتج")
      }
    }
  }

  const handleView = (id: string) => {
    router.push(`/products/${id}`)
  }

  const handleEdit = (id: string) => {
    router.push(`/admin/products/edit/${id}`)
  }

  // Helper function to get image URL safely
  const getProductImage = (product: Product) => {
    if (!product.image) return "/placeholder.svg"
    
    if (Array.isArray(product.image)) {
      return product.image[0] || "/placeholder.svg"
    }
    
    return product.image || "/placeholder.svg"
  }

  // Helper function to safely access quantity options
  const getQuantityOptions = (product: Product) => {
    if (!product.quantityOptions || !Array.isArray(product.quantityOptions)) {
      return []
    }
    return product.quantityOptions
  }

  if (loading) {
    return (
      <div className="p-8">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg">جاري تحميل المنتجات...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8">
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

      {safeProducts.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">لا توجد منتجات</h3>
            <p className="text-muted-foreground mb-6">لم تقم بإضافة أي منتجات بعد</p>
            <Button
              className="bg-brand-blue hover:bg-brand-blue/90"
              onClick={() => router.push("/admin/products/new")}
            >
              <Plus className="h-4 w-4 ml-2" />
              إضافة أول منتج
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product, index) => (
              <motion.div
                key={product._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative">
                    <img
                      src={getProductImage(product)}
                      alt={product.title || "Product image"}
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
                        {product.status || "غير محدد"}
                      </Badge>
                    </div>
                  </div>

                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg leading-tight mb-2">
                          {product.title || "بدون عنوان"}
                        </CardTitle>
                        <Badge variant="outline" className="text-xs">
                          {product.category || "بدون فئة"}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent>
                    <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                      {product.description || "لا يوجد وصف"}
                    </p>
                    
                    {getQuantityOptions(product).length > 0 && (
                      <div className="mt-2">
                        <span className="text-xs text-muted-foreground">خيارات الكمية:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {getQuantityOptions(product).map((option, idx) => (
                            <Badge key={idx} variant="secondary" className="text-xs">
                              {typeof option === 'object' ? 
                                `${option.quantity} (${option.price} ر.س)` : 
                                String(option).toLocaleString()}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between mt-4 mb-4">
                      <div className="text-2xl font-bold text-brand-yellow">
                        {product.price?.toLocaleString() || "0"} ر.س
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="flex-1 bg-transparent" 
                        onClick={() => handleView(product._id)}
                      >
                        <Eye className="h-4 w-4 ml-1" />
                        عرض
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="flex-1 bg-transparent" 
                        onClick={() => handleEdit(product._id)}
                      >
                        <Edit className="h-4 w-4 ml-1" />
                        تحرير
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="text-red-500 hover:text-red-600 bg-transparent" 
                        onClick={() => handleDelete(product._id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8">
            <Card>
              <CardContent className="p-6 text-center">
                <Package className="h-8 w-8 text-brand-blue mx-auto mb-2" />
                <div className="text-2xl font-bold">{safeProducts.length}</div>
                <div className="text-sm text-muted-foreground">إجمالي المنتجات</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <Star className="h-8 w-8 text-brand-yellow mx-auto mb-2" />
                <div className="text-2xl font-bold">
                  {safeProducts.filter((p) => p.featured).length}
                </div>
                <div className="text-sm text-muted-foreground">منتجات مميزة</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <div className="h-8 w-8 bg-green-500 rounded-full mx-auto mb-2 flex items-center justify-center">
                  <div className="w-3 h-3 bg-white rounded-full"></div>
                </div>
                <div className="text-2xl font-bold">
                  {safeProducts.filter((p) => p.status === "نشط").length}
                </div>
                <div className="text-sm text-muted-foreground">منتجات نشطة</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <div className="h-8 w-8 bg-muted rounded-full mx-auto mb-2 flex items-center justify-center">
                  <div className="w-3 h-3 bg-muted-foreground rounded-full"></div>
                </div>
                <div className="text-2xl font-bold">
                  {safeProducts.filter((p) => p.status === "مسودة").length}
                </div>
                <div className="text-sm text-muted-foreground">مسودات</div>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  )
}