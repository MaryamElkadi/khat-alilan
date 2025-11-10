"use client"

import { motion, useScroll, useTransform } from "framer-motion"
import { ArrowLeft, Play, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { fadeInUp, staggerContainer } from "@/lib/scroll-animations"

export function EnhancedHero() {
  const { scrollY } = useScroll()
  const y1 = useTransform(scrollY, [0, 300], [0, -50])
  const y2 = useTransform(scrollY, [0, 300], [0, -100])
  const opacity = useTransform(scrollY, [0, 300], [1, 0])

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-background via-background to-muted/20">
      {/* Enhanced Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          style={{ y: y1 }}
          animate={{
            rotate: [0, 360],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 20,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
          className="absolute top-1/4 right-1/4 w-64 h-64 bg-brand-yellow/20 rounded-full blur-3xl"
        />
        <motion.div
          style={{ y: y2 }}
          animate={{
            rotate: [360, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 25,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
          className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-brand-blue/20 rounded-full blur-3xl"
        />

        {/* Floating particles */}
        {Array.from({ length: 6 }).map((_, i) => (
          <motion.div
            key={i}
            animate={{
              y: [0, -20, 0],
              x: [0, 10, 0],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 4 + i,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
              delay: i * 0.5,
            }}
            className="absolute w-2 h-2 bg-brand-yellow/60 rounded-full"
            style={{
              top: `${20 + i * 10}%`,
              left: `${10 + i * 15}%`,
            }}
          />
        ))}
      </div>

      <motion.div style={{ opacity }} className="container mx-auto px-4 relative z-10">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="text-center max-w-4xl mx-auto"
        >
          {/* Headline */}
          <motion.div variants={fadeInUp} className="relative">
            <motion.div
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 6, repeat: Number.POSITIVE_INFINITY }}
              className="absolute -top-8 -right-8 text-brand-yellow"
            >
              <Sparkles className="h-8 w-8" />
            </motion.div>

            <h1 className="text-5xl md:text-7xl font-bold mb-4 leading-tight">
              <motion.span
                animate={{
                  textShadow: ["0 0 0px #FFD700", "0 0 20px #FFD700", "0 0 0px #FFD700"],
                }}
                transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
                className="text-brand-yellow"
              >
                خط{" "}
              </motion.span>
              <motion.span
                animate={{
                  textShadow: ["0 0 0px #1E40AF", "0 0 20px #1E40AF", "0 0 0px #1E40AF"],
                }}
                transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
                className="text-brand-blue"
              >
                الإعلان
              </motion.span>
            </h1>

            <p className="text-5xl md:text-5xl font-semibold mt-2 leading-snug">
              <motion.span
                animate={{
                  textShadow: ["0 0 0px #FFD700", "0 0 20px #FFD700", "0 0 0px #FFD700"],
                }}
                transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
                className="text-brand-yellow"
              >
                إبداع إعلاني{" "} <br></br>
              </motion.span>
              <motion.span
                animate={{
                  textShadow: ["0 0 0px #1E40AF", "0 0 20px #1E40AF", "0 0 0px #1E40AF"],
                }}
                transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, delay: 1.5 }}
                className="text-brand-blue"
              >
                لا حدود له
              </motion.span>
            </p>
          </motion.div>

          {/* Subtitle */}
          <motion.p
            variants={fadeInUp}
            className="text-xl md:text-2xl text-muted-foreground mb-8 leading-relaxed max-w-2xl mx-auto"
          >
            نحن في خط الإعلان نقدم حلولاً إبداعية ومتطورة في عالم الإعلان والتسويق الرقمي لنساعدك في الوصول إلى جمهورك
            المستهدف بأفضل الطرق
          </motion.p>

          {/* Buttons */}
          <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <motion.div whileHover={{ scale: 1.05, boxShadow: "0 10px 30px rgba(255, 215, 0, 0.3)" }} whileTap={{ scale: 0.95 }}>
              <Button
                size="lg"
                className="bg-brand-yellow text-black hover:bg-brand-yellow/90 px-8 py-6 text-lg font-semibold rounded-xl relative overflow-hidden group"
                asChild
              >
                <Link href="/services">
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                    animate={{ x: [-100, 300] }}
                    transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, repeatDelay: 3 }}
                  />
                  استكشف خدماتنا
                  <ArrowLeft className="mr-2 h-5 w-5" />
                </Link>
              </Button>
            </motion.div>

            <motion.div whileHover={{ scale: 1.05, boxShadow: "0 10px 30px rgba(30, 64, 175, 0.3)" }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="outline"
                size="lg"
                className="border-2 border-brand-blue text-brand-blue hover:bg-brand-blue hover:text-white px-8 py-6 text-lg font-semibold rounded-xl bg-transparent"
                asChild
              >
                <Link href="/portfolio">
                  <Play className="ml-2 h-5 w-5" />
                  شاهد أعمالنا
                </Link>
              </Button>
            </motion.div>
          </motion.div>

          {/* Stats */}
          <motion.div
            variants={staggerContainer}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16 pt-16 border-t border-border/40"
          >
            {[
              { number: "500+", label: "عميل راضٍ" },
              { number: "1000+", label: "مشروع مكتمل" },
              { number: "50+", label: "جائزة إبداعية" },
              { number: "24/7", label: "دعم فني" },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                variants={fadeInUp}
                whileHover={{ scale: 1.1, y: -5 }}
                className="text-center cursor-pointer"
              >
                <motion.div
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, delay: index * 0.5 }}
                  className="text-3xl md:text-4xl font-bold text-brand-yellow mb-2"
                >
                  {stat.number}
                </motion.div>
                <div className="text-muted-foreground font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
          whileHover={{ scale: 1.2 }}
          className="w-6 h-10 border-2 border-brand-yellow rounded-full flex justify-center cursor-pointer"
        >
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
            className="w-1 h-3 bg-brand-yellow rounded-full mt-2"
          />
        </motion.div>
      </motion.div>
    </section>
  )
}
