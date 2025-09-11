"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Search, Grid, List } from "lucide-react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { useCart } from "@/lib/cart-context"
import type { Product } from "@/lib/types"

const allProducts: Product[] = [
  {
    id: "logo-design-basic",
    title: "تصميم شعار أساسي",
    description: "تصميم شعار بسيط وأنيق مع 3 مفاهيم أولية",
    price: 500,
    image: "/basic-logo-design.jpg",
    category: "تصميم جرافيك",
    featured: false,
  },
  {
    id: "logo-design-premium",
    title: "تصميم شعار متقدم",
    description: "تصميم شعار احترافي مع دليل الهوية البصرية",
    price: 1500,
    image: "/premium-logo-design.jpg",
    category: "تصميم جرافيك",
    featured: true,
  },
  {
    id: "website-landing",
    title: "صفحة هبوط احترافية",
    description: "تصميم وتطوير صفحة هبوط متجاوبة ومحسنة للتحويل",
    price: 2000,
    image: "/modern-landing-page.png",
    category: "تصميم مواقع ويب",
    featured: false,
  },
  {
    id: "social-media-basic",
    title: "إدارة وسائل التواصل الأساسية",
    description: "إدارة حسابات وسائل التواصل مع 15 منشور شهرياً",
    price: 800,
    image: "/social-media-management.jpg",
    category: "إعلانات وسائل التواصل",
    featured: false,
  },
  {
    id: "brochure-design",
    title: "تصميم بروشور تجاري",
    description: "تصميم بروشور احترافي ثلاثي الطي مع الطباعة",
    price: 300,
    image: "/business-brochure-design.jpg",
    category: "طباعة ونشر",
    featured: false,
  },
  {
    id: "product-photography",
    title: "تصوير منتجات احترافي",
    description: "جلسة تصوير احترافية لـ 20 منتج مع التعديل",
    price: 1200,
    image: "/product-photography-session.jpg",
    category: "التصوير الفوتوغرافي",
    featured: false,
  },
]

const categories = [
  "جميع الفئات",
  "تصميم جرافيك",
  "تصميم مواقع ويب",
  "إعلانات وسائل التواصل",
  "طباعة ونشر",
  "التصوير الفوتوغرافي",
]

export default function ProductsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("جميع الفئات")
  const [sortBy, setSortBy] = useState("الأحدث")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const { dispatch } = useCart()

  const filteredProducts = allProducts.filter((product) => {
    const matchesSearch =
      product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "جميع الفئات" || product.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "السعر: من الأقل للأعلى":
        return a.price - b.price
      case "السعر: من الأعلى للأقل":
        return b.price - a.price
      case "الاسم":
        return a.title.localeCompare(b.title, "ar")
      default:
        return 0
    }
  })

  const addToCart = (product: Product) => {
    dispatch({ type: "ADD_ITEM", payload: product })
  }

  return (
    <div className="min-h-screen bg-background">
   
      <main className="pt-8">
        {/* Header */}
        <section className="py-12 bg-muted/30">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                <span className="text-brand-yellow">منتجاتنا</span> <span className="text-brand-blue">وخدماتنا</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                اكتشف مجموعتنا الشاملة من الخدمات الإعلانية والتسويقية
              </p>
            </motion.div>
          </div>
        </section>

        {/* Filters */}
        <section className="py-8 border-b border-border">
          <div className="container mx-auto px-4">
            <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  type="search"
                  placeholder="ابحث عن المنتجات..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pr-10 text-right"
                />
              </div>

              {/* Filters */}
              <div className="flex items-center gap-4">
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="الأحدث">الأحدث</SelectItem>
                    <SelectItem value="السعر: من الأقل للأعلى">السعر: من الأقل للأعلى</SelectItem>
                    <SelectItem value="السعر: من الأعلى للأقل">السعر: من الأعلى للأقل</SelectItem>
                    <SelectItem value="الاسم">الاسم</SelectItem>
                  </SelectContent>
                </Select>

                {/* View Mode */}
                <div className="flex border border-border rounded-lg">
                  <Button
                    variant={viewMode === "grid" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("grid")}
                    className="rounded-l-none"
                  >
                    <Grid className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("list")}
                    className="rounded-r-none"
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Results Count */}
            <div className="mt-4 text-sm text-muted-foreground">
              عرض {sortedProducts.length} من أصل {allProducts.length} منتج
            </div>
          </div>
        </section>

        {/* Products Grid */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" : "space-y-6"}>
              {sortedProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className={viewMode === "list" ? "w-full" : ""}
                >
                  <Card
                    className={`h-full overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 group ${
                      viewMode === "list" ? "flex flex-row" : ""
                    }`}
                  >
                    <CardHeader className={`p-0 relative ${viewMode === "list" ? "w-1/3" : ""}`}>
                      <div className="relative overflow-hidden">
                        <img
                          src={product.image || "/placeholder.svg"}
                          alt={product.title}
                          className={`object-cover transition-transform duration-300 group-hover:scale-105 ${
                            viewMode === "list" ? "w-full h-full" : "w-full h-48"
                          }`}
                        />
                        {product.featured && (
                          <Badge className="absolute top-4 right-4 bg-primary text-primary-foreground">مميز</Badge>
                        )}
                      </div>
                    </CardHeader>

                    <div className={viewMode === "list" ? "flex-1 flex flex-col" : ""}>
                      <CardContent className={`p-6 ${viewMode === "list" ? "flex-1" : ""}`}>
                        <Badge variant="outline" className="mb-2 text-xs">
                          {product.category}
                        </Badge>

                        <h3 className="font-bold text-lg mb-2 text-foreground leading-tight">{product.title}</h3>

                        <p className="text-muted-foreground text-sm mb-4 leading-relaxed">{product.description}</p>

                        <div className="flex items-center justify-between">
                          <div className="text-2xl font-bold text-primary">{product.price.toLocaleString()} ر.س</div>
                        </div>
                      </CardContent>

                      <CardFooter className="p-6 pt-0">
                        <Button
                          onClick={() => addToCart(product)}
                          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                        >
                          أضف إلى السلة
                        </Button>
                      </CardFooter>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>

            {sortedProducts.length === 0 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
                <p className="text-muted-foreground text-lg">لم يتم العثور على منتجات تطابق البحث</p>
              </motion.div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
