"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Palette, Globe, Camera, Megaphone, PenTool, Monitor, Star, Clock } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { useSearchParams } from "next/navigation"

const services = [
  {
    id: "graphic-design",
    title: "تصميم جرافيك",
    description: "تصاميم إبداعية ومتميزة للهوية البصرية والمواد الإعلانية",
    icon: Palette,
    price: "من 1,500 ر.س",
    duration: "5-7 أيام",
    rating: 4.9,
    features: ["تصميم الشعار", "دليل الهوية", "بطاقات العمل", "ورق رسمي"],
  },
  {
    id: "web-design",
    title: "تصميم مواقع ويب",
    description: "مواقع ويب حديثة ومتجاوبة مع جميع الأجهزة",
    icon: Globe,
    price: "من 3,000 ر.س",
    duration: "10-14 يوم",
    rating: 4.8,
    features: ["تصميم متجاوب", "لوحة تحكم", "تحسين محركات البحث", "استضافة مجانية"],
  },
  {
    id: "social-media",
    title: "إعلانات وسائل التواصل",
    description: "حملات إعلانية مؤثرة على منصات التواصل الاجتماعي",
    icon: Megaphone,
    price: "من 2,000 ر.س/شهر",
    duration: "مستمر",
    rating: 4.7,
    features: ["إنشاء المحتوى", "جدولة المنشورات", "تفاعل مع الجمهور", "تقارير شهرية"],
  },
  {
    id: "printing",
    title: "طباعة ونشر",
    description: "خدمات طباعة عالية الجودة للمواد الإعلانية والتسويقية",
    icon: Monitor, // Changed from Printer to Monitor for consistency
    price: "من 800 ر.س",
    duration: "1-3 أيام",
    rating: 4.9,
    features: ["تصوير المنتجات", "تصوير الفعاليات", "معالجة الصور", "تسليم سريع"],
  },
  {
    id: "photography",
    title: "التصوير الفوتوغرافي",
    description: "تصوير احترافي للمنتجات والفعاليات والبورتريه",
    icon: Camera,
    price: "من 800 ر.س",
    duration: "1-3 أيام",
    rating: 4.9,
    features: ["تصوير المنتجات", "تصوير الفعاليات", "معالجة الصور", "تسليم سريع"],
  },
  {
    id: "digital-marketing",
    title: "التسويق الرقمي",
    description: "استراتيجيات تسويقية شاملة لزيادة المبيعات والوصول",
    icon: PenTool, // Changed from BarChart3 to PenTool for consistency
    price: "من 2,500 ر.س",
    duration: "7-10 أيام",
    rating: 4.9,
    features: ["تصميم UX/UI", "نماذج أولية", "اختبار المستخدم", "دليل التصميم"],
  },
]

export default function ServicesPage() {
  const searchParams = useSearchParams()
  const [activeService, setActiveService] = useState<string | null>(null)
  const serviceRefs = useRef<{[key: string]: HTMLDivElement | null}>({})

  useEffect(() => {
    // Check if there's a hash in the URL when the component mounts
    const hash = window.location.hash.substring(1)
    if (hash && services.some(service => service.id === hash)) {
      setActiveService(hash)
      
      // Scroll to the service after a short delay to allow the page to render
      setTimeout(() => {
        const element = serviceRefs.current[hash]
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' })
          
          // Add a highlight effect
          element.classList.add('ring-2', 'ring-brand-yellow', 'shadow-lg')
          setTimeout(() => {
            element.classList.remove('ring-2', 'ring-brand-yellow', 'shadow-lg')
          }, 2000)
        }
      }, 100)
    }
  }, [searchParams])

  return (
    <div className="min-h-screen bg-background pt-20">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="text-brand-yellow">خدماتنا</span> <span className="text-brand-blue">المتميزة</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            نقدم مجموعة شاملة من الخدمات الإعلانية والتسويقية لتلبية جميع احتياجات عملك
          </p>
        </motion.div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={service.id}
              ref={el => serviceRefs.current[service.id] = el}
              id={service.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="transition-all duration-300 rounded-lg"
            >
              <Card className="h-full hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 rounded-lg bg-brand-yellow/10">
                      <service.icon className="h-6 w-6 text-brand-yellow" />
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium">{service.rating}</span>
                    </div>
                  </div>
                  <CardTitle className="text-xl mb-2">{service.title}</CardTitle>
                  <p className="text-muted-foreground text-sm">{service.description}</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary" className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {service.duration}
                    </Badge>
                    <span className="font-bold text-brand-blue">{service.price}</span>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm">يشمل:</h4>
                    <ul className="space-y-1">
                      {service.features.map((feature, idx) => (
                        <li key={idx} className="text-sm text-muted-foreground flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-brand-yellow" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Button className="w-full bg-brand-yellow text-black hover:bg-brand-yellow/90">طلب الخدمة</Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="text-center mt-16 p-8 rounded-2xl bg-gradient-to-r from-brand-blue/10 to-brand-yellow/10"
        >
          <h2 className="text-3xl font-bold mb-4">لم تجد الخدمة التي تبحث عنها؟</h2>
          <p className="text-muted-foreground mb-6">تواصل معنا لمناقشة احتياجاتك الخاصة وسنقوم بتقديم حلول مخصصة لك</p>
          <Button size="lg" className="bg-brand-yellow text-black hover:bg-brand-yellow/90">
            تواصل معنا الآن
          </Button>
        </motion.div>
      </div>
    </div>
  )
}