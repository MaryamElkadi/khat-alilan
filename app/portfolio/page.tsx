"use client"

import { motion } from "framer-motion"
import { useState } from "react"
import { Filter, ArrowLeft, ExternalLink, Play, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"
import Image from "next/image"

// Portfolio categories
const categories = [
  { id: "all", name: "جميع الأعمال" },
  { id: "graphic", name: "تصميم جرافيك" },
  { id: "web", name: "تصميم مواقع" },
  { id: "social", name: "وسائل التواصل" },
  { id: "branding", name: "هوية بصرية" },
]

// Portfolio items
const portfolioItems = [
  {
    id: 1,
    title: "هوية بصرية لمطعم لبناني",
    category: "branding",
    description: "تصميم هوية بصرية متكاملة لمطعم لبناني راقٍ يشمل الشعار، القائمة، والتغليف",
    image: "/api/placeholder/400/300",
    tags: ["شعار", "هوية بصرية", "تغليف"],
    featured: true,
  },
  {
    id: 2,
    title: "موقع إلكتروني لمؤسسة تعليمية",
    category: "web",
    description: "تصميم وتطوير موقع إلكتروني متكامل لمؤسسة تعليمية مع نظام إدارة المحتوى",
    image: "/api/placeholder/400/300",
    tags: ["ويب", "تعليم", "متجاوب"],
    featured: true,
  },
  {
    id: 3,
    title: "حملة إعلانية على إنستغرام",
    category: "social",
    description: "تصميم وإدارة حملة إعلانية متكاملة على منصات التواصل الاجتماعي لماركة أزياء",
    image: "/api/placeholder/400/300",
    tags: ["وسائل تواصل", "إعلانات", "أزياء"],
  },
  {
    id: 4,
    title: "تصميم غلاف كتاب",
    category: "graphic",
    description: "تصميم غلاف كتاب مبتكر لرواية عربية معاصرة",
    image: "/api/placeholder/400/300",
    tags: ["تصميم", "كتب", "أدب"],
  },
  {
    id: 5,
    title: "هوية بصرية لمقهى",
    category: "branding",
    description: "تصميم هوية بصرية شاملة لمقهى عصري مع التركيز على التغليف والمنتجات",
    image: "/api/placeholder/400/300",
    tags: ["مقهى", "تغليف", "هوية"],
  },
  {
    id: 6,
    title: "تطبيق جوال لخدمة التوصيل",
    category: "web",
    description: "تصميم واجهة مستخدم لتطبيق جوال يقدم خدمات التوصيل السريع",
    image: "/api/placeholder/400/300",
    tags: ["جوال", "توصيل", "واجهة"],
    featured: true,
  },
  {
    id: 7,
    title: "حملة توعوية للصحة",
    category: "social",
    description: "تصميم مواد توعوية لحملة صحية على منصات التواصل الاجتماعي",
    image: "/api/placeholder/400/300",
    tags: ["توعية", "صحة", "وسائل تواصل"],
  },
  {
    id: 8,
    title: "بروشور دعائي لفندق",
    category: "graphic",
    description: "تصميم بروشور دعائي متكامل لفندق فاخر يشمل الصور والمعلومات",
    image: "/api/placeholder/400/300",
    tags: ["بروشور", "فندق", "دعاية"],
  },
  {
    id: 9,
    title: "تجربة مستخدم لمنصة تعليمية",
    category: "web",
    description: "إعادة تصميم تجربة المستخدم لمنصة تعليمية لتحسين التفاعل والاستخدام",
    image: "/api/placeholder/400/300",
    tags: ["UX/UI", "تعليم", "منصة"],
  },
]

export default function PortfolioPage() {
  const router = useRouter()
  const [activeCategory, setActiveCategory] = useState("all")
  const [showFilters, setShowFilters] = useState(false)

  const filteredItems = activeCategory === "all" 
    ? portfolioItems 
    : portfolioItems.filter(item => item.category === activeCategory)

  return (
    <div className="min-h-screen bg-background pt-20">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <Button 
            variant="ghost" 
            className="mb-8"
            onClick={() => router.back()}
          >
            <ArrowLeft className="ml-2 h-4 w-4" />
            العودة
          </Button>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="text-brand-yellow">معرض</span>{" "}
            <span className="text-brand-blue">أعمالنا</span>
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            اكتشف مجموعة من أحدث مشاريعنا الإبداعية في عالم التصميم والإعلان
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-12"
        >
          <div className="flex flex-col items-center">
            <Button
              variant="outline"
              className="md:hidden mb-4"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="ml-2 h-4 w-4" />
              التصنيفات
              <ChevronDown className={`mr-2 h-4 w-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </Button>

            <div className={`flex flex-wrap justify-center gap-3 ${showFilters ? 'flex' : 'hidden md:flex'}`}>
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant={activeCategory === category.id ? "default" : "outline"}
                  className={`rounded-full px-6 ${
                    activeCategory === category.id 
                      ? 'bg-brand-yellow text-black hover:bg-brand-yellow/90' 
                      : 'bg-transparent'
                  }`}
                  onClick={() => {
                    setActiveCategory(category.id)
                    setShowFilters(false)
                  }}
                >
                  {category.name}
                </Button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Portfolio Grid */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="group relative"
            >
              <Card className="h-full overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="relative overflow-hidden">
                  <div className="h-48 relative bg-muted">
                    <Image
                      src={item.image || "/api/placeholder/400/300"}
                      alt={item.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <div className="flex gap-2">
                        <Button size="sm" className="rounded-full">
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                        <Button size="sm" className="rounded-full">
                          <Play className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  {item.featured && (
                    <Badge className="absolute top-3 left-3 bg-brand-blue">
                      متميز
                    </Badge>
                  )}
                </div>
                
                <CardContent className="p-5">
                  <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                  <p className="text-muted-foreground text-sm mb-4">{item.description}</p>
                  
                  <div className="flex flex-wrap gap-2">
                    {item.tags.map((tag) => (
                      <Badge 
                        key={tag} 
                        variant="secondary" 
                        className="text-xs"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="text-center mt-20 p-8 rounded-2xl bg-gradient-to-r from-brand-blue/10 to-brand-yellow/10"
        >
          <h2 className="text-3xl font-bold mb-4">مستعد لبدء مشروعك القادم؟</h2>
          <p className="text-muted-foreground mb-6">
            تواصل معنا اليوم لمناقشة فكرتك وسنعمل معاً لتحويلها إلى واقع ملموس
          </p>
          <Button 
            size="lg" 
            className="bg-brand-yellow text-black hover:bg-brand-yellow/90"
            onClick={() => router.push("/contact")}
          >
            تواصل معنا الآن
          </Button>
        </motion.div>
      </div>
    </div>
  )
}