"use client"

import type React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useCart } from "@/lib/CartProvider"
import Link from "next/link"
import { useState, useMemo } from "react"

interface CartDrawerProps {
  children: React.ReactNode
}

export function CartDrawer({ children }: CartDrawerProps) {
  const { items, updateQuantity, removeItem, loading } = useCart()
  const [isOpen, setIsOpen] = useState(false)

  // Calculate dynamic totals based on current quantities
  const { itemCount, subtotal, taxAmount, finalTotal } = useMemo(() => {
    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)
    const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
    const taxAmount = subtotal * 0.15
    const finalTotal = subtotal + taxAmount

    return {
      itemCount,
      subtotal,
      taxAmount,
      finalTotal
    }
  }, [items]) // Recalculate when items or quantities change

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent side="left" className="w-full sm:w-96 p-0">
        <div className="flex flex-col h-full">
          <SheetHeader className="p-6 border-b border-border">
            <SheetTitle className="text-xl font-bold text-right">سلة التسوق ({itemCount})</SheetTitle>
          </SheetHeader>

          {loading ? (
            <div className="flex-1 flex items-center justify-center p-6">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-sm text-muted-foreground">جاري تحميل السلة...</p>
              </div>
            </div>
          ) : !items || items.length === 0 ? (
            <div className="flex-1 flex items-center justify-center p-6">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
                  <ShoppingBag className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="font-semibold mb-2">السلة فارغة</h3>
                <p className="text-sm text-muted-foreground mb-4">ابدأ بإضافة المنتجات إلى سلتك</p>
                <Link href="/products" onClick={() => setIsOpen(false)}>
                  <Button variant="outline" size="sm">
                    تصفح المنتجات
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <>
              <ScrollArea className="flex-1 p-6">
                <div className="space-y-4">
                  <AnimatePresence>
                    {items.map((item, index) => (
                      <motion.div
                        key={item._id || `${item.productId}-${index}`}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        className="flex space-x-4 space-x-reverse p-4 bg-card rounded-lg border border-border"
                      >
                        {/* Product Image */}
                        <div className="w-16 h-16 rounded-md overflow-hidden flex-shrink-0">
                          <img
                            src={item.image || "/placeholder.svg"}
                            alt={item.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.src = "/placeholder.svg"
                            }}
                          />
                        </div>

                        {/* Product Details */}
                        <div className="flex-1 min-w-0">
                          {/* Category Badge */}
                          {item.selectedOptions?.category && (
                            <Badge variant="outline" className="mb-1 text-xs">
                              {item.selectedOptions.category}
                            </Badge>
                          )}
                          
                          <h4 className="font-semibold text-sm leading-tight mb-1 truncate">
                            {item.name || "منتج"}
                          </h4>
                          
                          {/* Price per unit */}
                          <div className="text-xs text-muted-foreground mb-1">
                            سعر الوحدة: {item.price.toFixed(2)} ر.س
                          </div>

                          {/* Item total */}
                          <div className="text-sm font-bold text-primary mb-2">
                            {(item.price * item.quantity).toFixed(2)} ر.س
                          </div>

                          {/* Selected Options */}
                          {item.selectedOptions && (
                            <div className="text-xs text-muted-foreground mb-2 space-y-1">
                              {item.selectedOptions.quantity && (
                                <div>الكمية: {item.selectedOptions.quantity} نسخة</div>
                              )}
                              {item.selectedOptions.size && (
                                <div>المقاس: {item.selectedOptions.size}</div>
                              )}
                              {item.selectedOptions.side && (
                                <div>الوجه: {item.selectedOptions.side}</div>
                              )}
                              {item.selectedOptions.material && (
                                <div>المادة: {item.selectedOptions.material}</div>
                              )}
                            </div>
                          )}

                          {/* Quantity Controls */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-1 space-x-reverse">
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() => updateQuantity(item.productId, Math.max(1, item.quantity - 1))}
                                disabled={item.quantity <= 1}
                                className="h-6 w-6"
                              >
                                <Minus className="h-3 w-3" />
                              </Button>
                              <span className="w-8 text-center text-sm font-semibold">{item.quantity}</span>
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                                className="h-6 w-6"
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                            </div>

                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => removeItem(item.productId)}
                              className="h-6 w-6 text-destructive hover:text-destructive hover:bg-destructive/10"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </ScrollArea>

              {/* Cart Footer */}
              <div className="border-t border-border p-6 space-y-4">
                {/* Price Breakdown */}
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>عدد المنتجات:</span>
                    <span>{items.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>إجمالي القطع:</span>
                    <span>{itemCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>المجموع الفرعي:</span>
                    <span>{subtotal.toFixed(2)} ر.س</span>
                  </div>
                  <div className="flex justify-between">
                    <span>ضريبة القيمة المضافة (15%):</span>
                    <span>{taxAmount.toFixed(2)} ر.س</span>
                  </div>
                </div>

                <Separator />

                {/* Total */}
                <div className="flex justify-between text-lg font-semibold">
                  <span>المجموع الكلي</span>
                  <span className="text-primary">{finalTotal.toFixed(2)} ر.س</span>
                </div>

                <Separator />

                {/* Action Buttons */}
                <div className="space-y-2">
                  <Link href="/cart" onClick={() => setIsOpen(false)}>
                    <Button variant="outline" size="lg" className="w-full bg-transparent">
                      عرض السلة الكاملة
                    </Button>
                  </Link>
                  <Link href="/checkout" onClick={() => setIsOpen(false)}>
                    <Button size="lg" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                      إتمام الشراء
                      <ArrowLeft className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>

                {/* Security Note */}
                <div className="text-center text-xs text-muted-foreground">دفع آمن ومحمي بتشفير SSL</div>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}