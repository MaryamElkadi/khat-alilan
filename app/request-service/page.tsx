"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Loader2 } from "lucide-react"
import { toast } from "react-toastify"

// Define a type for the Service object
interface Service {
  _id: string
  title: string
  price: number
  description: string
}

export default function RequestServicePage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const serviceId = searchParams.get("id")
const { user } = useAdminAuth(); // Your auth hook

  const [service, setService] = useState<Service | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    notes: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [isServiceLoading, setIsServiceLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch service details
  useEffect(() => {
    if (serviceId) {
      const fetchService = async () => {
        try {
          const res = await fetch(`/api/services/${serviceId}`)
          if (!res.ok) throw new Error("Service not found")
          const data = await res.json()
          setService(data)
        } catch (err: any) {
          setError(err.message)
        } finally {
          setIsServiceLoading(false)
        }
      }
      fetchService()
    } else {
      setError("No service selected.")
      setIsServiceLoading(false)
    }
  }, [serviceId])

  // Handle form input
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  setIsLoading(true)

  if (!service) {
    toast.error("الخدمة غير متوفرة.")
    setIsLoading(false)
    return
  }

  const requestData = {
    user: user?.id, // ✅ User ID from auth
    items: [
      {
        product: service._id,
        modelType: "Service", // ✅ Specify model type
        name: service.title,
        price: Number(service.price),
        quantity: 1,
      },
    ],
    shippingInfo: {
      firstName: formData.name.split(' ')[0] || '',
      lastName: formData.name.split(' ').slice(1).join(' ') || '',
      email: formData.email,
      phone: formData.phone,
    },
    paymentMethod: "cash",
    notes: formData.notes,
  }

  try {
    const res = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestData),
    })

    if (!res.ok) throw new Error("فشل إرسال الطلب. حاول مجدداً.")

    const data = await res.json()
    toast.success("تم استلام طلبك بنجاح! 🎉 سنتواصل معك قريباً")
    router.push("/profile") // Redirect to profile to see the order
  } catch (err: any) {
    console.error(err)
    toast.error(err.message || "فشل إرسال الطلب. حاول مجدداً.")
  } finally {
    setIsLoading(false)
  }
}
  // Loading state
  if (isServiceLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-brand-yellow" />
      </div>
    )
  }

  // Error state
  if (error || !service) {
    return (
      <div className="flex min-h-screen items-center justify-center text-center">
        <p className="text-xl text-destructive">{error || "خطأ: لم يتم العثور على الخدمة."}</p>
      </div>
    )
  }

  // Form UI
  return (
    <div className="min-h-screen flex items-center justify-center py-16 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl"
      >
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl text-center">
              طلب خدمة: <span className="text-brand-yellow">{service.title}</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">الاسم الكامل</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="أدخل اسمك"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">البريد الإلكتروني</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="example@email.com"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">رقم الهاتف</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="000-000-0000"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">ملاحظات إضافية (اختياري)</Label>
                <Textarea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  placeholder="أخبرنا عن متطلباتك بالتفصيل"
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-brand-yellow text-black hover:bg-brand-yellow/90"
                disabled={isLoading}
              >
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : "إرسال الطلب"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
