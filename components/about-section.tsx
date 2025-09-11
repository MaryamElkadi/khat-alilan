"use client"

import { motion } from "framer-motion"
import { Award, Users, Clock, Target } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

const achievements = [
  {
    icon: Award,
    number: "50+",
    title: "جائزة إبداعية",
    description: "حصلنا على أكثر من 50 جائزة في مجال الإبداع والتصميم",
  },
  {
    icon: Users,
    number: "500+",
    title: "عميل راضٍ",
    description: "خدمنا أكثر من 500 عميل من مختلف القطاعات والأحجام",
  },
  {
    icon: Clock,
    number: "7+",
    title: "سنوات خبرة",
    description: "أكثر من 7 سنوات من الخبرة في مجال الإعلان والتسويق",
  },
  {
    icon: Target,
    number: "98%",
    title: "معدل النجاح",
    description: "معدل نجاح عالي في تحقيق أهداف عملائنا التسويقية",
  },
]

export function AboutSection() {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="text-brand-yellow">من نحن؟</span>
              <br />
              <span className="text-brand-blue">قصة نجاحنا</span>
            </h2>

            <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
              نحن في <strong className="text-primary">خط الإعلان</strong> شركة رائدة في مجال الإعلان والتسويق الرقمي،
              تأسست برؤية واضحة لتقديم حلول إبداعية ومبتكرة تساعد عملاءنا على تحقيق أهدافهم التسويقية والوصول إلى
              جمهورهم المستهدف بأكثر الطرق فعالية.
            </p>

            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              فريقنا المتخصص من المصممين والمسوقين والمطورين يعمل بشغف لتحويل أفكارك إلى واقع ملموس، مستخدمين أحدث
              التقنيات والاتجاهات في عالم الإعلان والتسويق الرقمي.
            </p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <h3 className="text-2xl font-bold mb-4 text-foreground">رؤيتنا</h3>
              <p className="text-muted-foreground leading-relaxed">
                أن نكون الشريك الأول والأوثق للشركات والمؤسسات في رحلتها نحو النجاح والتميز في عالم الإعلان والتسويق.
              </p>
            </motion.div>
          </motion.div>

          {/* Achievements Grid */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 gap-6"
          >
            {achievements.map((achievement, index) => (
              <motion.div
                key={achievement.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
              >
                <Card className="text-center p-6 border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-card/50 backdrop-blur">
                  <CardContent className="p-0">
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center"
                    >
                      <achievement.icon className="h-8 w-8 text-primary" />
                    </motion.div>

                    <div className="text-3xl font-bold text-primary mb-2">{achievement.number}</div>

                    <h4 className="font-semibold text-foreground mb-2">{achievement.title}</h4>

                    <p className="text-sm text-muted-foreground leading-relaxed">{achievement.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
