"use client"

import { motion } from "framer-motion"
import { User, Bell, Shield, Globe, Moon } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"

export default function SettingsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        <h1 className="text-3xl font-bold mb-8 text-right">الإعدادات</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Profile Settings */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-right">
                  <User className="h-5 w-5" />
                  معلومات الملف الشخصي
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-right">
                    الاسم الكامل
                  </Label>
                  <Input id="name" defaultValue="أحمد محمد" className="text-right" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-right">
                    البريد الإلكتروني
                  </Label>
                  <Input id="email" type="email" defaultValue="ahmed@example.com" className="text-right" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-right">
                    رقم الهاتف
                  </Label>
                  <Input id="phone" defaultValue="+966 50 123 4567" className="text-right" />
                </div>
                <Button className="w-full bg-brand-blue hover:bg-brand-blue/90">حفظ التغييرات</Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Notification Settings */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-right">
                  <Bell className="h-5 w-5" />
                  إعدادات الإشعارات
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <Switch id="email-notifications" />
                  <Label htmlFor="email-notifications" className="text-right">
                    إشعارات البريد الإلكتروني
                  </Label>
                </div>
                <div className="flex items-center justify-between">
                  <Switch id="sms-notifications" />
                  <Label htmlFor="sms-notifications" className="text-right">
                    إشعارات الرسائل النصية
                  </Label>
                </div>
                <div className="flex items-center justify-between">
                  <Switch id="order-updates" defaultChecked />
                  <Label htmlFor="order-updates" className="text-right">
                    تحديثات الطلبات
                  </Label>
                </div>
                <div className="flex items-center justify-between">
                  <Switch id="marketing-emails" />
                  <Label htmlFor="marketing-emails" className="text-right">
                    رسائل تسويقية
                  </Label>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Security Settings */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-right">
                  <Shield className="h-5 w-5" />
                  الأمان والخصوصية
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button variant="outline" className="w-full bg-transparent">
                  تغيير كلمة المرور
                </Button>
                <Button variant="outline" className="w-full bg-transparent">
                  تفعيل المصادقة الثنائية
                </Button>
                <Separator />
                <div className="flex items-center justify-between">
                  <Switch id="profile-visibility" defaultChecked />
                  <Label htmlFor="profile-visibility" className="text-right">
                    إظهار الملف الشخصي
                  </Label>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* App Preferences */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-right">
                  <Globe className="h-5 w-5" />
                  تفضيلات التطبيق
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <Switch id="dark-mode" />
                  <Label htmlFor="dark-mode" className="text-right flex items-center gap-2">
                    <Moon className="h-4 w-4" />
                    الوضع المظلم
                  </Label>
                </div>
                <div className="space-y-2">
                  <Label className="text-right">اللغة</Label>
                  <select className="w-full p-2 border rounded-md text-right">
                    <option value="ar">العربية</option>
                    <option value="en">English</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label className="text-right">العملة</Label>
                  <select className="w-full p-2 border rounded-md text-right">
                    <option value="sar">ريال سعودي (ر.س)</option>
                    <option value="usd">دولار أمريكي ($)</option>
                  </select>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}
