"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { User, Mail, Phone, Edit, Save, X } from "lucide-react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { useAuth } from "@/lib/auth-context"
import { useToast } from "@/hooks/use-toast"
import { AuthModal } from "@/components/auth-modal"

export default function ProfilePage() {
  const { state, updateProfile } = useAuth()
  const { toast } = useToast()
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: state.user?.name || "",
    email: state.user?.email || "",
    phone: state.user?.phone || "",
  })

  if (!state.isAuthenticated || !state.user) {
    return (
      <div className="min-h-screen bg-background">
       
        <main className="pt-8">
          <div className="container mx-auto px-4 py-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center max-w-md mx-auto"
            >
              <h1 className="text-3xl font-bold mb-4 text-foreground">يجب تسجيل الدخول</h1>
              <p className="text-muted-foreground mb-8 leading-relaxed">
                يجب عليك تسجيل الدخول أولاً للوصول إلى الملف الشخصي
              </p>
              <AuthModal>
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                  تسجيل الدخول
                </Button>
              </AuthModal>
            </motion.div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

 const handleSave = async () => {
  try {
    const res = await fetch(`/api/users/${state.user._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (!res.ok) throw new Error("Failed to update profile");

    const updatedUser = await res.json();
    updateProfile(updatedUser); // keep your auth-context in sync
    setIsEditing(false);

    toast({
      title: "تم حفظ التغييرات",
      description: "تم تحديث الملف الشخصي بنجاح",
    });
  } catch (err) {
    toast({
      title: "خطأ",
      description: "تعذر تحديث الملف الشخصي",
      variant: "destructive",
    });
  }
};


  const handleCancel = () => {
    setFormData({
      name: state.user?.name || "",
      email: state.user?.email || "",
      phone: state.user?.phone || "",
    })
    setIsEditing(false)
  }

  return (
    <div className="min-h-screen bg-background">


      <main className="pt-8">
        {/* Header */}
        <section className="py-12 bg-muted/30">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                <span className="text-brand-yellow">الملف</span> <span className="text-brand-blue">الشخصي</span>
              </h1>
              <p className="text-xl text-muted-foreground">إدارة معلوماتك الشخصية وإعداداتك</p>
            </motion.div>
          </div>
        </section>

        {/* Profile Content */}
        <section className="py-12">
          <div className="container mx-auto px-4 max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card className="border-0 shadow-lg">
                <CardHeader className="text-center pb-6">
                  <div className="flex justify-center mb-4">
                    <Avatar className="h-24 w-24">
                      <AvatarImage src="/placeholder.svg" alt={state.user.name} />
                      <AvatarFallback className="bg-primary/10 text-primary font-bold text-2xl">
                        {state.user.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <CardTitle className="text-2xl font-bold text-foreground">{state.user.name}</CardTitle>
                  <p className="text-muted-foreground">{state.user.email}</p>
                </CardHeader>

                <CardContent className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-foreground">المعلومات الشخصية</h3>
                    {!isEditing ? (
                      <Button variant="outline" size="sm" onClick={() => setIsEditing(true)} className="bg-transparent">
                        <Edit className="h-4 w-4 ml-2" />
                        تعديل
                      </Button>
                    ) : (
                      <div className="flex space-x-2 space-x-reverse">
                        <Button variant="outline" size="sm" onClick={handleCancel} className="bg-transparent">
                          <X className="h-4 w-4 ml-2" />
                          إلغاء
                        </Button>
                        <Button size="sm" onClick={handleSave} className="bg-primary hover:bg-primary/90">
                          <Save className="h-4 w-4 ml-2" />
                          حفظ
                        </Button>
                      </div>
                    )}
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">الاسم الكامل</Label>
                      <div className="relative">
                        <User className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                        <Input
                          id="name"
                          type="text"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="pr-10 text-right"
                          disabled={!isEditing}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">البريد الإلكتروني</Label>
                      <div className="relative">
                        <Mail className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="pr-10 text-right"
                          disabled={!isEditing}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">رقم الهاتف</Label>
                      <div className="relative">
                        <Phone className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                        <Input
                          id="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className="pr-10 text-right"
                          disabled={!isEditing}
                          placeholder="أدخل رقم هاتفك"
                        />
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h4 className="font-semibold text-foreground">إحصائيات الحساب</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-4 bg-muted/30 rounded-lg">
                        <div className="text-2xl font-bold text-primary">0</div>
                        <div className="text-sm text-muted-foreground">الطلبات المكتملة</div>
                      </div>
                      <div className="text-center p-4 bg-muted/30 rounded-lg">
                        <div className="text-2xl font-bold text-primary">0 ر.س</div>
                        <div className="text-sm text-muted-foreground">إجمالي المشتريات</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
