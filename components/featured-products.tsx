"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { ShoppingCart, Star, Eye, Sparkles } from "lucide-react"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useCart } from "@/lib/cart-context"
import { useScrollAnimation, fadeInUp, staggerContainer } from "@/lib/scroll-animations"
import { useRouter } from "next/navigation"
import type { Product } from "@/lib/types"

export function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const { addItem } = useCart()
  const { ref, controls } = useScrollAnimation()
  const router = useRouter()

  // ✅ Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("/api/products")
        if (!res.ok) throw new Error("Failed to fetch products")
        const data = await res.json()
        setProducts(data) // all products
      } catch (error) {
        console.error("Error fetching products:", error)
      }
    }
    fetchProducts()
  }, [])

  const addToCart = (product: Product) => addItem(product)
  const viewProductDetails = (productId: string) => router.push(`/products/${productId}`)
  const viewAllProducts = () => router.push("/products")

  return (
    <section className="py-20" ref={ref}>
      <div className="container mx-auto px-4">
        {/* Heading */}
        <motion.div animate={controls} initial="hidden" variants={fadeInUp} className="text-center mb-16 relative">
          <motion.div
            animate={{ rotate: [0, 360], scale: [1, 1.2, 1] }}
            transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY }}
            className="absolute -top-4 right-1/2 transform translate-x-1/2"
          >
            <Sparkles className="h-6 w-6 text-brand-yellow" />
          </motion.div>

          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <motion.span
              animate={{ textShadow: ["0 0 0px #1E40AF", "0 0 15px #1E40AF", "0 0 0px #1E40AF"] }}
              transition={{ duration: 2.5, repeat: Number.POSITIVE_INFINITY }}
              className="text-brand-blue"
            >
              جميع
            </motion.span>{" "}
            <motion.span
              animate={{ textShadow: ["0 0 0px #FFD700", "0 0 15px #FFD700", "0 0 0px #FFD700"] }}
              transition={{ duration: 2.5, repeat: Number.POSITIVE_INFINITY, delay: 1.25 }}
              className="text-brand-yellow"
            >
              المنتجات
            </motion.span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            جميع خدماتنا وباقاتنا الإعلانية متاحة لنجاح مشروعك
          </p>
        </motion.div>

        {/* Products Grid */}
        <motion.div
          animate={controls}
          initial="hidden"
          variants={staggerContainer}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {products.map((product) => (
            <motion.div
              key={product.id}
              variants={fadeInUp}
              whileHover={{
                y: -10,
                rotateY: 5,
                boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
              }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Card className="h-full overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 group relative">
                {/* Animated Gradient Border */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-brand-yellow via-brand-blue to-brand-yellow opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
                  transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
                  style={{ backgroundSize: "200% 200%" }}
                />

                <div className="relative bg-background m-0.5 rounded-lg overflow-hidden h-full">
                  <CardHeader className="p-0 relative">
                    <div className="relative overflow-hidden">
                     <img
  src={product.image?.[0] || "/placeholder.svg"}
  alt={product.title}
  className="w-full h-64 object-cover rounded"
/>

                      <motion.div
                        initial={{ opacity: 0 }}
                        whileHover={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                        className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"
                      />
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileHover={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.1 }}
                        className="absolute inset-0 flex items-center justify-center"
                      >
                        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                          <Button
                            size="sm"
                            className="bg-brand-yellow text-black hover:bg-brand-yellow/90 shadow-lg"
                            onClick={() => viewProductDetails(product._id)}
                          >
                            <Eye className="h-4 w-4 ml-2" />
                            عرض التفاصيل
                          </Button>
                        </motion.div>
                      </motion.div>
                    </div>
                  </CardHeader>

                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="outline" className="text-xs border-brand-blue text-brand-blue">
                        {product.category}
                      </Badge>
                      <motion.div className="flex items-center" whileHover={{ scale: 1.1 }}>
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="h-3 w-3 fill-brand-yellow text-brand-yellow" />
                        ))}
                      </motion.div>
                    </div>

                    <h3 className="font-bold text-lg mb-2 text-foreground leading-tight">{product.title}</h3>
                    <p className="text-muted-foreground text-sm mb-4 leading-relaxed">{product.description}</p>

                    <div className="flex items-center justify-between">
                      <motion.div
                        className="text-2xl font-bold text-brand-yellow"
                        animate={{ scale: [1, 1.05, 1] }}
                        transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                      >
                        {product.price.toLocaleString()} ر.س
                      </motion.div>
                      <div className="text-xs text-muted-foreground">يبدأ من</div>
                    </div>
                  </CardContent>

                  <CardFooter className="p-6 pt-0">
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full">
                      <Button
                        onClick={() => addToCart(product)}
                        className="w-full bg-brand-blue hover:bg-brand-blue/90 text-white relative overflow-hidden group"
                      >
                        <ShoppingCart className="h-4 w-4 ml-2" />
                        أضف إلى السلة
                      </Button>
                    </motion.div>
                  </CardFooter>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* View All Button */}
        <motion.div animate={controls} initial="hidden" variants={fadeInUp} className="text-center mt-12">
          <Button
            variant="outline"
            size="lg"
            className="border-2 border-brand-blue text-brand-blue hover:bg-brand-blue hover:text-white px-8 py-6 text-lg bg-transparent"
            onClick={viewAllProducts}
          >
            عرض جميع المنتجات
          </Button>
        </motion.div>
      </div>
    </section>
  )
}
