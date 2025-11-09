"use client"

import { useState, useEffect, useRef } from "react"
import { useSearchParams } from "next/navigation"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Star, Clock, Palette, Globe, Camera, Megaphone, PenTool, Monitor, Brush, Scissors, Sparkles, Filter } from "lucide-react"
import { useRouter } from "next/navigation"

interface Service {
  _id: string
  title: string
  description: string
  icon: string
  price: number
  duration: string
  rating: number
  features: string[]
  reviewCount?: number
  isFeatured?: boolean
}

const iconMap: Record<string, React.ElementType> = {
  Palette, Globe, Camera, Megaphone, PenTool, Monitor, Brush, Scissors, Sparkles
}

export default function ServicesPage() {
  const searchParams = useSearchParams()
  const [services, setServices] = useState<Service[]>([])
  const [filteredServices, setFilteredServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [activeService, setActiveService] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState<"rating" | "price" | "featured" | "default">("rating")
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000])
  const serviceRefs = useRef<{[key: string]: HTMLDivElement | null}>({})
  const router = useRouter()

  // Fetch services from database
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await fetch("/api/services")
        if (!res.ok) throw new Error("Failed to fetch services")
        
        const data: Service[] = await res.json()

        // Ensure features is always an array
        const normalized = data.map(s => ({
          ...s,
          features: Array.isArray(s.features) ? s.features : [],
          reviewCount: s.reviewCount || 0,
          isFeatured: s.isFeatured || false
        }))

        setServices(normalized)
        setFilteredServices(normalized)
        
        // Calculate price range
        const prices = normalized.map(s => s.price)
        const minPrice = Math.min(...prices)
        const maxPrice = Math.max(...prices)
        setPriceRange([minPrice, maxPrice])
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }

    fetchServices()
  }, [])

  // Sort and filter services
  useEffect(() => {
    let sorted = [...services]

    // Apply sorting
    switch (sortBy) {
      case "rating":
        sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0))
        break
      case "price":
        sorted.sort((a, b) => a.price - b.price)
        break
      case "featured":
        sorted.sort((a, b) => {
          if (a.isFeatured && !b.isFeatured) return -1
          if (!a.isFeatured && b.isFeatured) return 1
          return (b.rating || 0) - (a.rating || 0)
        })
        break
      default:
        // Default order (as from API)
        break
    }

    setFilteredServices(sorted)
  }, [services, sortBy])

  // Handle URL hash scroll
  useEffect(() => {
    const hash = window.location.hash.substring(1)
    if (hash && services.some(service => service._id === hash)) {
      setActiveService(hash)
      setTimeout(() => {
        const element = serviceRefs.current[hash]
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' })
          element.classList.add('ring-2', 'ring-brand-yellow', 'shadow-lg')
          setTimeout(() => element.classList.remove('ring-2', 'ring-brand-yellow', 'shadow-lg'), 2000)
        }
      }, 100)
    }
  }, [searchParams, services])

  const getRatingColor = (rating: number) => {
    if (rating >= 4.5) return "bg-green-500"
    if (rating >= 4.0) return "bg-blue-500"
    if (rating >= 3.5) return "bg-yellow-500"
    return "bg-gray-500"
  }

  const getStarIcons = (rating: number) => {
    const stars = []
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 >= 0.5

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />)
    }

    if (hasHalfStar) {
      stars.push(<Star key="half" className="h-4 w-4 fill-yellow-200 text-yellow-400" />)
    }

    const emptyStars = 5 - stars.length
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="h-4 w-4 text-gray-300" />)
    }

    return stars
  }

  if (loading) return (
    <div className="min-h-screen bg-background pt-20 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-blue mx-auto mb-4"></div>
        <p className="text-muted-foreground">جاري تحميل الخدمات...</p>
      </div>
    </div>
  )

  if (!services.length) return (
    <div className="min-h-screen bg-background pt-20 flex items-center justify-center">
      <div className="text-center">
        <Palette className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-medium mb-2">لا توجد خدمات حالياً</h3>
        <p className="text-muted-foreground">سنضيف خدمات قريباً</p>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-background pt-20">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="text-brand-yellow">خدماتنا</span>{" "}
            <span className="text-brand-blue">المتميزة</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            اكتشف مجموعة خدماتنا المصممة خصيصاً لنجاحك
          </p>

          {/* Sorting Controls */}
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
              <span className="text-lg">💰</span>
              السعر
            </Button>
            <Button
              variant={sortBy === "featured" ? "default" : "outline"}
              size="sm"
              onClick={() => setSortBy("featured")}
              className="flex items-center gap-2"
            >
              <Sparkles className="h-4 w-4" />
              المميز
            </Button>
            <Button
              variant={sortBy === "default" ? "default" : "outline"}
              size="sm"
              onClick={() => setSortBy("default")}
              className="flex items-center gap-2"
            >
              <Filter className="h-4 w-4" />
              الافتراضي
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-brand-blue">{services.length}</div>
              <div className="text-sm text-muted-foreground">خدمة متاحة</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {services.filter(s => s.rating >= 4.5).length}
              </div>
              <div className="text-sm text-muted-foreground">ممتاز</div>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">
                {Math.round(services.reduce((acc, s) => acc + s.rating, 0) / services.length * 10) / 10}
              </div>
              <div className="text-sm text-muted-foreground">متوسط التقييم</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {services.filter(s => s.isFeatured).length}
              </div>
              <div className="text-sm text-muted-foreground">مميز</div>
            </div>
          </div>
        </motion.div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((service, index) => {
            const Icon = iconMap[service.icon] || Palette
            return (
              <motion.div
                key={service._id}
                ref={el => serviceRefs.current[service._id] = el}
                id={service._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="transition-all duration-300 rounded-lg"
              >
                <Card className="h-full hover:shadow-xl transition-all duration-300 border-0 shadow-lg relative overflow-hidden group">
                  {/* Featured Badge */}
                  {service.isFeatured && (
                    <div className="absolute top-4 right-4 z-10">
                      <Badge className="bg-gradient-to-r from-brand-yellow to-orange-500 text-white border-0 shadow-lg">
                        <Sparkles className="h-3 w-3 mr-1" />
                        مميز
                      </Badge>
                    </div>
                  )}

                  {/* Rating Badge */}
                  <div className="absolute top-4 left-4 z-10">
                    <Badge 
                      variant="secondary" 
                      className={`flex items-center gap-1 ${getRatingColor(service.rating)} text-white border-0 shadow-lg`}
                    >
                      <Star className="h-3 w-3 fill-white" />
                      {service.rating}
                    </Badge>
                  </div>

                  <CardHeader className="text-center pb-4 pt-12">
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-brand-blue/10 to-brand-yellow/10 flex items-center justify-center mb-4 group-hover:from-brand-blue/20 group-hover:to-brand-yellow/20 transition-all duration-300"
                    >
                      <Icon className="h-8 w-8 text-brand-blue" />
                    </motion.div>
                    <CardTitle className="text-xl font-bold mb-2">{service.title}</CardTitle>
                    <p className="text-muted-foreground text-sm leading-relaxed">{service.description}</p>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    {/* Rating Stars */}
                    <div className="flex items-center justify-center gap-1">
                      {getStarIcons(service.rating)}
                      {service.reviewCount && (
                        <span className="text-xs text-muted-foreground mr-2">
                          ({service.reviewCount})
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                      <Badge variant="secondary" className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {service.duration}
                      </Badge>
                      <span className="font-bold text-2xl text-brand-blue">
                        {service.price.toLocaleString()} ر.س
                      </span>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-semibold text-sm text-right">المميزات تشمل:</h4>
                      <ul className="space-y-1">
                        {(service.features || []).slice(0, 3).map((feature, idx) => (
                          <li key={idx} className="text-sm text-muted-foreground flex items-center gap-2 text-right">
                            <div className="w-1.5 h-1.5 rounded-full bg-brand-yellow flex-shrink-0" />
                            <span className="flex-1">{feature}</span>
                          </li>
                        ))}
                        {service.features.length > 3 && (
                          <li className="text-xs text-muted-foreground text-center">
                            +{service.features.length - 3} ميزات أخرى
                          </li>
                        )}
                      </ul>
                    </div>

                    <Button
                      onClick={() => router.push(`/request-service?id=${service._id}`)}
                      className="w-full bg-gradient-to-r from-brand-blue to-blue-600 hover:from-brand-blue/90 hover:to-blue-600/90 text-white font-semibold py-2.5"
                    >
                      طلب الخدمة الآن
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="text-center mt-16 p-8 rounded-2xl bg-gradient-to-r from-brand-blue/10 to-brand-yellow/10 border border-brand-blue/20"
        >
          <h2 className="text-3xl font-bold mb-4">لم تجد الخدمة التي تبحث عنها؟</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            فريقنا مستعد لمساعدتك في تصميم حل مخصص يناسب احتياجاتك الخاصة
          </p>
          <Button 
            size="lg" 
            className="bg-gradient-to-r from-brand-blue to-blue-600 hover:from-brand-blue/90 hover:to-blue-600/90 text-white"
          >
            تواصل معنا الآن
          </Button>
        </motion.div>
      </div>
    </div>
  )
}