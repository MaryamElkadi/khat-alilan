"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Navbar } from "@/components/navbar"
import { EnhancedHero } from "@/components/enhanced-hero"
import { WorksSection } from "@/components/works-section" // Add this import
import { FeaturedServices } from "@/components/featured-services"
import { FeaturedProducts } from "@/components/featured-products"
import { AboutSection } from "@/components/about-section"
import { TestimonialsSection } from "@/components/testimonials-section"
import { Footer } from "@/components/footer"
import { PageTransition } from "@/components/page-transition"
import { useAdminAuth } from "@/lib/admin-auth"

export default function HomePage() {
  const { user, isAdmin, isLoading } = useAdminAuth()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!isLoading && user && isAdmin) {
      router.push("/admin")
    }
  }, [user, isAdmin, isLoading, router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-blue mx-auto mb-4"></div>
          <p className="text-muted-foreground">جاري التحميل...</p>
        </div>
      </div>
    )
  }

  return (
    <PageTransition>
      <motion.div
        initial={mounted ? { opacity: 0 } : false}
        animate={mounted ? { opacity: 1 } : false}
        transition={{ duration: 0.5 }}
        className="min-h-screen bg-background"
      >
        
        <main>
          <EnhancedHero />
          <WorksSection /> {/* Add this line */}
          <FeaturedServices />
          <FeaturedProducts />
          <AboutSection />
          <TestimonialsSection />
        </main>
       
      </motion.div>
    </PageTransition>
  )
}