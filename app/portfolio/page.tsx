"use client"

import { motion } from "framer-motion"
import { useState, useEffect } from "react"
import { Filter, ArrowLeft, ExternalLink, Play, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"
import Image from "next/image"

// Portfolio categories
const categories = [
  { id: "all", name: "جميع الأعمال" },
  { id: "graphic", name: "تصميم جرافيك" },
  { id: "web", name: "تصميم مواقع" },
  { id: "social", name: "وسائل التواصل" },
  { id: "branding", name: "هوية بصرية" },
]

export default function PortfolioPage() {
  const router = useRouter()
  const [activeCategory, setActiveCategory] = useState("all")
  const [showFilters, setShowFilters] = useState(false)
  const [portfolioItems, setPortfolioItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  // ✅ Fetch portfolio data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/portfolio")
        const data = await res.json()
        setPortfolioItems(data)
      } catch (err) {
        console.error("Error fetching portfolio:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const filteredItems = activeCategory === "all" 
    ? portfolioItems 
    : portfolioItems.filter(item => item.category === activeCategory)

  if (loading) {
    return <p className="text-center py-20">جارٍ تحميل البيانات...</p>
  }

  return (
    <div className="min-h-screen bg-background pt-20">
      <div className="container mx-auto px-4 py-16">
        {/* نفس الكود اللي عندك ... */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredItems.map((item, index) => (
            <motion.div
              key={item._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="group relative"
            >
              <Card className="h-full overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="relative overflow-hidden">
                  <div className="h-48 relative bg-muted">
                    <Image
                      src={item.image || "/api/placeholder/400/300"}
                      alt={item.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {item.featured && (
                      <Badge className="absolute top-3 left-3 bg-brand-blue">
                        متميز
                      </Badge>
                    )}
                  </div>
                </div>
                <CardContent className="p-5">
                  <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                  <p className="text-muted-foreground text-sm mb-4">{item.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {item.tags?.map((tag: string) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  )
}
