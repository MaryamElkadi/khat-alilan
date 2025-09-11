"use client"

import { motion } from "framer-motion"
import { CreditCard, Plus, Trash2, Edit } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

const paymentMethods = [
  {
    id: "1",
    type: "visa",
    last4: "4242",
    expiryMonth: "12",
    expiryYear: "2025",
    isDefault: true,
  },
  {
    id: "2",
    type: "mastercard",
    last4: "8888",
    expiryMonth: "06",
    expiryYear: "2026",
    isDefault: false,
  },
]

export default function PaymentMethodsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-right">طرق الدفع</h1>
          <Button className="bg-brand-blue hover:bg-brand-blue/90">
            <Plus className="h-4 w-4 ml-2" />
            إضافة بطاقة جديدة
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paymentMethods.map((method, index) => (
            <motion.div
              key={method.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className="hover:shadow-lg transition-shadow relative">
                {method.isDefault && (
                  <Badge className="absolute top-4 right-4 bg-brand-yellow text-black">افتراضي</Badge>
                )}

                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-5 w-5" />
                      <span className="capitalize">{method.type}</span>
                    </div>
                    <span className="text-lg">•••• {method.last4}</span>
                  </CardTitle>
                </CardHeader>

                <CardContent>
                  <div className="space-y-4">
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">تاريخ الانتهاء</p>
                      <p className="font-semibold">
                        {method.expiryMonth}/{method.expiryYear}
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                        <Edit className="h-4 w-4 ml-1" />
                        تعديل
                      </Button>
                      <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700 bg-transparent">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
