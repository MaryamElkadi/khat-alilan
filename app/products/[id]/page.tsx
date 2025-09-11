"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { ShoppingCart, Star, Share2, Heart, Check, Package, Clock, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { useCart } from "@/lib/cart-context"
import { useRouter } from "next/navigation"
import type { Product } from "@/lib/types"

// Mock product data - in real app, this would come from API/database
const products: Record<string, Product> = {
  "logo-design-package": {
    id: "logo-design-package",
    title: "باقة تصميم الشعار الاحترافية",
    description:
      "تصميم شعار احترافي مع دليل الهوية البصرية الكامل يتضمن جميع الملفات المطلوبة للطباعة والاستخدام الرقمي",
    price: 1500,
    image: "/professional-logo-design-package.jpg",
    category: "تصميم جرافيك",
    featured: true,
  },
  "social-media-campaign": {
    id: "social-media-campaign",
    title: "حملة إعلانية شاملة",
    description: "حملة إعلانية متكاملة على وسائل التواصل الاجتماعي لمدة شهر كامل مع إدارة المحتوى والتفاعل",
    price: 2500,
    image: "/social-media-advertising.png",
    category: "إعلانات وسائل التواصل",
    featured: true,
  },
  "website-design": {
    id: "website-design",
    title: "تصميم موقع ويب متجاوب",
    description: "موقع ويب حديث ومتجاوب مع لوحة تحكم إدارية وتحسين محركات البحث",
    price: 5000,
    image: "/responsive-website-design.png",
    category: "تصميم مواقع ويب",
    featured: true,
  },
  "branding-package": {
    id: "branding-package",
    title: "باقة الهوية التجارية الكاملة",
    description: "هوية تجارية شاملة تتضمن الشعار والألوان والخطوط ودليل الاستخدام",
    price: 3500,
    image: "/complete-branding-package.jpg",
    category: "تصميم جرافيك",
    featured: false,
  },
  "print-materials": {
    id: "print-materials",
    title: "مواد طباعية متنوعة",
    description: "تصميم وطباعة البروشورات والكتالوجات والبطاقات بجودة عالية",
    price: 800,
    image: "/print-materials-brochures-catalogs.jpg",
    category: "طباعة ونشر",
    featured: false,
  },
  "photography-session": {
    id: "photography-session",
    title: "جلسة تصوير احترافية",
    description: "جلسة تصوير احترافية للمنتجات أو البورتريه مع التحرير والمعالجة",
    price: 1200,
    image: "/professional-photo-session.png",
    category: "التصوير الفوتوغرافي",
    featured: true,
  },
}

const features = [
  {
    icon: Package,
    title: "تسليم سريع",
    description: "تسليم المشروع خلال 3-7 أيام عمل",
  },
  {
    icon: Shield,
    title: "ضمان الجودة",
    description: "ضمان الجودة مع إمكانية التعديل",
  },
  {
    icon: Clock,
    title: "دعم مستمر",
    description: "دعم فني مجاني لمدة 30 يوم",
  },
]

export default function ProductDetails({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { addItem } = useCart()
  const [selectedImage, setSelectedImage] = useState(0)
  const [isLiked, setIsLiked] = useState(false)

  const product = products[params.id]

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">المنتج غير موجود</h1>
          <Button onClick={() => router.push("/")}>العودة للرئيسية</Button>
        </div>
      </div>
    )
  }

  const handleAddToCart = () => {
    addItem(product)
  }

  const productImages = [
    product.image || "/placeholder.svg",
    "/product-gallery-2.jpg",
    "/product-gallery-3.jpg",
  ]

  return (
    <div className="min-h-screen bg-background">
    

      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 text-sm text-muted-foreground mb-8"
        >
          <button onClick={() => router.push("/")} className="hover:text-foreground">
            الرئيسية
          </button>
          <span>/</span>
          <button onClick={() => router.push("/products")} className="hover:text-foreground">
            المنتجات
          </button>
          <span>/</span>
          <span className="text-foreground">{product.title}</span>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
            <div className="space-y-4">
              <div className="aspect-square overflow-hidden rounded-lg bg-muted">
                <img
                  src={productImages[selectedImage] || "/placeholder.svg"}
                  alt={product.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                {productImages.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-square overflow-hidden rounded-lg border-2 transition-colors ${
                      selectedImage === index ? "border-brand-blue" : "border-transparent"
                    }`}
                  >
                    <img
                      src={image || "/placeholder.svg"}
                      alt={`${product.title} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-6"
          >
            <div>
              <Badge className="mb-4 bg-brand-yellow text-black">{product.category}</Badge>

              <h1 className="text-3xl font-bold text-foreground mb-4 leading-tight">{product.title}</h1>

              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-brand-yellow text-brand-yellow" />
                  ))}
                </div>
                <span className="text-muted-foreground">(4.9) • 127 تقييم</span>
              </div>

              <p className="text-muted-foreground text-lg leading-relaxed">{product.description}</p>
            </div>

            <div className="border-t border-b py-6">
              <div className="text-4xl font-bold text-brand-yellow mb-2">{product.price.toLocaleString()} ر.س</div>
              <p className="text-muted-foreground">شامل ضريبة القيمة المضافة</p>
            </div>

            <div className="space-y-4">
              <div className="flex gap-4">
                <Button
                  onClick={handleAddToCart}
                  className="flex-1 bg-brand-blue hover:bg-brand-blue/90 text-white h-12"
                >
                  <ShoppingCart className="h-5 w-5 ml-2" />
                  أضف إلى السلة
                </Button>

                <Button
                  variant="outline"
                  size="icon"
                  className="h-12 w-12 bg-transparent"
                  onClick={() => setIsLiked(!isLiked)}
                >
                  <Heart className={`h-5 w-5 ${isLiked ? "fill-red-500 text-red-500" : ""}`} />
                </Button>

                <Button variant="outline" size="icon" className="h-12 w-12 bg-transparent">
                  <Share2 className="h-5 w-5" />
                </Button>
              </div>

              <Button variant="outline" className="w-full h-12 bg-transparent">
                طلب استشارة مجانية
              </Button>
            </div>

            {/* Features */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">مميزات الخدمة</h3>
              <div className="space-y-3">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="p-2 bg-brand-blue/10 rounded-lg">
                      <feature.icon className="h-5 w-5 text-brand-blue" />
                    </div>
                    <div>
                      <h4 className="font-medium">{feature.title}</h4>
                      <p className="text-sm text-muted-foreground">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Additional Details */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold text-lg mb-4">تفاصيل الخدمة</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  <span>تصميم احترافي وفريد</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  <span>ملفات عالية الجودة</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  <span>تعديلات مجانية</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  <span>دعم فني مستمر</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold text-lg mb-4">معلومات التسليم</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">مدة التنفيذ:</span>
                  <span>3-7 أيام عمل</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">التعديلات:</span>
                  <span>3 تعديلات مجانية</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">صيغ الملفات:</span>
                  <span>AI, PNG, JPG, PDF</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">الدعم:</span>
                  <span>30 يوم مجاني</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <Footer />
    </div>
  )
}
