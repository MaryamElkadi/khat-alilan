"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { ArrowRight, CreditCard, Truck, Shield, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { useCart } from "@/lib/CartProvider"
import { useAdminAuth } from "@/lib/admin-auth" // Fixed import
import { useRouter } from "next/navigation"
import { toast } from "react-toastify"

export default function CheckoutPage() {
  const { items, total, clearCart } = useCart()
  const { user } = useAdminAuth() // Use the correct auth hook
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [paymentMethod, setPaymentMethod] = useState("card")
  const [isProcessing, setIsProcessing] = useState(false)
  const [orderComplete, setOrderComplete] = useState(false)

  const [shippingInfo, setShippingInfo] = useState({
    firstName: "",
    lastName: "",
    email: user?.email || "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
    country: "السعودية",
  })

  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardName: "",
  })

  const subtotal = total
  const shipping = 25
  const tax = subtotal * 0.15
  const finalTotal = subtotal + shipping + tax

  const handleInputChange = (section: "shipping" | "payment", field: string, value: string) => {
    if (section === "shipping") {
      setShippingInfo((prev) => ({ ...prev, [field]: value }))
    } else {
      setPaymentInfo((prev) => ({ ...prev, [field]: value }))
    }
  }

  const handlePlaceOrder = async () => {
    setIsProcessing(true)

    try {
      // Check if user is logged in
      if (!user?.id) {
        toast.error("يجب تسجيل الدخول أولاً")
        router.push("/login")
        return
      }

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user: user.id, // ✅ User ID from auth
          items: items.map((item) => ({
            product: item._id,
            modelType: "Product", // ✅ Specify model type
            name: item.name,
            price: item.price,
            quantity: item.quantity,
          })),
          shippingInfo: shippingInfo,
          paymentMethod: paymentMethod,
          totalAmount: finalTotal, // ✅ Use totalAmount instead of total
        }),
      })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.error || "Failed to place order")
      }

      const data = await res.json()
      console.log("Order saved:", data)

      // Show success message
      toast.success("🎉 تم تأكيد طلبك بنجاح! سيتم التواصل معك قريباً")

      setOrderComplete(true)
      clearCart()

      // Redirect to home after 2 seconds
      setTimeout(() => {
        router.push("/")
      }, 2000)

    } catch (error: any) {
      console.error("Checkout error:", error)
      toast.error(error.message || "حدث خطأ أثناء إتمام الطلب")
    } finally {
      setIsProcessing(false)
    }
  }

  if (items.length === 0 && !orderComplete) {
    return (
      <div className="min-h-screen bg-background pt-20">
        <div className="container mx-auto px-4 py-16 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-md mx-auto">
            <h1 className="text-2xl font-bold mb-4">السلة فارغة</h1>
            <p className="text-muted-foreground mb-6">لا توجد منتجات في سلة التسوق</p>
            <Button
              onClick={() => router.push("/products")}
              className="bg-brand-yellow text-black hover:bg-brand-yellow/90"
            >
              تصفح المنتجات
            </Button>
          </motion.div>
        </div>
      </div>
    )
  }

  if (orderComplete) {
    return (
      <div className="min-h-screen bg-background pt-20">
        <div className="container mx-auto px-4 py-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-2xl mx-auto text-center"
          >
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-6" />
            <h1 className="text-3xl font-bold mb-4">تم تأكيد طلبك بنجاح!</h1>
            <p className="text-muted-foreground mb-8">
              شكراً لك على ثقتك بنا. سيتم التواصل معك قريباً لتأكيد تفاصيل التسليم.
            </p>
            <div className="flex gap-4 justify-center">
              <Button onClick={() => router.push("/")} variant="outline">
                العودة للرئيسية
              </Button>
              <Button
                onClick={() => router.push("/products")}
                className="bg-brand-yellow text-black hover:bg-brand-yellow/90"
              >
                متابعة التسوق
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background pt-20">
      <div className="container mx-auto px-4 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-6xl mx-auto">
          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-center space-x-4 space-x-reverse">
              {[
                { number: 1, title: "معلومات الشحن" },
                { number: 2, title: "طريقة الدفع" },
                { number: 3, title: "مراجعة الطلب" },
              ].map((stepItem, index) => (
                <div key={stepItem.number} className="flex items-center">
                  <div
                    className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                      step >= stepItem.number
                        ? "bg-brand-yellow border-brand-yellow text-black"
                        : "border-muted-foreground text-muted-foreground"
                    }`}
                  >
                    {stepItem.number}
                  </div>
                  <span className={`mr-2 ${step >= stepItem.number ? "text-foreground" : "text-muted-foreground"}`}>
                    {stepItem.title}
                  </span>
                  {index < 2 && <ArrowRight className="h-4 w-4 mx-4 text-muted-foreground" />}
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {step === 1 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Truck className="h-5 w-5" />
                      معلومات الشحن
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName">الاسم الأول</Label>
                        <Input
                          id="firstName"
                          value={shippingInfo.firstName}
                          onChange={(e) => handleInputChange("shipping", "firstName", e.target.value)}
                          className="text-right"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="lastName">اسم العائلة</Label>
                        <Input
                          id="lastName"
                          value={shippingInfo.lastName}
                          onChange={(e) => handleInputChange("shipping", "lastName", e.target.value)}
                          className="text-right"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="email">البريد الإلكتروني</Label>
                      <Input
                        id="email"
                        type="email"
                        value={shippingInfo.email}
                        onChange={(e) => handleInputChange("shipping", "email", e.target.value)}
                        className="text-right"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">رقم الهاتف</Label>
                      <Input
                        id="phone"
                        value={shippingInfo.phone}
                        onChange={(e) => handleInputChange("shipping", "phone", e.target.value)}
                        className="text-right"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="address">العنوان</Label>
                      <Input
                        id="address"
                        value={shippingInfo.address}
                        onChange={(e) => handleInputChange("shipping", "address", e.target.value)}
                        className="text-right"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="city">المدينة</Label>
                        <Input
                          id="city"
                          value={shippingInfo.city}
                          onChange={(e) => handleInputChange("shipping", "city", e.target.value)}
                          className="text-right"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="postalCode">الرمز البريدي</Label>
                        <Input
                          id="postalCode"
                          value={shippingInfo.postalCode}
                          onChange={(e) => handleInputChange("shipping", "postalCode", e.target.value)}
                          className="text-right"
                        />
                      </div>
                      <div>
                        <Label htmlFor="country">البلد</Label>
                        <Input
                          id="country"
                          value={shippingInfo.country}
                          onChange={(e) => handleInputChange("shipping", "country", e.target.value)}
                          className="text-right"
                          required
                        />
                      </div>
                    </div>
                    <Button
                      onClick={() => setStep(2)}
                      className="w-full bg-brand-yellow text-black hover:bg-brand-yellow/90"
                    >
                      متابعة إلى الدفع
                    </Button>
                  </CardContent>
                </Card>
              )}

              {step === 2 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CreditCard className="h-5 w-5" />
                      طريقة الدفع
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                      <div className="flex items-center space-x-2 space-x-reverse">
                        <RadioGroupItem value="card" id="card" />
                        <Label htmlFor="card">بطاقة ائتمان</Label>
                      </div>
                      <div className="flex items-center space-x-2 space-x-reverse">
                        <RadioGroupItem value="cash" id="cash" />
                        <Label htmlFor="cash">الدفع عند الاستلام</Label>
                      </div>
                    </RadioGroup>

                    {paymentMethod === "card" && (
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="cardName">اسم حامل البطاقة</Label>
                          <Input
                            id="cardName"
                            value={paymentInfo.cardName}
                            onChange={(e) => handleInputChange("payment", "cardName", e.target.value)}
                            className="text-right"
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="cardNumber">رقم البطاقة</Label>
                          <Input
                            id="cardNumber"
                            placeholder="1234 5678 9012 3456"
                            value={paymentInfo.cardNumber}
                            onChange={(e) => handleInputChange("payment", "cardNumber", e.target.value)}
                            className="text-right"
                            required
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="expiryDate">تاريخ الانتهاء</Label>
                            <Input
                              id="expiryDate"
                              placeholder="MM/YY"
                              value={paymentInfo.expiryDate}
                              onChange={(e) => handleInputChange("payment", "expiryDate", e.target.value)}
                              className="text-right"
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor="cvv">CVV</Label>
                            <Input
                              id="cvv"
                              placeholder="123"
                              value={paymentInfo.cvv}
                              onChange={(e) => handleInputChange("payment", "cvv", e.target.value)}
                              className="text-right"
                              required
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="flex gap-4">
                      <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
                        العودة
                      </Button>
                      <Button
                        onClick={() => setStep(3)}
                        className="flex-1 bg-brand-yellow text-black hover:bg-brand-yellow/90"
                      >
                        مراجعة الطلب
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {step === 3 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="h-5 w-5" />
                      مراجعة الطلب
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Order Items */}
                    <div>
                      <h3 className="font-semibold mb-4">المنتجات المطلوبة</h3>
                      <div className="space-y-3">
                        {items.map((item) => (
                          <div key={item.id} className="flex justify-between items-center py-2 border-b">
                            <div>
                              <p className="font-medium">{item.name}</p>
                              <p className="text-sm text-muted-foreground">الكمية: {item.quantity}</p>
                            </div>
                            <p className="font-semibold">{(item.price * item.quantity).toLocaleString()} ر.س</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Shipping Info Summary */}
                    <div>
                      <h3 className="font-semibold mb-2">عنوان الشحن</h3>
                      <p className="text-sm text-muted-foreground">
                        {shippingInfo.firstName} {shippingInfo.lastName}
                        <br />
                        {shippingInfo.address}
                        <br />
                        {shippingInfo.city}, {shippingInfo.postalCode}
                        <br />
                        {shippingInfo.country}
                      </p>
                    </div>

                    {/* Payment Method Summary */}
                    <div>
                      <h3 className="font-semibold mb-2">طريقة الدفع</h3>
                      <p className="text-sm text-muted-foreground">
                        {paymentMethod === "card" ? "بطاقة ائتمان" : "الدفع عند الاستلام"}
                      </p>
                    </div>

                    <div className="flex items-center space-x-2 space-x-reverse">
                      <Checkbox id="terms" />
                      <Label htmlFor="terms" className="text-sm">
                        أوافق على الشروط والأحكام وسياسة الخصوصية
                      </Label>
                    </div>

                    <div className="flex gap-4">
                      <Button variant="outline" onClick={() => setStep(2)} className="flex-1">
                        العودة
                      </Button>
                      <Button
                        onClick={handlePlaceOrder}
                        disabled={isProcessing}
                        className="flex-1 bg-brand-yellow text-black hover:bg-brand-yellow/90"
                      >
                        {isProcessing ? "جاري المعالجة..." : "تأكيد الطلب"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle>ملخص الطلب</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    {items.map((item) => (
                      <div key={item.id} className="flex justify-between text-sm">
                        <span>
                          {item.name} × {item.quantity}
                        </span>
                        <span>{(item.price * item.quantity).toLocaleString()} ر.س</span>
                      </div>
                    ))}
                  </div>
                  <Separator />
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>المجموع الفرعي</span>
                      <span>{subtotal.toLocaleString()} ر.س</span>
                    </div>
                    <div className="flex justify-between">
                      <span>الشحن</span>
                      <span>{shipping.toLocaleString()} ر.س</span>
                    </div>
                    <div className="flex justify-between">
                      <span>الضريبة (15%)</span>
                      <span>{tax.toLocaleString()} ر.س</span>
                    </div>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-bold text-lg">
                    <span>المجموع الكلي</span>
                    <span className="text-brand-yellow">{finalTotal.toLocaleString()} ر.س</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}