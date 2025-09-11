"use client"

import { motion } from "framer-motion"
import { ShoppingCart, Star, Eye, Sparkles } from "lucide-react"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useCart } from "@/lib/cart-context"
import { useScrollAnimation, fadeInUp, staggerContainer } from "@/lib/scroll-animations"
import { useRouter } from "next/navigation"
import type { Product } from "@/lib/types"

const featuredProducts: Product[] = [
  {
    id: "logo-design-package",
    title: "باقة تصميم الشعار الاحترافية",
    description: "تصميم شعار احترافي مع دليل الهوية البصرية الكامل",
    price: 1500,
    image: "/professional-logo-design-package.jpg",
    category: "تصميم جرافيك",
    featured: true,
  },
  {
    id: "social-media-campaign",
    title: "حملة إعلانية شاملة",
    description: "حملة إعلانية متكاملة على وسائل التواصل الاجتماعي لمدة شهر",
    price: 2500,
    image: "/social-media-advertising.png",
    category: "إعلانات وسائل التواصل",
    featured: true,
  },
  {
    id: "website-design",
    title: "تصميم موقع ويب متجاوب",
    description: "موقع ويب حديث ومتجاوب مع لوحة تحكم إدارية",
    price: 5000,
    image: "/responsive-website-design.png",
    category: "تصميم مواقع ويب",
    featured: true,
  },
  {
    id: "branding-package",
    title: "باقة الهوية التجارية الكاملة",
    description: "هوية تجارية شاملة تتضمن الشعار والألوان والخطوط",
    price: 3500,
    image: "/complete-branding-package.jpg",
    category: "تصميم جرافيك",
    featured: true,
  },
  {
    id: "print-materials",
    title: "مواد طباعية متنوعة",
    description: "تصميم وطباعة البروشورات والكتالوجات والبطاقات",
    price: 800,
    image: "/print-materials-brochures-catalogs.jpg",
    category: "طباعة ونشر",
    featured: true,
  },
  {
    id: "photography-session",
    title: "جلسة تصوير احترافية",
    description: "جلسة تصوير احترافية للمنتجات أو البورتريه",
    price: 1200,
    image: "/professional-photo-session.png",
    category: "التصوير الفوتوغرافي",
    featured: true,
  },
]

export function FeaturedProducts() {
  const { addItem } = useCart()
  const { ref, controls } = useScrollAnimation()
  const router = useRouter()

  const addToCart = (product: Product) => {
    addItem(product)
  }

  const viewProductDetails = (productId: string) => {
    router.push(`/products/${productId}`)
  }

  const viewAllProducts = () => {
    router.push("/products")
  }

  return (
    <section className="py-20" ref={ref}>
      <div className="container mx-auto px-4">
        <motion.div animate={controls} initial="hidden" variants={fadeInUp} className="text-center mb-16 relative">
          <motion.div
            animate={{
              rotate: [0, 360],
              scale: [1, 1.2, 1],
            }}
            transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY }}
            className="absolute -top-4 right-1/2 transform translate-x-1/2"
          >
            <Sparkles className="h-6 w-6 text-brand-yellow" />
          </motion.div>

          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <motion.span
              animate={{
                textShadow: ["0 0 0px #1E40AF", "0 0 15px #1E40AF", "0 0 0px #1E40AF"],
              }}
              transition={{ duration: 2.5, repeat: Number.POSITIVE_INFINITY }}
              className="text-brand-blue"
            >
              منتجاتنا
            </motion.span>{" "}
            <motion.span
              animate={{
                textShadow: ["0 0 0px #FFD700", "0 0 15px #FFD700", "0 0 0px #FFD700"],
              }}
              transition={{ duration: 2.5, repeat: Number.POSITIVE_INFINITY, delay: 1.25 }}
              className="text-brand-yellow"
            >
              المميزة
            </motion.span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            اكتشف باقاتنا المتنوعة من الخدمات الإعلانية والتسويقية المصممة خصيصاً لنجاح مشروعك
          </p>
        </motion.div>

        <motion.div
          animate={controls}
          initial="hidden"
          variants={staggerContainer}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {featuredProducts.map((product, index) => (
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
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-brand-yellow via-brand-blue to-brand-yellow opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
                  transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
                  style={{ backgroundSize: "200% 200%" }}
                />
                <div className="relative bg-background m-0.5 rounded-lg overflow-hidden h-full">
                  <CardHeader className="p-0 relative">
                    <div className="relative overflow-hidden">
                      <motion.img
                        src={product.image || "/placeholder.svg"}
                        alt={product.title}
                        className="w-full h-48 object-cover"
                        whileHover={{ scale: 1.1 }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
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
                            onClick={() => viewProductDetails(product.id)}
                          >
                            <Eye className="h-4 w-4 ml-2" />
                            عرض التفاصيل
                          </Button>
                        </motion.div>
                      </motion.div>
                    </div>

                    <motion.div
                      animate={{
                        scale: [1, 1.1, 1],
                        rotate: [0, 5, -5, 0],
                      }}
                      transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                      className="absolute top-4 right-4"
                    >
                      <Badge className="bg-brand-yellow text-black shadow-lg">
                        <Sparkles className="h-3 w-3 ml-1" />
                        مميز
                      </Badge>
                    </motion.div>
                  </CardHeader>

                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="outline" className="text-xs border-brand-blue text-brand-blue">
                        {product.category}
                      </Badge>
                      <motion.div className="flex items-center" whileHover={{ scale: 1.1 }}>
                        {[...Array(5)].map((_, i) => (
                          <motion.div
                            key={i}
                            animate={{
                              scale: [1, 1.2, 1],
                              rotate: [0, 360, 0],
                            }}
                            transition={{
                              duration: 2,
                              repeat: Number.POSITIVE_INFINITY,
                              delay: i * 0.1,
                            }}
                          >
                            <Star className="h-3 w-3 fill-brand-yellow text-brand-yellow" />
                          </motion.div>
                        ))}
                      </motion.div>
                    </div>

                    <h3 className="font-bold text-lg mb-2 text-foreground leading-tight">{product.title}</h3>

                    <p className="text-muted-foreground text-sm mb-4 leading-relaxed">{product.description}</p>

                    <div className="flex items-center justify-between">
                      <motion.div
                        className="text-2xl font-bold text-brand-yellow"
                        animate={{
                          scale: [1, 1.05, 1],
                        }}
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
                        <motion.div
                          className="absolute inset-0 bg-brand-blue"
                          initial={{ x: "-100%" }}
                          whileHover={{ x: "0%" }}
                          transition={{ duration: 0.3 }}
                        />
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

        <motion.div animate={controls} initial="hidden" variants={fadeInUp} className="text-center mt-12">
          <motion.div
            whileHover={{
              scale: 1.05,
              boxShadow: "0 10px 30px rgba(30, 64, 175, 0.3)",
            }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              variant="outline"
              size="lg"
              className="border-2 border-brand-blue text-brand-blue hover:bg-brand-blue hover:text-white px-8 py-6 text-lg bg-transparent relative overflow-hidden group"
              onClick={viewAllProducts}
            >
              <motion.div
                className="absolute inset-0 bg-brand-blue"
                initial={{ x: "-100%" }}
                whileHover={{ x: "0%" }}
                transition={{ duration: 0.3 }}
              />
              <span className="relative z-10">عرض جميع المنتجات</span>
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
