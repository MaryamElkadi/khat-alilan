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

// Define Category type
interface Category {
  _id: string;
  name: string;
  description: string;
  slug: string;
  image: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<string[]>(["جميع الفئات"])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("جميع الفئات")
  const { addItem } = useCart()
  const router = useRouter() 

  // Fetch products and categories
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError("")

        // Fetch products
        const productsRes = await fetch("/api/products")
        if (!productsRes.ok) {
          throw new Error(`Failed to fetch products: ${productsRes.status}`)
        }
        
        const productsData = await productsRes.json()
        console.log("Products API Response:", productsData)
        
        // Handle different response structures for products
        let productsArray: Product[] = []
        
        if (Array.isArray(productsData)) {
          productsArray = productsData
        } else if (productsData.products && Array.isArray(productsData.products)) {
          productsArray = productsData.products
        } else if (productsData.success && Array.isArray(productsData.products)) {
          productsArray = productsData.products
        } else if (productsData.data && Array.isArray(productsData.data)) {
          productsArray = productsData.data
        } else {
          console.error("Unexpected products API response format:", productsData)
          throw new Error("Unexpected products API response format")
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

        // Extract categories from products
        const productCategories = new Set<string>()
        validatedProducts.forEach(product => {
          if (product.category && product.category.trim() !== "" && product.category !== "غير مصنف") {
            productCategories.add(product.category)
          }
        })

        // Fetch categories from categories API
        try {
          const categoriesRes = await fetch('/api/categories')
          if (categoriesRes.ok) {
            const categoriesData = await categoriesRes.json()
            console.log("Categories API Response:", categoriesData)
            
            const categoriesList = categoriesData.categories || categoriesData.data || []
            
            // Add categories from categories API
            categoriesList.forEach((category: Category) => {
              if (category.name && category.name.trim() !== "" && category.isActive !== false) {
                productCategories.add(category.name)
              }
            })
          } else {
            console.warn('Failed to fetch categories API, using only product categories')
          }
        } catch (categoriesError) {
          console.warn('Error fetching categories API, using only product categories:', categoriesError)
        }

        // Convert Set to array and sort
        const allCategories = ["جميع الفئات", ...Array.from(productCategories).sort()]
        setCategories(allCategories)

        console.log("Final categories list:", allCategories)

      } catch (err: any) {
        console.error("Fetch error:", err)
        setError(err.message || "حدث خطأ في تحميل البيانات")
        setProducts([])
      } finally {
        setLoading(false)
      }
    }

    fetchData()
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
          <div className="container mx-auto px-4">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-brand-blue mb-2">تصفح منتجاتنا</h2>
              <p className="text-gray-400">اختر من بين فئاتنا المختلفة</p>
            </div>
            <div className="flex flex-wrap gap-3 justify-center">
              {categories.map((cat) => (
                <Button
                  key={cat}
                  variant={selectedCategory === cat ? "default" : "outline"}
                  className={`px-4 py-2 rounded-full transition-all duration-300 ${
                    selectedCategory === cat
                      ? "bg-primary text-primary-foreground shadow-lg"
                      : "border border-gray-600 text-gray-300 hover:bg-gray-800 hover:border-gray-500"
                  }`}
                  onClick={() => setSelectedCategory(cat)}
                >
                  {cat}
                </Button>
              ))}
            </div>
            {selectedCategory !== "جميع الفئات" && (
              <div className="text-center mt-4">
                <p className="text-sm text-gray-400">
                  عرض {filteredProducts.length} منتج في فئة "{selectedCategory}"
                </p>
              </div>
            )}
          </div>
        </section>

        {/* ✅ Products Grid */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            {loading ? (
              <div className="flex flex-col justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
                <p className="text-center text-lg">جاري تحميل المنتجات...</p>
                <p className="text-sm text-gray-400 mt-2">يرجى الانتظار</p>
              </div>
            ) : error ? (
              <div className="flex flex-col justify-center items-center h-64">
                <div className="bg-red-900/20 border border-red-800 rounded-lg p-6 max-w-md text-center">
                  <p className="text-red-400 text-lg mb-2">حدث خطأ</p>
                  <p className="text-red-300">{error}</p>
                  <Button 
                    onClick={() => window.location.reload()} 
                    variant="outline" 
                    className="mt-4 border-red-700 text-red-300 hover:bg-red-900"
                  >
                    إعادة المحاولة
                  </Button>
                </div>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="flex flex-col justify-center items-center h-64 text-center">
                <div className="bg-gray-800/50 rounded-lg p-8 max-w-md">
                  <p className="text-2xl mb-2">📦</p>
                  <h3 className="text-xl font-semibold mb-2">لا توجد منتجات</h3>
                  <p className="text-gray-400 mb-4">
                    {selectedCategory === "جميع الفئات" 
                      ? "لم يتم العثور على أي منتجات حالياً." 
                      : `لا توجد منتجات في فئة "${selectedCategory}".`}
                  </p>
                  {selectedCategory !== "جميع الفئات" && (
                    <Button 
                      onClick={() => setSelectedCategory("جميع الفئات")}
                      variant="outline"
                      className="border-gray-600"
                    >
                      عرض جميع المنتجات
                    </Button>
                  )}
                </div>
              </div>
            ) : (
              <>
                {/* Products Count */}
                <div className="mb-8 text-center">
                  <p className="text-gray-400">
                    عرض {filteredProducts.length} من أصل {safeProducts.length} منتج
                    {selectedCategory !== "جميع الفئات" && ` في فئة "${selectedCategory}"`}
                  </p>
                </div>

                {/* Products Grid */}
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
                        whileHover={{ y: -5 }}
                        className="h-full"
                      >
                        <Card className="h-full overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 group bg-gray-900/50 backdrop-blur-sm">
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
                              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                              {product.featured && (
                                <Badge className="absolute top-4 right-4 bg-yellow-600 text-white border-0">
                                  مميز
                                </Badge>
                              )}
                              <Badge 
                                variant="secondary" 
                                className="absolute bottom-4 right-4 bg-gray-800/90 text-gray-200 border-0"
                              >
                                {product.category}
                              </Badge>
                            </div>
                          </CardHeader>

                          <CardContent className="p-6 flex flex-col flex-grow">
                            <h3
                              className="font-bold text-lg mb-2 leading-tight cursor-pointer hover:text-brand-blue transition-colors duration-200 line-clamp-2"
                              onClick={() => viewProductDetails(product._id)}
                            >
                              {product.title}
                            </h3>
                            <p className="text-gray-400 text-sm mb-4 leading-relaxed line-clamp-3 flex-grow">
                              {product.description}
                            </p>
                            <div className="mt-auto space-y-2">
                              <div className="flex justify-between items-center">
                                <span className="text-gray-500 text-sm">السعر الأساسي:</span>
                                <span className="text-gray-300">{product.price.toLocaleString()} ر.س</span>
                              </div>
                              <div className="flex justify-between items-center border-t border-gray-700 pt-2">
                                <span className="text-gray-500 text-sm">السعر شامل الضريبة:</span>
                                <span className="text-2xl font-bold text-primary">{priceWithTax} ر.س</span>
                              </div>
                            </div>
                          </CardContent>

                          <CardFooter className="p-6 pt-0 flex gap-2">
                            <Button
                              onClick={() => handleAddToCart(product)}
                              className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-300"
                            >
                              أضف إلى السلة
                            </Button>
                            <Button
                              variant="outline"
                              onClick={() => viewProductDetails(product._id)}
                              className="flex items-center gap-1 border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white transition-all duration-300"
                            >
                              <Eye className="h-4 w-4" />
                              التفاصيل
                            </Button>
                          </CardFooter>
                        </Card>
                      </motion.div>
                    )
                  })}
                </div>
              </>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}