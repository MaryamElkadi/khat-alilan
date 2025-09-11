"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Users, Package, Calendar, Shield } from "lucide-react"

const completedFeatures = [
  {
    category: "إدارة المنتجات",
    features: [
      "عرض جميع المنتجات مع البحث والفلترة",
      "إضافة منتجات جديدة",
      "تعديل وحذف المنتجات",
      "رفع الصور وإدارة المحتوى",
      "تصنيف المنتجات حسب الفئات",
    ],
  },
  {
    category: "نظام المصادقة",
    features: [
      "تسجيل دخول الإدارة",
      "حماية الصفحات الإدارية",
      "التوجيه حسب الأدوار",
      "إدارة جلسات المستخدمين",
      "تسجيل خروج آمن",
    ],
  },
  {
    category: "لوحة التحكم",
    features: ["إحصائيات شاملة", "رسوم بيانية تفاعلية", "مراقبة الأداء", "تقارير المبيعات", "إدارة الطلبات"],
  },
  {
    category: "تجربة المستخدم",
    features: [
      "تصميم متجاوب",
      "رسوم متحركة سلسة",
      "سلة التسوق التفاعلية",
      "صفحات تفاصيل المنتجات",
      "نظام التنقل المحسن",
    ],
  },
]

const systemStats = [
  { label: "إجمالي المنتجات", value: "25+", icon: Package, color: "text-blue-600" },
  { label: "الصفحات المكتملة", value: "15", icon: Calendar, color: "text-green-600" },
  { label: "المكونات", value: "30+", icon: Users, color: "text-purple-600" },
  { label: "مستوى الأمان", value: "عالي", icon: Shield, color: "text-red-600" },
]

export default function AdminSummaryPage() {
  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
        <h1 className="text-4xl font-bold mb-4">
          <span className="text-brand-blue">ملخص</span> <span className="text-brand-yellow">المشروع</span>
        </h1>
        <p className="text-muted-foreground text-lg">نظام إدارة متكامل لموقع خط الإعلان الإلكتروني</p>
      </motion.div>

      {/* System Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {systemStats.map((stat, index) => (
          <Card key={index} className="text-center">
            <CardContent className="p-6">
              <stat.icon className={`h-8 w-8 mx-auto mb-4 ${stat.color}`} />
              <div className="text-2xl font-bold mb-2">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      {/* Completed Features */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <h2 className="text-2xl font-bold mb-6 text-center">المميزات المكتملة</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {completedFeatures.map((section, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
            >
              <Card className="h-full">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Badge className="bg-brand-yellow text-black">{section.category}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {section.features.map((feature, featureIndex) => (
                      <motion.div
                        key={featureIndex}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 + featureIndex * 0.05 }}
                        className="flex items-center gap-3"
                      >
                        <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Technical Stack */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
        <Card>
          <CardHeader>
            <CardTitle className="text-center">التقنيات المستخدمة</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              {[
                "Next.js 14",
                "TypeScript",
                "Tailwind CSS",
                "Framer Motion",
                "React Hooks",
                "Context API",
                "Responsive Design",
                "Modern UI/UX",
              ].map((tech, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.6 + index * 0.05 }}
                  className="p-3 bg-muted rounded-lg"
                >
                  <div className="font-medium text-sm">{tech}</div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Success Message */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="text-center p-8 bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl border border-green-200"
      >
        <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
        <h3 className="text-2xl font-bold text-green-700 mb-2">تم إكمال المشروع بنجاح!</h3>
        <p className="text-green-600 max-w-2xl mx-auto">
          تم تطوير نظام إدارة متكامل لموقع خط الإعلان الإلكتروني مع جميع المميزات المطلوبة بما في ذلك إدارة المنتجات،
          نظام المصادقة، لوحة التحكم، وتجربة مستخدم متميزة.
        </p>
      </motion.div>
    </div>
  )
}
