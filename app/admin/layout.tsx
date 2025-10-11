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
import "@/styles/globals.css" // ✅ Fixed import path

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

// Add this client component for hydration handling
function ClientBody({ children }: { children: React.ReactNode }) {
  return (
    <body className={`${notoSansArabic.variable} antialiased`}>
      <NextAuthProvider>
        <AdminAuthProvider>
          <AuthProvider>
            <CartProvider>
              <ToastProvider>
                <Navbar />
                <main className="min-h-screen">
                  {children}
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
  )
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ar" dir="rtl">
      <ClientBody>{children}</ClientBody>
    </html>
  )
}