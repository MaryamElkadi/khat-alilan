import type React from "react"
import type { Metadata } from "next"
import { Noto_Sans_Arabic } from "next/font/google"
import { Suspense } from "react"
import { CartProvider } from "@/lib/CartProvider"
import { AuthProvider } from "@/lib/auth-context"
import { AdminAuthProvider } from "@/lib/admin-auth"
import { Toaster } from "@/components/ui/toaster"
import { FloatingActionButton } from "@/components/floating-action-button"
import { ScrollToTop } from "@/components/scroll-to-top"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { ToastProvider } from "@/components/ToastProvider"
import "./globals.css"
// 👇 استيراد مزود NextAuth
import { NextAuthProvider } from "@/lib/next-auth-provider" 

const notoSansArabic = Noto_Sans_Arabic({
  subsets: ["arabic"],
  variable: "--font-arabic",
  display: "swap",
})

export const metadata: Metadata = {
  title: "خط الإعلان - شركة الإعلان والتسويق",
  description: "شركة خط الإعلان للخدمات الإعلانية والتسويقية المتميزة",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ar" dir="rtl" className="dark">
      <body className={`font-arabic ${notoSansArabic.variable} antialiased`}>
        {/* 👇 تغليف التطبيق بمزود NextAuth */}
        <NextAuthProvider> 
          <AdminAuthProvider>
            <AuthProvider>
              <CartProvider>
                <Navbar />
                <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
                <Footer />
                <Toaster />
                <FloatingActionButton />
                <ScrollToTop />
                <ToastProvider />
              </CartProvider>
            </AuthProvider>
          </AdminAuthProvider>
        </NextAuthProvider>
      </body>
    </html>
  )
}