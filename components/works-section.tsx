"use client"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import Image from "next/image"

interface PortfolioItem {
  _id: string
  title: string
  category: string
  description?: string
  image: string
  tags: string[]
  featured: boolean
  createdAt: string
  updatedAt: string
}

export function WorksSection() {
  const [works, setWorks] = useState<PortfolioItem[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const autoPlayRef = useRef<NodeJS.Timeout>()

  // Fetch works from database
  useEffect(() => {
    const fetchWorks = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/portfolio')
        
        if (!response.ok) {
          throw new Error('Failed to fetch portfolio items')
        }
        
        const data = await response.json()
        setWorks(data)
      } catch (err) {
        console.error('Error fetching works:', err)
        setError('Failed to load works')
      } finally {
        setLoading(false)
      }
    }

    fetchWorks()
  }, [])

  // Auto-scroll functionality
  useEffect(() => {
    if (works.length === 0) return

    autoPlayRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % works.length)
    }, 4000) // Change every 4 seconds

    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current)
      }
    }
  }, [works.length])

  // Scroll to current item - FIXED
  useEffect(() => {
    if (scrollContainerRef.current && works.length > 0) {
      const container = scrollContainerRef.current
      const scrollWidth = container.scrollWidth
      const itemWidth = scrollWidth / works.length
      container.scrollTo({
        left: itemWidth * currentIndex,
        behavior: 'smooth'
      })
    }
  }, [currentIndex, works.length])

  const handleDotClick = (index: number) => {
    setCurrentIndex(index)
    if (autoPlayRef.current) {
      clearInterval(autoPlayRef.current)
    }
  }

  // Function to check if file is video
  const isVideoFile = (url: string) => {
    return url.match(/\.(mp4|webm|ogg|mov|avi)$/i)
  }

  // Function to check if file is image
  const isImageFile = (url: string) => {
    return url.match(/\.(jpg|jpeg|png|gif|webp|bmp|svg)$/i)
  }

  if (loading) {
    return (
      <section className="py-8 bg-gradient-to-b from-background to-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-6">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
              أعمالنا
            </h2>
            <p className="text-muted-foreground text-sm max-w-2xl mx-auto">
              اكتشف أحدث مشاريعنا وإبداعاتنا التي نفخر بها
            </p>
          </div>
          <div className="flex justify-center items-center h-48 bg-muted rounded-lg">
            <div className="text-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-brand-blue mx-auto mb-2"></div>
              <p className="text-muted-foreground text-sm">جاري تحميل الأعمال...</p>
            </div>
          </div>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="py-8 bg-gradient-to-b from-background to-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-6">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
              أعمالنا
            </h2>
          </div>
          <div className="flex justify-center items-center h-48 bg-muted rounded-lg">
            <div className="text-center text-red-600 text-sm">
              <p>⚠️ {error}</p>
            </div>
          </div>
        </div>
      </section>
    )
  }

  if (works.length === 0) {
    return (
      <section className="py-8 bg-gradient-to-b from-background to-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-6">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
              أعمالنا
            </h2>
            <p className="text-muted-foreground text-sm max-w-2xl mx-auto">
              اكتشف أحدث مشاريعنا وإبداعاتنا التي نفخر بها
            </p>
          </div>
          <div className="flex justify-center items-center h-48 bg-muted rounded-lg">
            <div className="text-center text-muted-foreground text-sm">
              <p>لا توجد أعمال لعرضها حالياً</p>
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-8 bg-gradient-to-b from-background to-muted/30 w-full">
      <div className="w-full px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-6"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
            أعمالنا
          </h2>
          <p className="text-muted-foreground text-sm max-w-2xl mx-auto">
            اكتشف أحدث مشاريعنا وإبداعاتنا التي نفخر بها
          </p>
        </motion.div>

        {/* FIXED Scrolling Works Container */}
        <div className="relative w-full">
          <div
            ref={scrollContainerRef}
            className="flex overflow-x-hidden snap-x snap-mandatory scrollbar-hide w-full"
            style={{ scrollBehavior: 'smooth' }}
          >
            {works.map((work, index) => (
              <div
                key={work._id}
                className="flex-shrink-0 w-full snap-center px-3"
                style={{ minWidth: '100%' }} // Force each item to take full width
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                  className="bg-card rounded-lg shadow-lg overflow-hidden border border-border h-full flex flex-col w-full"
                >
                  {/* Media container - handles both images and videos */}
                  <div className="h-64 relative bg-muted flex items-center justify-center w-full">
                    {isVideoFile(work.image) ? (
                      // Video player
                      <video
                        src={work.image}
                        className="w-full h-full object-cover"
                        controls
                        preload="metadata"
                      >
                        Your browser does not support the video tag.
                      </video>
                    ) : isImageFile(work.image) ? (
                      // Image
                      <Image
                        src={work.image}
                        alt={work.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 100vw"
                        onError={(e) => {
                          // Fallback for broken images
                          const target = e.target as HTMLImageElement
                          target.src = '/images/placeholder.jpg'
                        }}
                      />
                    ) : (
                      // Fallback for unknown file types
                      <div className="w-full h-full flex items-center justify-center bg-muted">
                        <div className="text-center text-muted-foreground">
                          <p>نوع الملف غير مدعوم</p>
                          <p className="text-sm">{work.image}</p>
                        </div>
                      </div>
                    )}
                    
                    {work.featured && (
                      <div className="absolute top-2 left-2 bg-brand-blue text-white px-2 py-1 rounded text-xs font-medium z-10">
                        مميز
                      </div>
                    )}
                  </div>
                  
                  <div className="p-4 flex-1 flex flex-col w-full">
                    <div className="flex justify-between items-start mb-2 w-full">
                      <h3 className="text-lg font-semibold text-foreground line-clamp-1 flex-1">
                        {work.title}
                      </h3>
                      <span className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded shrink-0 ml-2">
                        {work.category}
                      </span>
                    </div>
                    
                    {work.description && (
                      <p className="text-muted-foreground text-sm mb-3 line-clamp-2 flex-1">
                        {work.description}
                      </p>
                    )}
                    
                    {work.tags && work.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-auto">
                        {work.tags.slice(0, 3).map((tag, tagIndex) => (
                          <span
                            key={tagIndex}
                            className="text-xs bg-primary/10 text-primary px-2 py-1 rounded"
                          >
                            {tag}
                          </span>
                        ))}
                        {work.tags.length > 3 && (
                          <span className="text-xs text-muted-foreground">
                            +{work.tags.length - 3} أكثر
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </motion.div>
              </div>
            ))}
          </div>

          {/* Navigation Dots */}
          {works.length > 1 && (
            <div className="flex justify-center mt-6 space-x-2">
              {works.map((_, index) => (
                <button
                  key={index}
                  onClick={() => handleDotClick(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentIndex
                      ? 'bg-brand-blue scale-110'
                      : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
                  }`}
                  aria-label={`انتقل إلى الشريحة ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}