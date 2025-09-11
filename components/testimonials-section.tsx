"use client"

import { motion } from "framer-motion"
import { Star, Quote } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useState, useEffect } from "react"

const testimonials = [
  {
    id: 1,
    name: "أحمد محمد",
    position: "مدير التسويق",
    company: "شركة النور للتجارة",
    content:
      "خط الإعلان قدم لنا خدمة استثنائية في تصميم هويتنا التجارية. الفريق محترف جداً والنتائج فاقت توقعاتنا بكثير.",
    rating: 5,
    avatar: "/professional-arabic-businessman.jpg",
  },
  {
    id: 2,
    name: "فاطمة العلي",
    position: "مؤسسة",
    company: "مطعم الأصالة",
    content:
      "تعاملت مع خط الإعلان لتصميم موقعنا الإلكتروني وحملاتنا الإعلانية. النتائج كانت رائعة وزادت مبيعاتنا بنسبة 40%.",
    rating: 5,
    avatar: "/professional-arabic-businesswoman.jpg",
  },
  {
    id: 3,
    name: "خالد السعيد",
    position: "المدير التنفيذي",
    company: "مجموعة الرؤية",
    content: "الإبداع والاحترافية هما ما يميز فريق خط الإعلان. ساعدونا في بناء حضور قوي على وسائل التواصل الاجتماعي.",
    rating: 5,
    avatar: "/professional-arabic-executive.jpg",
  },
  {
    id: 4,
    name: "نورا الحسن",
    position: "مديرة المبيعات",
    company: "متجر الأناقة",
    content: "خدمة عملاء ممتازة وتسليم في الوقت المحدد. أنصح بشدة بالتعامل مع خط الإعلان لجميع احتياجاتكم الإعلانية.",
    rating: 5,
    avatar: "/professional-arabic-sales-manager.jpg",
  },
  {
    id: 5,
    name: "محمد الزهراني",
    position: "صاحب مشروع",
    company: "تطبيق سهل",
    content: "ساعدني فريق خط الإعلان في إطلاق تطبيقي بحملة تسويقية ناجحة جداً. الخبرة والإبداع واضحان في كل عملهم.",
    rating: 5,
    avatar: "/young-arabic-entrepreneur.jpg",
  },
]

export function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length)
    }, 5000)

    return () => clearInterval(timer)
  }, [])

  const visibleTestimonials = [
    testimonials[currentIndex],
    testimonials[(currentIndex + 1) % testimonials.length],
    testimonials[(currentIndex + 2) % testimonials.length],
  ]

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-brand-blue">آراء</span> <span className="text-brand-yellow">عملائنا</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            اكتشف ما يقوله عملاؤنا عن تجربتهم معنا وكيف ساعدناهم في تحقيق أهدافهم
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {visibleTestimonials.map((testimonial, index) => (
            <motion.div
              key={`${testimonial.id}-${currentIndex}`}
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -30, scale: 0.9 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-card/50 backdrop-blur">
                <CardContent className="p-6">
                  {/* Quote Icon */}
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4"
                  >
                    <Quote className="h-6 w-6 text-primary" />
                  </motion.div>

                  {/* Rating */}
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                    ))}
                  </div>

                  {/* Content */}
                  <p className="text-muted-foreground mb-6 leading-relaxed italic">"{testimonial.content}"</p>

                  {/* Author */}
                  <div className="flex items-center">
                    <Avatar className="h-12 w-12 ml-4">
                      <AvatarImage src={testimonial.avatar || "/placeholder.svg"} alt={testimonial.name} />
                      <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                        {testimonial.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="font-semibold text-foreground">{testimonial.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {testimonial.position} - {testimonial.company}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Pagination Dots */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="flex justify-center mt-8 space-x-2 space-x-reverse"
        >
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentIndex ? "bg-primary scale-125" : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
              }`}
            />
          ))}
        </motion.div>
      </div>
    </section>
  )
}
