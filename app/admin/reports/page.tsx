"use client"

import { Card, CardContent } from "@/components/ui/card"
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis } from "recharts"
//import Navbar from "@/components/Navbar"

export default function ReportsManagement() {
  const salesData = [
    { name: "يناير", value: 400 },
    { name: "فبراير", value: 300 },
    { name: "مارس", value: 600 },
    { name: "أبريل", value: 800 },
  ]

  const categoryData = [
    { name: "ملابس", value: 45 },
    { name: "إلكترونيات", value: 30 },
    { name: "أطعمة", value: 25 },
  ]

  const COLORS = ["#0088FE", "#FF8042", "#00C49F"]

  return (
    <div>
      {/* //<Navbar /> */}
      <main className="p-6 max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">📊 لوحة التقارير</h1>
        <div className="grid md:grid-cols-2 gap-6">
          {/* مبيعات شهرية */}
          <Card>
            <CardContent>
              <h2 className="text-xl font-semibold mb-4">المبيعات الشهرية</h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={salesData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#8884d8" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* توزيع التصنيفات */}
          <Card>
            <CardContent>
              <h2 className="text-xl font-semibold mb-4">نسبة المبيعات حسب التصنيفات</h2>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
