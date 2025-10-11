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
import { NextAuthProvider } from "@/lib/next-auth-provider"
import "./globals.css" // ✅ Uncommented this - this might be the main issue!

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
      <body className={`${notoSansArabic.variable} antialiased`}>
        <NextAuthProvider>
          <AdminAuthProvider>
            <AuthProvider>
              <CartProvider>
                <ToastProvider>
                  <Navbar />
                  <main className="min-h-screen">
                    <Suspense fallback={
                      <div className="flex justify-center items-center min-h-screen">
                        <div className="text-lg">جاري التحميل...</div>
                      </div>
                    }>
                      {children}
                    </Suspense>
                  </main>
                  <Footer />
                  <FloatingActionButton />
                  <ScrollToTop />
                  <Toaster />
                </ToastProvider>
              </CartProvider>
            </AuthProvider>
          </AdminAuthProvider>
        </NextAuthProvider>
      </body>
    </html>
  )
}