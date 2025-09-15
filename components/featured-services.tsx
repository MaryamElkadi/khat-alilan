"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { Palette, Globe, Megaphone, Printer, Camera, BarChart3 } from "lucide-react"

interface Service {
  _id: string
  title: string
  description: string
  icon: string // store the icon name in DB
  price?: string
  duration?: string
  rating?: number
  features?: string
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

  const handleServiceClick = (serviceId: string) => {
    router.push(`/services#${serviceId}`)
  }

  if (loading) return <div className="text-center py-20">جاري تحميل الخدمات...</div>
  if (!services.length) return <div className="text-center py-20">لا توجد خدمات حالياً</div>

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-brand-yellow">خدماتنا</span> <span className="text-brand-blue">المتميزة</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            نقدم مجموعة شاملة من الخدمات الإعلانية والتسويقية لتلبية جميع احتياجاتك
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => {
            const Icon = iconMap[service.icon] || Palette
            return (
              <motion.div
                key={service._id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
              >
                <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-card/50 backdrop-blur">
                  <CardHeader className="text-center pb-4">
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      className="w-16 h-16 mx-auto rounded-full bg-brand-yellow/10 flex items-center justify-center mb-4"
                    >
                      <Icon className="h-8 w-8 text-brand-yellow" />
                    </motion.div>
                    <CardTitle className="text-xl font-bold text-foreground">{service.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <CardDescription className="text-muted-foreground mb-6 leading-relaxed">
                      {service.description}
                    </CardDescription>
                    <Button
                      variant="outline"
                      className="w-full border-primary text-primary hover:bg-primary hover:text-primary-foreground bg-transparent"
                      onClick={() => handleServiceClick(service._id)}
                    >
                      اعرف المزيد
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
