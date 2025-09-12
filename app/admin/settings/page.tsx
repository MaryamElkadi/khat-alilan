"use client"

import { useState } from "react"
//import Navbar from "@/components/Navbar"
import { Button } from "@/components/ui/button"

export default function SettingsManagement() {
  const [settings, setSettings] = useState({
    siteName: "خط الإعلان",
    email: "info@khat.com",
    phone: "+20123456789",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSettings({ ...settings, [e.target.name]: e.target.value })
  }

  const saveSettings = () => {
    alert("✅ تم حفظ الإعدادات بنجاح")
  }

  return (
    <div>
      {/* <Navbar /> */}
      <main className="p-6 max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">⚙️ إدارة الإعدادات</h1>

        <div className="space-y-4">
          <div>
            <label className="block mb-2 font-semibold">اسم الموقع</label>
            <input
              type="text"
              name="siteName"
              value={settings.siteName}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg"
            />
          </div>

          <div>
            <label className="block mb-2 font-semibold">البريد الإلكتروني</label>
            <input
              type="email"
              name="email"
              value={settings.email}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg"
            />
          </div>

          <div>
            <label className="block mb-2 font-semibold">رقم الهاتف</label>
            <input
              type="text"
              name="phone"
              value={settings.phone}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg"
            />
          </div>
        </div>

        <div className="mt-6 flex gap-4">
          <Button onClick={saveSettings}>💾 حفظ</Button>
          <Button variant="secondary">❌ إلغاء</Button>
        </div>
      </main>
    </div>
  )
}