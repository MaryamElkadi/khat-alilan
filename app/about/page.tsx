"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Target, Eye, Heart, Users, Award, Clock, CheckCircle } from "lucide-react"
import { useRouter } from "next/navigation" // ⬅️ هذا ما ناقصك

const stats = [
  { number: "500+", label: "عميل راضٍ", icon: Users },
  { number: "1000+", label: "مشروع مكتمل", icon: CheckCircle },
  { number: "5", label: "سنوات خبرة", icon: Clock },
  { number: "15+", label: "جائزة وتقدير", icon: Award },
]

const values = [
  {
    icon: Target,
    title: "الدقة والاحترافية",
    description: "نلتزم بأعلى معايير الجودة في جميع أعمالنا",
  },
  {
    icon: Eye,
    title: "الرؤية الإبداعية",
    description: "نقدم حلول إبداعية مبتكرة تميز علامتك التجارية",
  },
  {
    icon: Heart,
    title: "الشغف بالتميز",
    description: "نعمل بشغف لتحقيق أهدافك وتجاوز توقعاتك",
  },
]

const team = [
  {
    name: "أحمد محمد",
    role: "المدير الإبداعي",
    image: "/professional-arabic-creative-director.jpg",
  },
  {
    name: "فاطمة أحمد",
    role: "مصممة جرافيك",
    image: "/professional-arabic-graphic-designer-woman.jpg",
  },
  {
    name: "محمد علي",
    role: "مطور ويب",
    image: "/professional-arabic-web-developer.jpg",
  },
  {
    name: "نور الهدى",
    role: "مديرة التسويق",
    image: "/professional-arabic-marketing-manager-woman.jpg",
  },
]

export default function AboutPage() {
  const router = useRouter() // ⬅️ وهذا أيضاً ناقصك

  return (
    <div className="min-h-screen bg-background pt-20">
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="text-brand-yellow">من</span> <span className="text-brand-blue">نحن</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            شركة خط الإعلان هي شركة رائدة في مجال الإعلان والتسويق الرقمي، نساعد الشركات على بناء هويتها البصرية وتحقيق
            أهدافها التسويقية
          </p>
        </motion.div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16"
        >
          {stats.map((stat, index) => (
            <motion.div key={index} whileHover={{ scale: 1.05 }} className="text-center p-6 rounded-2xl bg-card border">
              <stat.icon className="h-8 w-8 text-brand-yellow mx-auto mb-4" />
              <div className="text-3xl font-bold text-brand-blue mb-2">{stat.number}</div>
              <div className="text-muted-foreground">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Story Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
            <h2 className="text-3xl font-bold mb-6">قصتنا</h2>
            <div className="space-y-4 text-muted-foreground">
              <p>
                بدأت رحلتنا في عام 2019 برؤية واضحة: تقديم خدمات إعلانية وتسويقية متميزة تساعد الشركات على النمو
                والازدهار في العصر الرقمي.
              </p>
              <p>
                منذ تأسيسنا، نجحنا في خدمة أكثر من 500 عميل وإنجاز أكثر من 1000 مشروع ناجح، مما جعلنا واحدة من الشركات
                الرائدة في المنطقة.
              </p>
              <p>
                نفخر بفريقنا المتخصص من المصممين والمطورين والمسوقين الذين يعملون بشغف لتحقيق رؤية عملائنا وتجاوز
                توقعاتهم.
              </p>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="relative"
          >
            <img
              src="/modern-advertising-agency-office-arabic-team.jpg"
              alt="مكتب شركة خط الإعلان"
              className="rounded-2xl shadow-lg w-full h-auto"
            />
          </motion.div>
        </div>

        {/* Values Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-center mb-12">قيمنا</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <motion.div key={index} whileHover={{ y: -5 }} className="text-center">
                <Card className="p-6 h-full">
                  <CardContent className="space-y-4">
                    <div className="p-4 rounded-full bg-brand-yellow/10 w-fit mx-auto">
                      <value.icon className="h-8 w-8 text-brand-yellow" />
                    </div>
                    <h3 className="text-xl font-bold">{value.title}</h3>
                    <p className="text-muted-foreground">{value.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Team Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-center mb-12">فريقنا</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <motion.div key={index} whileHover={{ y: -5 }} className="text-center">
                <Card className="overflow-hidden">
                  <CardContent className="p-0">
                    <img
                      src={member.image || "/placeholder.svg"}
                      alt={member.name}
                      className="w-full h-64 object-cover"
                    />
                    <div className="p-6">
                      <h3 className="text-xl font-bold mb-2">{member.name}</h3>
                      <p className="text-brand-blue font-medium">{member.role}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

    
      </div>
    </div>
  )
}