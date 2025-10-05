"use client"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Star, Clock, Palette, Globe, Camera, Megaphone, PenTool, Monitor, Brush, Scissors, Sparkles } from "lucide-react"
import RequestServiceDialog from "@/components/RequestServiceDialog"

// Define the Service type
interface Service {
  _id: string
  title: string
  description: string
  icon: string
  price: number
  duration: string
  rating: number
  features: string[]
}

// Map icon names to their components
const iconMap: Record<string, React.ElementType> = {
  Palette,
  Globe,
  Camera,
  Megaphone,
  PenTool,
  Monitor,
  Brush,
  Scissors,
  Sparkles,
}

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedService, setSelectedService] = useState<Service | null>(null)
  const serviceRefs = useRef<{ [key: string]: HTMLDivElement | null }>({})

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
        }))

        setServices(normalized)
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }

    fetchServices()
  }, [])

  // Function to open the dialog with the selected service
  const handleOpenDialog = (service: Service) => {
    setSelectedService(service)
    setIsDialogOpen(true)
  }

  // Function to close the dialog
  const handleCloseDialog = () => {
    setIsDialogOpen(false)
    setSelectedService(null)
  }


  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>جاري تحميل الخدمات...</p>
      </div>
    )
  }

  if (!services.length) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>لا توجد خدمات حالياً</p>
      </div>
    )
  }

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
          {services.map((service, index) => {
            const Icon = iconMap[service.icon] || Palette
            return (
              <motion.div
                key={service._id}
                ref={el => serviceRefs.current[service._id] = el}
                id={service._id}
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
                        <Icon className="h-6 w-6 text-brand-yellow" />
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
                        {(service.features || []).map((feature, idx) => (
                          <li key={idx} className="text-sm text-muted-foreground flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-brand-yellow" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
               
                    <Button
                      className="w-full bg-brand-yellow text-black hover:bg-brand-yellow/90"
                      onClick={() => handleOpenDialog(service)}
                    >
                      طلب الخدمة
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
          className="text-center mt-16 p-8 rounded-2xl bg-gradient-to-r from-brand-blue/10 to-brand-yellow/10"
        >
          <h2 className="text-3xl font-bold mb-4">لم تجد الخدمة التي تبحث عنها؟</h2>
          <p className="text-muted-foreground mb-6">تواصل معنا لمناقشة احتياجاتك الخاصة وسنقوم بتقديم حلول مخصصة لك</p>
          <Button size="lg" className="bg-brand-yellow text-black hover:bg-brand-yellow/90">
            تواصل معنا الآن
          </Button>
        </motion.div>
      </div>
      {/* The Dialog component is rendered here, only visible when isDialogOpen is true */}
      <RequestServiceDialog
        isOpen={isDialogOpen}
        onOpenChange={handleCloseDialog}
        service={selectedService}
      />
    </div>
  )
}