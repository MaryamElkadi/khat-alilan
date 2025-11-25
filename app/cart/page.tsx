"use client"

import { useCart } from "@/lib/CartProvider"
import { Trash2, Plus, Minus, ShoppingBag, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"
import { useMemo, useState } from "react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function CartPage() {
  const { items, removeItem, updateQuantity, loading } = useCart()
  const [updatingItems, setUpdatingItems] = useState<Set<string>>(new Set())
  const [error, setError] = useState<string | null>(null)

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
  }, [items])

  const handleUpdateQuantity = async (productId: string, newQuantity: number) => {
    try {
      setError(null)
      setUpdatingItems(prev => new Set(prev).add(productId))
      
      await updateQuantity(productId, newQuantity)
    } catch (error) {
      console.error("Failed to update quantity:", error)
      setError("فشل في تحديث الكمية. يرجى المحاولة مرة أخرى.")
    } finally {
      setUpdatingItems(prev => {
        const newSet = new Set(prev)
        newSet.delete(productId)
        return newSet
      })
    }
  }

  const handleRemoveItem = async (productId: string) => {
    try {
      setError(null)
      setUpdatingItems(prev => new Set(prev).add(productId))
      
      await removeItem(productId)
    } catch (error) {
      console.error("Failed to remove item:", error)
      setError("فشل في إزالة المنتج. يرجى المحاولة مرة أخرى.")
    } finally {
      setUpdatingItems(prev => {
        const newSet = new Set(prev)
        newSet.delete(productId)
        return newSet
      })
    }
  }

  const handleDecrement = (item: any) => {
    const newQuantity = Math.max(1, item.quantity - 1)
    handleUpdateQuantity(item.productId, newQuantity)
  }

  const handleIncrement = (item: any) => {
    handleUpdateQuantity(item.productId, item.quantity + 1)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white pt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-lg">جاري تحميل سلة التسوق...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white pt-20">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-8">
          <ShoppingBag className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">سلة التسوق</h1>
          {items.length > 0 && (
            <Badge variant="secondary" className="text-lg px-3 py-1">
              {items.length} منتج
            </Badge>
          )}
        </div>

        {/* Error Alert */}
        {error && (
          <Alert variant="destructive" className="mb-6 bg-red-900/20 border-red-800">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {items.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item, index) => {
                const isUpdating = updatingItems.has(item.productId)
                
                return (
                  <motion.div
                    key={item._id || `${item.productId}-${index}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="bg-gray-900/50 border-gray-700 hover:border-gray-600 transition-colors">
                      <CardContent className="p-6">
                        <div className="flex flex-col sm:flex-row gap-4">
                          {/* Product Image */}
                          <div className="flex-shrink-0">
                            <img
                              src={item.image || "/placeholder.svg"}
                              alt={item.name}
                              className="w-20 h-20 object-cover rounded-lg"
                              onError={(e) => {
                                e.currentTarget.src = "/placeholder.svg"
                              }}
                            />
                          </div>

                          {/* Product Info */}
                          <div className="flex-grow">
                            <h3 className="text-xl font-semibold mb-2">{item.name}</h3>
                            
                            {/* Selected Options */}
                            {item.selectedOptions && (
                              <div className="space-y-1 mb-3">
                                {item.selectedOptions.quantity && (
                                  <p className="text-sm text-gray-400">
                                    الكمية: {item.selectedOptions.quantity} نسخة
                                  </p>
                                )}
                                {item.selectedOptions.size && (
                                  <p className="text-sm text-gray-400">
                                    المقاس: {item.selectedOptions.size}
                                  </p>
                                )}
                                {item.selectedOptions.side && (
                                  <p className="text-sm text-gray-400">
                                    الوجه: {item.selectedOptions.side}
                                  </p>
                                )}
                                {item.selectedOptions.material && (
                                  <p className="text-sm text-gray-400">
                                    المادة: {item.selectedOptions.material}
                                  </p>
                                )}
                              </div>
                            )}

                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4">
                                {/* Quantity Controls */}
                                <div className="flex items-center gap-2">
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => handleDecrement(item)}
                                    disabled={isUpdating || item.quantity <= 1}
                                    className="h-8 w-8 border-gray-600 hover:bg-gray-800 disabled:opacity-50"
                                  >
                                    {isUpdating ? (
                                      <div className="animate-spin h-3 w-3 border border-white border-t-transparent rounded-full" />
                                    ) : (
                                      <Minus className="h-3 w-3" />
                                    )}
                                  </Button>
                                  
                                  <span className={`w-8 text-center font-medium ${isUpdating ? 'opacity-50' : ''}`}>
                                    {item.quantity}
                                  </span>
                                  
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => handleIncrement(item)}
                                    disabled={isUpdating}
                                    className="h-8 w-8 border-gray-600 hover:bg-gray-800 disabled:opacity-50"
                                  >
                                    {isUpdating ? (
                                      <div className="animate-spin h-3 w-3 border border-white border-t-transparent rounded-full" />
                                    ) : (
                                      <Plus className="h-3 w-3" />
                                    )}
                                  </Button>
                                </div>

                                {/* Unit Price */}
                                <div className="text-lg font-semibold">
                                  {item.price.toFixed(2)} ر.س
                                  <span className="text-sm text-gray-400 block">للوحدة</span>
                                </div>
                              </div>

                              {/* Remove Button */}
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() => handleRemoveItem(item.productId)}
                                disabled={isUpdating}
                                className="text-red-500 border-red-500 hover:bg-red-500 hover:text-white transition-colors disabled:opacity-50"
                              >
                                {isUpdating ? (
                                  <div className="animate-spin h-4 w-4 border border-red-500 border-t-transparent rounded-full" />
                                ) : (
                                  <Trash2 className="h-4 w-4" />
                                )}
                              </Button>
                            </div>

                            {/* Subtotal for this item */}
                            <div className="text-right mt-2">
                              <p className="text-sm text-gray-400">
                                المجموع: <span className="font-semibold text-white">{(item.price * item.quantity).toFixed(2)} ر.س</span>
                              </p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )
              })}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="bg-gray-900/50 border-gray-700 sticky top-8">
                <CardHeader>
                  <CardTitle className="text-xl">ملخص الطلب</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Items Count */}
                  <div className="flex justify-between text-sm">
                    <span>عدد المنتجات:</span>
                    <span>{items.length}</span>
                  </div>

                  {/* Total Items */}
                  <div className="flex justify-between text-sm">
                    <span>إجمالي القطع:</span>
                    <span>{itemCount}</span>
                  </div>

                  {/* Subtotal */}
                  <div className="flex justify-between text-sm">
                    <span>المجموع الفرعي:</span>
                    <span>{subtotal.toFixed(2)} ر.س</span>
                  </div>

                  {/* Tax */}
                  <div className="flex justify-between text-sm">
                    <span>ضريبة القيمة المضافة (15%):</span>
                    <span>{taxAmount.toFixed(2)} ر.س</span>
                  </div>

                  {/* Divider */}
                  <div className="border-t border-gray-700 pt-2"></div>

                  {/* Total */}
                  <div className="flex justify-between text-lg font-bold">
                    <span>المجموع الكلي:</span>
                    <span className="text-primary">{finalTotal.toFixed(2)} ر.س</span>
                  </div>

                  {/* Checkout Button */}
                  <Button 
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-3 text-lg mt-4"
                    size="lg"
                    disabled={updatingItems.size > 0}
                  >
                    {updatingItems.size > 0 ? "جاري التحديث..." : "اتمام الشراء"}
                  </Button>

                  {/* Continue Shopping */}
                  <Button 
                    variant="outline" 
                    className="w-full border-gray-600 text-gray-300 hover:bg-gray-800 mt-2"
                    onClick={() => window.history.back()}
                    disabled={updatingItems.size > 0}
                  >
                    متابعة التسوق
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        ) : (
          <Card className="bg-gray-900/50 border-gray-700">
            <CardContent className="p-12 text-center">
              <ShoppingBag className="h-16 w-16 text-gray-500 mx-auto mb-4" />
              <h3 className="text-2xl font-semibold mb-2">سلة التسوق فارغة</h3>
              <p className="text-gray-400 mb-6">لم تقم بإضافة أي منتجات إلى سلة التسوق بعد</p>
              <div className="flex gap-4 justify-center">
                <Button 
                  className="bg-primary hover:bg-primary/90"
                  onClick={() => window.location.href = '/products'}
                >
                  تصفح المنتجات
                </Button>
                <Button 
                  variant="outline"
                  className="border-gray-600 text-gray-300 hover:bg-gray-800"
                  onClick={() => window.history.back()}
                >
                  العودة للخلف
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}