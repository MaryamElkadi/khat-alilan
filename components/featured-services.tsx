"use client"

import { motion } from "framer-motion"
import { Palette, Globe, Megaphone, Printer, Camera, BarChart3 } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useRouter } from "next/navigation"

const services = [
  {
    id: "graphic-design",
    title: "تصميم جرافيك",
    description: "تصاميم إبداعية ومتميزة للهوية البصرية والمواد الإعلانية",
    icon: Palette,
    color: "text-brand-yellow",
    bgColor: "bg-brand-yellow/10",
  },
  {
    id: "web-design",
    title: "تصميم مواقع ويب",
    description: "مواقع ويب حديثة ومتجاوبة مع جميع الأجهزة",
    icon: Globe,
    color: "text-brand-blue",
    bgColor: "bg-brand-blue/10",
  },
  {
    id: "social-media",
    title: "إعلانات وسائل التواصل",
    description: "حملات إعلانية مؤثرة على منصات التواصل الاجتماعي",
    icon: Megaphone,
    color: "text-brand-yellow",
    bgColor: "bg-brand-yellow/10",
  },
  {
    id: "printing",
    title: "طباعة ونشر",
    description: "خدمات طباعة عالية الجودة للمواد الإعلانية والتسويقية",
    icon: Printer,
    color: "text-brand-blue",
    bgColor: "bg-brand-blue/10",
  },
  {
    id: "photography",
    title: "التصوير الفوتوغرافي",
    description: "تصوير احترافي للمنتجات والفعاليات والبورتريه",
    icon: Camera,
    color: "text-brand-yellow",
    bgColor: "bg-brand-yellow/10",
  },
  {
    id: "digital-marketing",
    title: "التسويق الرقمي",
    description: "استراتيجيات تسويقية شاملة لزيادة المبيعات والوصول",
    icon: BarChart3,
    color: "text-brand-blue",
    bgColor: "bg-brand-blue/10",
  },
]

export function FeaturedServices() {
  const router = useRouter()

  const handleServiceClick = (serviceId: string) => {
    // Navigate to services page and scroll to the specific service
    router.push(`/services#${serviceId}`)
  }

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
          {services.map((service, index) => (
            <motion.div
              key={service.id}
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
                    className={`w-16 h-16 mx-auto rounded-full ${service.bgColor} flex items-center justify-center mb-4`}
                  >
                    <service.icon className={`h-8 w-8 ${service.color}`} />
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
                    onClick={() => handleServiceClick(service.id)}
                  >
                    اعرف المزيد
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}