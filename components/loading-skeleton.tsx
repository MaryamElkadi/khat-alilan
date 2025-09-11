"use client"

import { motion } from "framer-motion"

export function ProductSkeleton() {
  return (
    <div className="space-y-4">
      <motion.div
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
        className="bg-muted rounded-lg h-48 w-full"
      />
      <div className="space-y-2">
        <motion.div
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, delay: 0.1 }}
          className="bg-muted rounded h-4 w-3/4"
        />
        <motion.div
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, delay: 0.2 }}
          className="bg-muted rounded h-4 w-1/2"
        />
      </div>
    </div>
  )
}

export function ServiceSkeleton() {
  return (
    <div className="p-6 space-y-4">
      <motion.div
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
        className="bg-muted rounded-full h-12 w-12"
      />
      <motion.div
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, delay: 0.1 }}
        className="bg-muted rounded h-6 w-3/4"
      />
      <motion.div
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, delay: 0.2 }}
        className="bg-muted rounded h-4 w-full"
      />
      <motion.div
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, delay: 0.3 }}
        className="bg-muted rounded h-4 w-2/3"
      />
    </div>
  )
}
