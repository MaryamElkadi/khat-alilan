"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Eye, EyeOff, Lock, Mail, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAdminAuth } from "@/lib/admin-auth"
import { useRouter } from "next/navigation"
import { signIn } from "next-auth/react"
import { FcGoogle } from "react-icons/fc"
import { FaFacebook } from "react-icons/fa"
export function AdminLoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const { login, isLoading } = useAdminAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    const success = await login(email, password)
    if (success) {
      router.push("/")
    } else {
      setError("بيانات الدخول غير صحيحة")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-brand-blue/10 via-background to-brand-yellow/10 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="border-0 shadow-2xl">
          <CardHeader className="text-center space-y-4">
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
              className="mx-auto w-16 h-16 bg-gradient-to-r from-brand-blue to-brand-yellow rounded-full flex items-center justify-center"
            >
              <Shield className="h-8 w-8 text-white" />
            </motion.div>
            <CardTitle className="text-2xl font-bold text-brand-blue">تسجيل الدخول</CardTitle>
            <CardDescription className="text-muted-foreground">ادخل بياناتك للوصول إلى لوحة التحكم</CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-right block">
                  البريد الإلكتروني
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 text-right"
                    placeholder="admin@khat-al-ilan.com"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-right block">
                  كلمة المرور
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10 text-right"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </button>
                </div>
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-500 text-sm text-center bg-red-50 p-2 rounded"
                >
                  {error}
                </motion.div>
              )}

              <Button
                type="submit"
                className="w-full bg-brand-blue hover:bg-brand-blue/90 text-white"
                disabled={isLoading}
              >
                {isLoading ? "جاري تسجيل الدخول..." : "تسجيل الدخول"}
              </Button>
              <div className="mt-6 text-center">
  <p className="text-sm text-muted-foreground">
    ليس لديك حساب؟{" "}
    <button
      onClick={() => router.push("/register")}
      className="text-brand-blue font-semibold hover:underline"
    >
      سجل الآن
    </button>
  </p>
</div>

<div className="mt-6 space-y-3">
  <Button
    type="button"
    variant="outline"
    className="w-full flex items-center justify-center gap-2"
    onClick={() => signIn("google", { callbackUrl: "/" })}
  >
    <FcGoogle className="h-5 w-5" />
    متابعة باستخدام Google
  </Button>

  <Button
    type="button"
    variant="outline"
    className="w-full flex items-center justify-center gap-2"
    onClick={() => signIn("facebook", { callbackUrl: "/" })}
  >
    <FaFacebook className="h-5 w-5 text-blue-600" />
    متابعة باستخدام Facebook
  </Button>
</div>
            </form>

            <div className="mt-6 p-4 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground text-center mb-2">بيانات تجريبية:</p>
              <div className="text-xs space-y-1 text-center">
                <p>
                  <strong>المدير:</strong> admin@khat-al-ilan.com / admin123
                </p>
                <p>
                  <strong>مستخدم عادي:</strong> أي بريد إلكتروني وكلمة مرور
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
