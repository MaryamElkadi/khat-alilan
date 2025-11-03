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

    // For non-logged in users, we'll create an order without a user ID
    // The API should handle guest orders
    const requestData = {
      // Remove user field for guest orders, or get it from a different auth hook
      items: [
        {
          product: service._id,
          modelType: "Service",
          name: service.title,
          price: Number(service.price),
          quantity: 1,
        },
      ],
      shippingInfo: {
        customer: formData.name, // Use full name as customer
        email: formData.email,
        phone: formData.phone,
      },
      paymentMethod: "cash",
      notes: formData.notes,
      status: "جديد"
    }

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestData),
      })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.error || "فشل إرسال الطلب. حاول مجدداً.")
      }

      const data = await res.json()
      toast.success("تم استلام طلبك بنجاح! 🎉 سنتواصل معك قريباً")
      
      // Redirect to home or confirmation page
      setTimeout(() => {
        router.push("/")
      }, 2000)
      
    } catch (err: any) {
      console.error("Order submission error:", err)
      toast.error(err.message || "فشل إرسال الطلب. حاول مجدداً.")
    } finally {
      setIsLoading(false)
    }
  }

  // Loading state
  if (isServiceLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-brand-yellow mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">جاري تحميل الخدمة...</p>
        </div>
      </div>
    )
  }

  // Error state
  if (error || !service) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <p className="text-xl text-destructive mb-4">{error || "خطأ: لم يتم العثور على الخدمة."}</p>
          <Button onClick={() => router.push("/services")}>
            العودة إلى الخدمات
          </Button>
        </div>
      </div>
    )
  }

  // Form UI
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center py-16 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl"
      >
        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-gray-900 dark:text-white">
              طلب خدمة: <span className="text-brand-yellow">{service.title}</span>
            </CardTitle>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              السعر: <span className="font-bold text-green-600">{service.price} ر.س</span>
            </p>
            {service.description && (
              <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">
                {service.description}
              </p>
            )}
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-gray-700 dark:text-gray-300">
                    الاسم الكامل *
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="أدخل اسمك الكامل"
                    required
                    className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-700 dark:text-gray-300">
                    البريد الإلكتروني *
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="example@email.com"
                    required
                    className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="text-gray-700 dark:text-gray-300">
                  رقم الهاتف *
                </Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="05XXXXXXXX"
                  required
                  className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes" className="text-gray-700 dark:text-gray-300">
                  ملاحظات إضافية (اختياري)
                </Label>
                <Textarea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  placeholder="أخبرنا عن متطلباتك بالتفصيل..."
                  rows={4}
                  className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white resize-none"
                />
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <p className="text-sm text-blue-700 dark:text-blue-300 text-center">
                  📞 سنقوم بالاتصال بك على الرقم المقدم لتأكيد طلبك وتفاصيل الخدمة
                </p>
              </div>

              <Button
                type="submit"
                className="w-full bg-brand-yellow text-black hover:bg-brand-yellow/90 font-bold py-3 text-lg"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin ml-2" />
                    جاري إرسال الطلب...
                  </>
                ) : (
                  "إرسال طلب الخدمة"
                )}
              </Button>

              <p className="text-center text-sm text-gray-500 dark:text-gray-400">
                بالضغط على زر الإرسال، فإنك توافق على شروط الخدمة وسياسة الخصوصية
              </p>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}