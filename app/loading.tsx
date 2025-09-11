"use client"

import { motion } from "framer-motion"
import { Loader2 } from "lucide-react"

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="text-center"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
          className="mb-4"
        >
          <div className="w-16 h-16 mx-auto">
            <div className="text-4xl font-bold">
              <span className="text-brand-yellow">خط</span>
              <span className="text-brand-blue mx-1">الإعلان</span>
            </div>
          </div>
        </motion.div>

        <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}>
          <Loader2 className="h-8 w-8 animate-spin text-brand-yellow mx-auto mb-4" />
        </motion.div>

        <motion.p
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
          className="text-muted-foreground text-lg"
        >
          جاري التحميل...
        </motion.p>
      </motion.div>
    </div>
  )
}
