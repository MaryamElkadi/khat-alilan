"use client"

import { motion } from "framer-motion"
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft } from "lucide-react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { useCart } from "@/lib/cart-context"
import Link from "next/link"

export default function CartPage() {
  const { state, dispatch } = useCart()

  const updateQuantity = (id: string, quantity: number) => {
    dispatch({ type: "UPDATE_QUANTITY", payload: { id, quantity } })
  }

  const removeItem = (id: string) => {
    dispatch({ type: "REMOVE_ITEM", payload: id })
  }

  const clearCart = () => {
    dispatch({ type: "CLEAR_CART" })
  }

  if (state.items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-8">
          <div className="container mx-auto px-4 py-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center max-w-md mx-auto"
            >
              <div className="w-24 h-24 mx-auto mb-6 bg-muted rounded-full flex items-center justify-center">
                <ShoppingBag className="h-12 w-12 text-muted-foreground" />
              </div>
              <h1 className="text-3xl font-bold mb-4 text-foreground">السلة فارغة</h1>
              <p className="text-muted-foreground mb-8 leading-relaxed">
                لم تقم بإضافة أي منتجات إلى سلة التسوق بعد. ابدأ التسوق الآن واكتشف منتجاتنا المميزة.
              </p>
              <Link href="/products">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                  <ArrowLeft className="ml-2 h-5 w-5" />
                  تصفح المنتجات
                </Button>
              </Link>
            </motion.div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

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
                <span className="text-brand-yellow">سلة</span> <span className="text-brand-blue">التسوق</span>
              </h1>
              <p className="text-xl text-muted-foreground">راجع منتجاتك المختارة واكمل عملية الشراء</p>
            </motion.div>
          </div>
        </section>

        {/* Cart Content */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-foreground">المنتجات ({state.itemCount})</h2>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={clearCart}
                      className="text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground bg-transparent"
                    >
                      <Trash2 className="h-4 w-4 ml-2" />
                      إفراغ السلة
                    </Button>
                  </div>

                  <div className="space-y-4">
                    {state.items.map((item, index) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: index * 0.1 }}
                        exit={{ opacity: 0, x: -100 }}
                      >
                        <Card className="overflow-hidden border-0 shadow-md hover:shadow-lg transition-all duration-300">
                          <CardContent className="p-0">
                            <div className="flex flex-col sm:flex-row">
                              {/* Product Image */}
                              <div className="sm:w-32 sm:h-32 w-full h-48 relative overflow-hidden">
                                <img
                                  src={item.image || "/placeholder.svg"}
                                  alt={item.title}
                                  className="w-full h-full object-cover"
                                />
                              </div>

                              {/* Product Details */}
                              <div className="flex-1 p-6">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between h-full">
                                  <div className="flex-1 mb-4 sm:mb-0">
                                    <Badge variant="outline" className="mb-2 text-xs">
                                      {item.category}
                                    </Badge>
                                    <h3 className="font-bold text-lg mb-2 text-foreground leading-tight">
                                      {item.title}
                                    </h3>
                                    <p className="text-muted-foreground text-sm leading-relaxed">{item.description}</p>
                                  </div>

                                  {/* Quantity and Price Controls */}
                                  <div className="flex flex-col sm:items-end space-y-4">
                                    {/* Quantity Controls */}
                                    <div className="flex items-center space-x-2 space-x-reverse">
                                      <Button
                                        variant="outline"
                                        size="icon"
                                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                        disabled={item.quantity <= 1}
                                        className="h-8 w-8"
                                      >
                                        <Minus className="h-3 w-3" />
                                      </Button>
                                      <span className="w-12 text-center font-semibold">{item.quantity}</span>
                                      <Button
                                        variant="outline"
                                        size="icon"
                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                        className="h-8 w-8"
                                      >
                                        <Plus className="h-3 w-3" />
                                      </Button>
                                    </div>

                                    {/* Price */}
                                    <div className="text-left sm:text-right">
                                      <div className="text-2xl font-bold text-primary">
                                        {(item.price * item.quantity).toLocaleString()} ر.س
                                      </div>
                                      {item.quantity > 1 && (
                                        <div className="text-sm text-muted-foreground">
                                          {item.price.toLocaleString()} ر.س × {item.quantity}
                                        </div>
                                      )}
                                    </div>

                                    {/* Remove Button */}
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => removeItem(item.id)}
                                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                    >
                                      <Trash2 className="h-4 w-4 ml-2" />
                                      إزالة
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="sticky top-8"
                >
                  <Card className="border-0 shadow-lg">
                    <CardHeader>
                      <CardTitle className="text-xl font-bold text-foreground">ملخص الطلب</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Items Summary */}
                      <div className="space-y-2">
                        {state.items.map((item) => (
                          <div key={item.id} className="flex justify-between text-sm">
                            <span className="text-muted-foreground">
                              {item.title} × {item.quantity}
                            </span>
                            <span className="font-medium">{(item.price * item.quantity).toLocaleString()} ر.س</span>
                          </div>
                        ))}
                      </div>

                      <Separator />

                      {/* Subtotal */}
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">المجموع الفرعي</span>
                        <span className="font-semibold">{state.total.toLocaleString()} ر.س</span>
                      </div>

                      {/* Tax */}
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">ضريبة القيمة المضافة (15%)</span>
                        <span className="font-semibold">{(state.total * 0.15).toLocaleString()} ر.س</span>
                      </div>

                      {/* Shipping */}
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">الشحن</span>
                        <span className="font-semibold text-green-600">مجاني</span>
                      </div>

                      <Separator />

                      {/* Total */}
                      <div className="flex justify-between text-lg">
                        <span className="font-bold text-foreground">المجموع الكلي</span>
                        <span className="font-bold text-primary">{(state.total * 1.15).toLocaleString()} ر.س</span>
                      </div>

                      {/* Checkout Button */}
                      <div className="pt-4">
                        <Link href="/checkout">
                          <Button size="lg" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                            متابعة إلى الدفع
                            <ArrowLeft className="ml-2 h-5 w-5" />
                          </Button>
                        </Link>
                      </div>

                      {/* Continue Shopping */}
                      <Link href="/products">
                        <Button variant="outline" size="lg" className="w-full bg-transparent">
                          متابعة التسوق
                        </Button>
                      </Link>

                      {/* Security Badge */}
                      <div className="pt-4 text-center">
                        <div className="flex items-center justify-center space-x-2 space-x-reverse text-sm text-muted-foreground">
                          <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                          <span>دفع آمن ومحمي</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
