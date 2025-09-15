"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Mail, Phone, User, MessageSquare } from "lucide-react"

export default function AdminContactsPage() {
  const [messages, setMessages] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await fetch("/api/contact")
        const data = await res.json()
        setMessages(data)
      } catch (error) {
        console.error("فشل في تحميل الرسائل:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchMessages()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-brand-blue" />
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold mb-6">📩 رسائل تواصل معنا</h1>
      {messages.length === 0 ? (
        <p className="text-muted-foreground">لا توجد رسائل حتى الآن</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card className="shadow-md hover:shadow-lg transition">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5 text-brand-blue" />
                    {msg.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-right">
                  <p className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 text-muted-foreground" /> {msg.phone}
                  </p>
                  <p className="flex items-center gap-2 text-sm">
                    <Mail className="h-4 w-4 text-muted-foreground" /> {msg.email}
                  </p>
                  <p className="text-sm text-muted-foreground">📝 {msg.subject}</p>
                  <p className="text-sm border-t pt-2 flex items-start gap-2">
                    <MessageSquare className="h-4 w-4 mt-1 text-brand-yellow" /> {msg.message}
                  </p>
                  <p className="text-xs text-muted-foreground mt-2 text-left">
                    {new Date(msg.createdAt).toLocaleString("ar-SA")}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
