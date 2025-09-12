"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Search, Eye, Edit, Trash2, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"

const initialCustomers = [
  { id: "CUS-001", name: "أحمد علي", email: "ahmed@example.com", status: "نشط", orders: 5 },
  { id: "CUS-002", name: "سارة محمد", email: "sara@example.com", status: "معلق", orders: 2 },
  { id: "CUS-003", name: "محمد حسن", email: "mohamed@example.com", status: "نشط", orders: 7 },
]

export default function CustomersManagement() {
  const [searchTerm, setSearchTerm] = useState("")
  const [customers, setCustomers] = useState(initialCustomers)
  const router = useRouter()

  const handleDelete = (id: string) => {
    setCustomers(customers.filter((c) => c.id !== id))
  }

  const filteredCustomers = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-brand-blue">إدارة العملاء</h1>
          <p className="text-muted-foreground mt-1">عرض وتعديل بيانات العملاء</p>
        </div>
      </div>

      {/* Search */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="relative flex-1">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="البحث عن عميل..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pr-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Customers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCustomers.map((c, index) => (
          <motion.div
            key={c.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-lg">{c.name}</CardTitle>
                <Badge variant={c.status === "نشط" ? "default" : "secondary"}>
                  {c.status}
                </Badge>
              </CardHeader>
              <CardContent>
                <p className="text-sm mb-2">{c.email}</p>
                <p className="text-sm mb-2">عدد الطلبات: {c.orders}</p>
                <div className="flex gap-2 mt-4">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1"
                    onClick={() => router.push(`/admin/customers/${c.id}`)}
                  >
                    <Eye className="h-4 w-4 ml-1" />
                    عرض
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1"
                    onClick={() => router.push(`/admin/customers/edit/${c.id}`)}
                  >
                    <Edit className="h-4 w-4 ml-1" />
                    تعديل
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-red-500 hover:text-red-600"
                    onClick={() => handleDelete(c.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
        <Card>
          <CardContent className="p-6 text-center">
            <Users className="h-8 w-8 text-brand-blue mx-auto mb-2" />
            <div className="text-2xl font-bold">{customers.length}</div>
            <div className="text-sm text-muted-foreground">إجمالي العملاء</div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}