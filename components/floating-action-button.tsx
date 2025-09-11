"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { MessageCircle, Phone, Mail, X, Headphones } from "lucide-react"
import { Button } from "@/components/ui/button"

export function FloatingActionButton() {
  const [isOpen, setIsOpen] = useState(false)

  const actions = [
    {
      icon: Phone,
      label: "اتصل بنا",
      color: "bg-green-500 hover:bg-green-600",
      href: "tel:+966111234567",
    },
    {
      icon: Mail,
      label: "راسلنا",
      color: "bg-blue-500 hover:bg-blue-600",
      href: "mailto:info@khat-alilan.com",
    },
    {
      icon: Headphones,
      label: "دعم فني",
      color: "bg-purple-500 hover:bg-purple-600",
      href: "#support",
    },
  ]

  return (
    <div className="fixed bottom-6 left-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            className="absolute bottom-16 left-0 space-y-3"
          >
            {actions.map((action, index) => (
              <motion.div
                key={action.label}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.1, x: 5 }}
              >
                <Button
                  size="sm"
                  className={`${action.color} text-white shadow-lg rounded-full px-4 py-2 flex items-center gap-2`}
                  asChild
                >
                  <a href={action.href}>
                    <action.icon className="h-4 w-4" />
                    <span className="text-sm">{action.label}</span>
                  </a>
                </Button>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        animate={{
          rotate: isOpen ? 180 : 0,
          backgroundColor: isOpen ? "#ef4444" : "#FFD700",
        }}
        transition={{ duration: 0.3 }}
      >
        <Button
          size="lg"
          onClick={() => setIsOpen(!isOpen)}
          className="rounded-full w-14 h-14 shadow-lg border-0 text-black hover:shadow-xl"
          style={{ backgroundColor: isOpen ? "#ef4444" : "#FFD700" }}
        >
          <motion.div animate={{ rotate: isOpen ? 45 : 0 }} transition={{ duration: 0.3 }}>
            {isOpen ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
          </motion.div>
        </Button>
      </motion.div>

      {/* Pulse animation when closed */}
      {!isOpen && (
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-brand-yellow"
          animate={{
            scale: [1, 1.5, 1],
            opacity: [1, 0, 1],
          }}
          transition={{
            duration: 2,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />
      )}
    </div>
  )
}
