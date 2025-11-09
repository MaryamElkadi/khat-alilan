"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"
import { Palette, Globe, Megaphone, Printer, Camera, BarChart3, Star, Clock, DollarSign } from "lucide-react"

interface Service {
  _id: string
  title: string
  description: string
  icon: string
  price?: string
  duration?: string
  rating?: number
  reviewCount?: number
  features?: string
  isFeatured?: boolean
}

const iconMap: Record<string, any> = {
  "Palette": Palette,
  "Globe": Globe,
  "Megaphone": Megaphone,
  "Printer": Printer,
  "Camera": Camera,
  "BarChart3": BarChart3,
}

export function FeaturedServices() {
  const router = useRouter()
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [sortBy, setSortBy] = useState<"rating" | "price" | "featured">("rating")

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await fetch("/api/services")
        if (!res.ok) throw new Error("Failed to fetch services")
        const data = await res.json()
        setServices(data)
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }

    fetchServices()
  }, [])

  // ترتيب الخدمات حسب التقييم أو السعر أو المميز
  const sortedServices = [...services].sort((a, b) => {
    switch (sortBy) {
      case "rating":
        return (b.rating || 0) - (a.rating || 0)
      case "price":
        const priceA = parseInt(a.price?.replace(/[^0-9]/g, '') || "0")
        const priceB = parseInt(b.price?.replace(/[^0-9]/g, '') || "0")
        return priceA - priceB
      case "featured":
        if (a.isFeatured && !b.isFeatured) return -1
        if (!a.isFeatured && b.isFeatured) return 1
        return (b.rating || 0) - (a.rating || 0)
      default:
        return 0
    }
  })

  // أخذ أول 6 خدمات فقط
  const displayedServices = sortedServices.slice(0, 6)

  const handleServiceDetails = (serviceId: string) => {
    // الانتقال إلى صفحة تفاصيل الخدمة
    router.push(`/services/${serviceId}`)
  }

  const handleOrderService = (serviceId: string) => {
    // الانتقال إلى صفحة طلب الخدمة
    router.push(`/request-service?id=${serviceId}`)
  }

  if (loading) return (
    <div className="text-center py-20">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-blue mx-auto"></div>
      <p className="mt-4 text-muted-foreground">جاري تحميل الخدمات...</p>
    </div>
  )

  if (!services.length) return (
    <div className="text-center py-20">
      <Palette className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
      <h3 className="text-lg font-medium mb-2">لا توجد خدمات حالياً</h3>
      <p className="text-muted-foreground">سنضيف خدمات قريباً</p>
    </div>
  )

  return (
    <section className="bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <Badge variant="secondary" className="mb-4 text-sm font-medium">
            الأكثر طلباً
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-brand-yellow">خدماتنا</span>{" "}
            <span className="text-brand-blue">المتميزة</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed mb-8">
            اكتشف مجموعة خدماتنا المصممة خصيصاً لنجاحك
          </p>

          {/* أزرار التصفية والترتيب */}
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            <Button
              variant={sortBy === "rating" ? "default" : "outline"}
              size="sm"
              onClick={() => setSortBy("rating")}
              className="flex items-center gap-2"
            >
              <Star className="h-4 w-4" />
              الأعلى تقييماً
            </Button>
            <Button
              variant={sortBy === "price" ? "default" : "outline"}
              size="sm"
              onClick={() => setSortBy("price")}
              className="flex items-center gap-2"
            >
              <DollarSign className="h-4 w-4" />
              السعر
            </Button>
            <Button
              variant={sortBy === "featured" ? "default" : "outline"}
              size="sm"
              onClick={() => setSortBy("featured")}
              className="flex items-center gap-2"
            >
              <Star className="h-4 w-4" />
              المميز
            </Button>
          </div>

          {/* إحصائيات الخدمات المعروضة */}
          <div className="text-sm text-muted-foreground mb-4">
            عرض {displayedServices.length} من أصل {services.length} خدمة
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedServices.map((service, index) => {
            const Icon = iconMap[service.icon] || Palette
            return (
              <motion.div
                key={service._id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -8 }}
                className="h-full"
              >
                <Card className="h-full border-0 shadow-lg hover:shadow-2xl transition-all duration-300 bg-card backdrop-blur-sm relative overflow-hidden group">
                  {/* شارة الخدمة المميزة */}
                  {service.isFeatured && (
                    <div className="absolute top-4 left-4 z-10">
                      <Badge className="bg-gradient-to-r from-brand-yellow to-orange-500 text-white border-0">
                        مميز
                      </Badge>
                    </div>
                  )}

                  {/* شارة التقييم */}
                  {service.rating && (
                    <div className="absolute top-4 right-4 z-10">
                      <Badge variant="secondary" className="flex items-center gap-1">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        {service.rating}
                        {service.reviewCount && (
                          <span className="text-xs text-muted-foreground">
                            ({service.reviewCount})
                          </span>
                        )}
                      </Badge>
                    </div>
                  )}

                  <CardHeader className="text-center pb-4 pt-8">
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-brand-blue/10 to-brand-yellow/10 flex items-center justify-center mb-4 group-hover:from-brand-blue/20 group-hover:to-brand-yellow/20 transition-all duration-300"
                    >
                      <Icon className="h-10 w-10 text-brand-blue" />
                    </motion.div>
                    <CardTitle className="text-xl font-bold text-foreground">
                      {service.title}
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="text-center flex flex-col h-full">
                    <CardDescription className="text-muted-foreground mb-4 leading-relaxed flex-grow">
                      {service.description}
                    </CardDescription>

                    {/* معلومات السعر والمدة */}
                    <div className="flex justify-between items-center mb-4 text-sm text-muted-foreground">
                      {service.price && (
                        <div className="flex items-center gap-1">
                          <DollarSign className="h-4 w-4 text-green-600" />
                          <span className="font-medium">{service.price}</span>
                        </div>
                      )}
                      {service.duration && (
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4 text-blue-600" />
                          <span>{service.duration}</span>
                        </div>
                      )}
                    </div>

                    {/* أزرار الإجراءات */}
                    <div className="flex gap-2 mt-auto">
                      <Button
                        variant="outline"
                        className="flex-1 border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                        onClick={() => router.push("/services")}
                      >
                        التفاصيل
                      </Button>
                      <Button
                        className="flex-1 bg-gradient-to-r from-brand-blue to-blue-600 hover:from-brand-blue/90 hover:to-blue-600/90"
                        onClick={() => handleOrderService(service._id)}
                      >
                        طلب الآن
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </div>

        {/* زر عرض المزيد - يظهر فقط إذا كان هناك أكثر من 6 خدمات */}
        {services.length > 6 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Button
              size="lg"
              variant="outline"
              className="border-brand-blue text-brand-blue hover:bg-brand-blue hover:text-white text-lg px-8"
              onClick={() => router.push("/services")}
            >
              عرض جميع الخدمات ({services.length})
            </Button>
          </motion.div>
        )}
      </div>
    </section>
  )
}