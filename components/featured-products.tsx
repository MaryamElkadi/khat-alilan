// components/featured-products.tsx
"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { ShoppingCart, Star, Eye, Sparkles } from "lucide-react"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useCart } from "@/lib/CartProvider"
import { useRouter } from "next/navigation"

// Define proper Product type
type Product = {
  _id: string
  id?: string
  title: string
  description: string
  price: number
  category: string
  image?: string[]
  rating?: number
  reviewCount?: number
}

export function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { addItem } = useCart()
  const router = useRouter()

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true)
      setError(null)
      try {
        console.log("Fetching products from /api/products...")
        const res = await fetch("/api/products")
        
        if (!res.ok) {
          throw new Error(`Failed to fetch products: ${res.status} ${res.statusText}`)
        }
        
        const data = await res.json()
        console.log("Products API response:", data)

        // Handle different response formats
        if (Array.isArray(data)) {
          setProducts(data)
        } else if (data && Array.isArray(data.products)) {
          setProducts(data.products)
        } else if (data && Array.isArray(data.data)) {
          setProducts(data.data)
        } else {
          console.warn("Unexpected API response format:", data)
          setProducts([])
        }

      } catch (error) {
        console.error("Error fetching products:", error)
        setError(error instanceof Error ? error.message : "Unknown error occurred")
        setProducts([])
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  const addToCart = (product: Product) => addItem(product)
  
  const viewProductDetails = (productId: string) => {
    router.push(`/products/${productId}`)
  }
  
  const viewAllProducts = () => {
    router.push("/products")
  }

  // Enhanced loading state
  if (loading) {
    return (
      <section className="py-20 bg-gradient-to-b from-muted/30 to-background">
        <div className="container mx-auto px-4 text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-brand-blue mx-auto mb-4"></div>
          <p className="text-xl text-brand-blue">جاري تحميل المنتجات...</p>
          <p className="text-sm text-muted-foreground mt-2">يرجى الانتظار</p>
        </div>
      </section>
    )
  }

  // Enhanced error state
  if (error) {
    return (
      <section className="py-20 bg-gradient-to-b from-muted/30 to-background">
        <div className="container mx-auto px-4 text-center">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
            <p className="text-red-600 font-medium mb-2">حدث خطأ في تحميل المنتجات</p>
            <p className="text-red-500 text-sm mb-4">{error}</p>
            <Button 
              onClick={() => window.location.reload()}
              variant="outline"
              size="sm"
            >
              إعادة المحاولة
            </Button>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-20 bg-gradient-to-b from-muted/30 to-background">
      <div className="container mx-auto px-4">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16 relative"
        >
          <motion.div
            animate={{ rotate: [0, 360], scale: [1, 1.2, 1] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="absolute -top-4 right-1/2 transform translate-x-1/2"
          >
            <Sparkles className="h-6 w-6 text-brand-yellow" />
          </motion.div>

          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-brand-blue">جميع</span>{" "}
            <span className="text-brand-yellow">المنتجات</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            اكتشف مجموعة منتجاتنا المتميزة المصممة لنجاحك
          </p>
        </motion.div>

        {/* Products Grid */}
        {products.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-muted/50 rounded-lg p-8 max-w-md mx-auto">
              <ShoppingCart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">لا توجد منتجات حالياً</h3>
              <p className="text-muted-foreground">سنضيف منتجات قريباً</p>
            </div>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, staggerChildren: 0.1 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {products.map((product, index) => (
              <motion.div
                key={product._id || product.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -8 }}
                className="h-full"
              >
                <Card className="h-full border-0 shadow-lg hover:shadow-2xl transition-all duration-300 bg-card backdrop-blur-sm relative overflow-hidden group">
                  <CardHeader className="p-0 relative">
                    <div className="relative overflow-hidden">
                      <img
                        src={product.image?.[0] || "/placeholder.svg"}
                        alt={product.title}
                        className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                  </CardHeader>

                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <Badge variant="outline" className="text-xs border-brand-blue text-brand-blue">
                        {product.category}
                      </Badge>
                      {product.rating && (
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          <span className="text-xs text-muted-foreground">{product.rating}</span>
                        </div>
                      )}
                    </div>

                    <h3 className="font-bold text-lg mb-2 text-foreground leading-tight">
                      {product.title}
                    </h3>
                    <p className="text-muted-foreground text-sm mb-4 leading-relaxed line-clamp-2">
                      {product.description}
                    </p>

                    <div className="flex items-center justify-between">
                      <div className="text-2xl font-bold text-brand-yellow">
                        {product.price.toLocaleString()} ر.س
                      </div>
                      <div className="text-xs text-muted-foreground">يبدأ من</div>
                    </div>
                  </CardContent>

                  <CardFooter className="p-6 pt-0">
                    <div className="flex gap-2 w-full">
                      <Button
                        variant="outline"
                        className="flex-1 border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                        onClick={() => viewProductDetails(product._id || product.id!)}
                      >
                        <Eye className="h-4 w-4 ml-2" />
                        التفاصيل
                      </Button>
                      <Button
                        className="flex-1 bg-gradient-to-r from-brand-blue to-blue-600 hover:from-brand-blue/90 hover:to-blue-600/90"
                        onClick={() => addToCart(product)}
                      >
                        <ShoppingCart className="h-4 w-4 ml-2" />
                        أضف للسلة
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* View All Button - Only show if there are products */}
        {products.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Button
              size="lg"
              variant="outline"
              className="border-brand-blue text-brand-blue hover:bg-brand-blue hover:text-white text-lg px-8"
              onClick={viewAllProducts}
            >
              عرض جميع المنتجات ({products.length})
            </Button>
          </motion.div>
        )}
      </div>
    </section>
  )
}