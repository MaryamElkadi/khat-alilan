"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Eye } from "lucide-react"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { useCart } from "@/lib/CartProvider"
import { useRouter } from "next/navigation" 
import type { Product } from "@/lib/types"

const categories = [
  "جميع الفئات",
  "تصميم جرافيك",
  "تصميم مواقع ويب",
  "إعلانات وسائل التواصل",
  "طباعة ونشر",
  "التصوير الفوتوغرافي",
  "هدايا إعلانية",    
  "طباعة رقمية",  
]

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("جميع الفئات")
  const { addItem } = useCart()
  const router = useRouter() 

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("/api/products")
        if (!res.ok) {
          throw new Error(`Failed to fetch products: ${res.status}`)
        }
        
        const data = await res.json()
        console.log("API Response:", data) // Debug log
        
        // Handle different response structures
        let productsArray: Product[] = []
        
        if (Array.isArray(data)) {
          // If response is directly an array
          productsArray = data
        } else if (data.products && Array.isArray(data.products)) {
          // If response has products property
          productsArray = data.products
        } else if (data.success && Array.isArray(data.products)) {
          // If response has success and products
          productsArray = data.products
        } else {
          console.error("Unexpected API response format:", data)
          throw new Error("Unexpected API response format")
        }
        
        // Ensure all products have required fields
        const validatedProducts = productsArray.map(product => ({
          _id: product._id || "",
          title: product.title || "بدون عنوان",
          description: product.description || "لا يوجد وصف",
          price: Number(product.price) || 0,
          category: product.category || "غير مصنف",
          featured: Boolean(product.featured),
          status: product.status || "نشط",
          image: Array.isArray(product.image) ? product.image : 
                 typeof product.image === 'string' ? [product.image] : 
                 ["/placeholder.svg"],
          sizeOptions: Array.isArray(product.sizeOptions) ? product.sizeOptions : [],
          sideOptions: Array.isArray(product.sideOptions) ? product.sideOptions : [],
          materialOptions: Array.isArray(product.materialOptions) ? product.materialOptions : [],
          quantityOptions: Array.isArray(product.quantityOptions) ? product.quantityOptions : [],
          createdAt: product.createdAt || new Date().toISOString(),
          updatedAt: product.updatedAt || new Date().toISOString()
        }))
        
        setProducts(validatedProducts)
      } catch (err: any) {
        console.error("Fetch error:", err)
        setError(err.message || "حدث خطأ في تحميل المنتجات")
        setProducts([]) // Ensure products is always an array
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  // Safe filtering - always work with array
  const safeProducts = Array.isArray(products) ? products : []
  const filteredProducts = safeProducts.filter((product) => {
    const matchesCategory = selectedCategory === "جميع الفئات" || product.category === selectedCategory
    return matchesCategory
  })

  const handleAddToCart = (product: Product) => {
    const productWithTax = {
      ...product,
      price: Number((product.price * 1.15).toFixed(2)), 
    }
    addItem(productWithTax)
  }

  const viewProductDetails = (productId: string) => {
    if (productId) {
      router.push(`/products/${productId}`)
    }
  }

  // Safe image URL getter
  const getProductImage = (product: Product) => {
    if (!product.image) return "/placeholder.svg"
    
    if (Array.isArray(product.image)) {
      return product.image[0] || "/placeholder.svg"
    }
    
    return product.image || "/placeholder.svg"
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <main className="pt-8">
        
        {/* ✅ Category Filter Section */}
        <section className="py-6 border-b border-border">
          <div className="container mx-auto px-4 flex flex-wrap gap-3 justify-center">
            {categories.map((cat) => (
              <Button
                key={cat}
                variant={selectedCategory === cat ? "default" : "outline"}
                className={`px-4 py-2 rounded-full ${
                  selectedCategory === cat
                    ? "bg-primary text-primary-foreground"
                    : "border border-gray-600 text-gray-300 hover:bg-gray-800"
                }`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </Button>
            ))}
          </div>
        </section>

        {/* ✅ Products Grid */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <p className="text-center text-lg">جاري تحميل المنتجات...</p>
              </div>
            ) : error ? (
              <div className="flex justify-center items-center h-64">
                <p className="text-center text-red-500">{error}</p>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="flex justify-center items-center h-64">
                <p className="text-center text-gray-400">لا توجد منتجات لهذه الفئة.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredProducts.map((product, index) => {
                  const priceWithTax = (product.price * 1.15).toFixed(2)
                  const productImage = getProductImage(product)
                  
                  return (
                    <motion.div
                      key={product._id || index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                    >
                      <Card className="h-full overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
                        <CardHeader className="p-0 relative">
                          <div
                            className="relative overflow-hidden cursor-pointer"
                            onClick={() => viewProductDetails(product._id)}
                          >
                            <img
                              src={productImage}
                              alt={product.title}
                              className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                              onError={(e) => {
                                e.currentTarget.src = "/placeholder.svg"
                              }}
                            />
                            {product.featured && (
                              <Badge className="absolute top-4 right-4 bg-primary text-primary-foreground">مميز</Badge>
                            )}
                          </div>
                        </CardHeader>

                        <CardContent className="p-6">
                          <Badge variant="outline" className="mb-2 text-xs">
                            {product.category}
                          </Badge>
                          <h3
                            className="font-bold text-lg mb-2 leading-tight cursor-pointer hover:text-brand-blue"
                            onClick={() => viewProductDetails(product._id)}
                          >
                            {product.title}
                          </h3>
                          <p className="text-muted-foreground text-sm mb-4 leading-relaxed line-clamp-2">
                            {product.description}
                          </p>
                          <div className="mt-4 text-right">
                            <div className="text-gray-400">السعر: {product.price.toLocaleString()} ر.س</div>
                            <div className="text-2xl font-bold text-primary">مع الضريبة: {priceWithTax} ر.س</div>
                          </div>
                        </CardContent>

                        <CardFooter className="p-6 pt-0 flex gap-2">
                          <Button
                            onClick={() => handleAddToCart(product)}
                            className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
                          >
                            أضف إلى السلة
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => viewProductDetails(product._id)}
                            className="flex items-center gap-1"
                          >
                            <Eye className="h-4 w-4" />
                            عرض التفاصيل
                          </Button>
                        </CardFooter>
                      </Card>
                    </motion.div>
                  )
                })}
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}