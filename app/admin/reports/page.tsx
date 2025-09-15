"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis } from "recharts"

export default function ReportsManagement() {
  const [salesData, setSalesData] = useState<any[]>([])
  const [categoryData, setCategoryData] = useState<any[]>([])
  const COLORS = ["#0088FE", "#FF8042", "#00C49F"]

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await fetch("/api/reports")
        const data = await res.json()
        setSalesData(data.salesData)
        setCategoryData(data.categoryData)
      } catch (error) {
        console.error("Error fetching reports:", error)
      }
    }
    fetchReports()
  }, [])

  return (
    <div>
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
