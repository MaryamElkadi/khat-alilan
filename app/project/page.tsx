"use client"

import { motion } from "framer-motion"
import { useState } from "react"
import { ArrowLeft, Upload, X, Calendar, Star, Shield, Clock, Users, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

// أنواع المشاريع المتاحة
const projectTypes = [
  { 
    id: "graphic", 
    name: "تصميم جرافيك", 
    description: "شعارات، بانرات، منشورات، بروشورات",
    icon: "🎨"
  },
  { 
    id: "web", 
    name: "تصميم مواقع", 
    description: "مواقع إلكترونية، متاجر إلكترونية، تطبيقات ويب",
    icon: "💻"
  },
  { 
    id: "social", 
    name: "وسائل التواصل", 
    description: "إدارة صفحات، محتوى، حملات إعلانية",
    icon: "📱"
  },
  { 
    id: "branding", 
    name: "هوية بصرية", 
    description: "هوية متكاملة، دليل استخدام، بطاقات عمل",
    icon: "🏢"
  },
  { 
    id: "motion", 
    name: "موشن جرافيك", 
    description: "فيديوهات إعلانية، رسوم متحركة، عرض تقديمي",
    icon: "🎬"
  },
  { 
    id: "other", 
    name: "أخرى", 
    description: "مشاريع خاصة، استشارات، حلول مخصصة",
    icon: "✨"
  },
]

// حزم الأسعار
const pricingPackages = [
  { 
    id: "basic", 
    name: "الباقة الأساسية", 
    price: "500 ر.س", 
    originalPrice: "700 ر.س",
    popular: false,
    features: [
      "تصميم بسيط واحترافي",
      "3 مراجعات وتعديلات",
      "تسليم في 5-7 أيام",
      "ملفات جاهزة للاستخدام",
      "دعم فني لمدة أسبوع"
    ] 
  },
  { 
    id: "professional", 
    name: "الباقة الاحترافية", 
    price: "1200 ر.س", 
    originalPrice: "1500 ر.س",
    popular: true,
    features: [
      "تصميم متقدم ومبتكر",
      "مراجعات وتعديلات غير محدودة",
      "تسليم في 3-5 أيام",
      "ملفات مصدرية + جاهزة",
      "دعم فني لمدة شهر",
      "توصيات تسويقية مجانية"
    ] 
  },
  { 
    id: "premium", 
    name: "الباقة المميزة", 
    price: "2500 ر.س", 
    originalPrice: "3200 ر.س",
    popular: false,
    features: [
      "تصميم احترافي متكامل",
      "مراجعات غير محدودة + أولوية",
      "تسليم في 24-48 ساعة",
      "جميع الملفات المصدرية",
      "دعم فني لمدة 3 أشهر",
      "تحليل تسويقي شامل",
      "جلسة استشارية مجانية"
    ] 
  },
]

// مزايا الخدمة
const features = [
  {
    icon: Shield,
    title: "ضمان الجودة",
    description: "نضمن لك الحصول على تصميم يناسب احتياجاتك ويتجاوز توقعاتك"
  },
  {
    icon: Clock,
    title: "تسليم في الوقت المحدد",
    description: "نلتزم بالمواعيد النهائية ونحافظ على وقتك الثمين"
  },
  {
    icon: Users,
    title: "دعم متواصل",
    description: "فريق دعم فني متاح لمساعدتك في أي وقت تحتاجه"
  },
  {
    icon: Star,
    title: "تصاميم حصرية",
    description: "كل تصميم نقدمه هو عمل فريد ومبتكر يناسب علامتك التجارية"
  }
]

export default function StartProjectPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState(1)
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])

  // بيانات النموذج
  const [formData, setFormData] = useState({
    projectType: "",
    package: "",
    name: "",
    email: "",
    phone: "",
    company: "",
    deadline: "",
    budget: "",
    description: "",
    references: "",
    specialRequirements: ""
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    if (selectedFiles.length + files.length > 5) {
      toast({
        title: "حد الملفات",
        description: "يمكنك رفع最多 5 ملفات فقط",
        variant: "destructive"
      })
      return
    }
    setSelectedFiles(prev => [...prev, ...files])
  }

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index))
  }

  const nextStep = () => {
    if (step === 1 && !formData.projectType) {
      toast({ 
        title: "خطأ", 
        description: "الرجاء اختيار نوع المشروع", 
        variant: "destructive" 
      })
      return
    }
    if (step === 2 && !formData.package) {
      toast({ 
        title: "خطأ", 
        description: "الرجاء اختيار الباقة المناسبة", 
        variant: "destructive" 
      })
      return
    }
    if (step === 3 && (!formData.name || !formData.email || !formData.description)) {
      toast({ 
        title: "خطأ", 
        description: "الرجاء ملء جميع الحقول الإلزامية", 
        variant: "destructive" 
      })
      return
    }
    setStep(prev => prev + 1)
  }

  const prevStep = () => {
    setStep(prev => prev - 1)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // محاكاة إرسال البيانات
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      toast({
        title: "🎉 تم إرسال الطلب بنجاح!",
        description: "سنقوم بالتواصل معك خلال 24 ساعة لتأكيد تفاصيل المشروع",
      })
      
      // إعادة التوجيه إلى الصفحة الرئيسية بعد النجاح
      setTimeout(() => {
        router.push("/")
      }, 3000)
      
    } catch (error) {
      toast({
        title: "❌ خطأ",
        description: "حدث خطأ أثناء إرسال الطلب. يرجى المحاولة مرة أخرى",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 pt-20">
      <div className="container mx-auto px-4 py-8">
        {/* رأس الصفحة */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 text-center"
        >
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-6 text-gray-300 hover:text-white hover:bg-gray-700"
          >
            <ArrowLeft className="ml-2 h-4 w-4" />
            رجوع
          </Button>
          
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-l from-brand-blue to-brand-yellow bg-clip-text text-transparent">
              ابدأ مشروعك الإبداعي
            </h1>
            <p className="text-xl text-gray-300 leading-relaxed">
              أخبرنا عن فكرتك وسنحولها إلى واقع ملموس. فريقنا من الخبراء جاهز لتحقيق رؤيتك بأعلى معايير الجودة
            </p>
          </div>
        </motion.div>

        {/* شريط التقدم */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="flex items-center justify-between mb-4">
            {[1, 2, 3, 4].map((stepNumber) => (
              <div key={stepNumber} className="flex items-center flex-1">
                <div className="flex items-center justify-center flex-1">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center border-2 font-bold ${
                      step >= stepNumber
                        ? "bg-brand-blue border-brand-blue text-white"
                        : "border-gray-600 text-gray-400 bg-gray-800"
                    }`}
                  >
                    {stepNumber}
                  </div>
                </div>
                {stepNumber < 4 && (
                  <div
                    className={`flex-1 h-2 mx-2 rounded-full ${
                      step > stepNumber ? "bg-brand-blue" : "bg-gray-700"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between text-sm text-gray-400 px-4">
            <span>نوع المشروع</span>
            <span>اختيار الباقة</span>
            <span>تفاصيل المشروع</span>
            <span>تأكيد الطلب</span>
          </div>
        </div>

        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* النموذج الرئيسي */}
          <div className="lg:col-span-2">
            <Card className="shadow-xl border-gray-700 bg-gray-800">
              <CardContent className="p-6">
                <form onSubmit={handleSubmit}>
                  {/* الخطوة 1: اختيار نوع المشروع */}
                  {step === 1 && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                    >
                      <h2 className="text-2xl font-bold mb-6 text-white">اختر نوع المشروع</h2>
                      <RadioGroup
                        value={formData.projectType}
                        onValueChange={(value) => handleInputChange("projectType", value)}
                        className="grid grid-cols-1 md:grid-cols-2 gap-4"
                      >
                        {projectTypes.map((type) => (
                          <div key={type.id}>
                            <RadioGroupItem
                              value={type.id}
                              id={type.id}
                              className="peer sr-only"
                            />
                            <Label
                              htmlFor={type.id}
                              className="flex items-start space-x-4 space-x-reverse rounded-xl border-2 border-gray-600 bg-gray-700 p-4 hover:border-brand-blue hover:bg-gray-600 peer-data-[state=checked]:border-brand-blue peer-data-[state=checked]:bg-gray-600 cursor-pointer transition-all duration-200"
                            >
                              <span className="text-2xl">{type.icon}</span>
                              <div className="flex-1 text-right">
                                <h3 className="font-bold text-white">{type.name}</h3>
                                <p className="text-sm text-gray-300 mt-1">
                                  {type.description}
                                </p>
                              </div>
                            </Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </motion.div>
                  )}

                  {/* الخطوة 2: اختيار الباقة */}
                  {step === 2 && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                    >
                      <h2 className="text-2xl font-bold mb-6 text-white">اختر الباقة المناسبة</h2>
                      <div className="space-y-6">
                        {pricingPackages.map((pkg) => (
                          <div key={pkg.id} className="relative">
                            <RadioGroupItem
                              value={pkg.id}
                              id={pkg.id}
                              className="peer sr-only"
                            />
                            <Label
                              htmlFor={pkg.id}
                              className={`block rounded-xl border-2 p-6 cursor-pointer transition-all duration-200 peer-data-[state=checked]:border-brand-blue peer-data-[state=checked]:bg-gray-700 ${
                                pkg.popular 
                                  ? "border-yellow-500 bg-yellow-500/10 peer-data-[state=checked]:border-brand-blue" 
                                  : "border-gray-600 bg-gray-700"
                              }`}
                            >
                              {pkg.popular && (
                                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                                  <span className="bg-yellow-500 text-gray-900 px-4 py-1 rounded-full text-sm font-bold">
                                    الأكثر طلباً
                                  </span>
                                </div>
                              )}
                              
                              <div className="flex justify-between items-start mb-4">
                                <div>
                                  <h3 className="font-bold text-lg text-white">{pkg.name}</h3>
                                  <div className="flex items-center gap-2 mt-2">
                                    <span className="text-2xl font-bold text-brand-blue">{pkg.price}</span>
                                    <span className="text-sm text-gray-400 line-through">{pkg.originalPrice}</span>
                                  </div>
                                </div>
                                <div className="w-6 h-6 rounded-full border-2 border-gray-500 peer-data-[state=checked]:bg-brand-blue peer-data-[state=checked]:border-brand-blue flex items-center justify-center">
                                  <div className="w-3 h-3 rounded-full bg-gray-800 peer-data-[state=checked]:bg-white peer-data-[state=checked]:block hidden" />
                                </div>
                              </div>

                              <ul className="space-y-2 text-sm text-gray-300">
                                {pkg.features.map((feature, index) => (
                                  <li key={index} className="flex items-center gap-2">
                                    <CheckCircle className="h-4 w-4 text-green-500" />
                                    {feature}
                                  </li>
                                ))}
                              </ul>
                            </Label>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {/* الخطوة 3: التفاصيل والمرفقات */}
                  {step === 3 && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="space-y-6"
                    >
                      <h2 className="text-2xl font-bold mb-6 text-white">معلومات المشروع</h2>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="name" className="text-gray-300">
                            الاسم بالكامل <span className="text-red-400">*</span>
                          </Label>
                          <Input
                            id="name"
                            value={formData.name}
                            onChange={(e) => handleInputChange("name", e.target.value)}
                            required
                            className="border-gray-600 bg-gray-700 text-white focus:border-brand-blue focus:ring-brand-blue"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="email" className="text-gray-300">
                            البريد الإلكتروني <span className="text-red-400">*</span>
                          </Label>
                          <Input
                            id="email"
                            type="email"
                            value={formData.email}
                            onChange={(e) => handleInputChange("email", e.target.value)}
                            required
                            className="border-gray-600 bg-gray-700 text-white focus:border-brand-blue focus:ring-brand-blue"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="phone" className="text-gray-300">رقم الهاتف</Label>
                          <Input
                            id="phone"
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => handleInputChange("phone", e.target.value)}
                            className="border-gray-600 bg-gray-700 text-white focus:border-brand-blue focus:ring-brand-blue"
                            placeholder="+966 5X XXX XXXX"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="company" className="text-gray-300">اسم الشركة (اختياري)</Label>
                          <Input
                            id="company"
                            value={formData.company}
                            onChange={(e) => handleInputChange("company", e.target.value)}
                            className="border-gray-600 bg-gray-700 text-white focus:border-brand-blue focus:ring-brand-blue"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="description" className="text-gray-300">
                          وصف المشروع <span className="text-red-400">*</span>
                        </Label>
                        <Textarea
                          id="description"
                          rows={5}
                          value={formData.description}
                          onChange={(e) => handleInputChange("description", e.target.value)}
                          placeholder="أخبرنا عن فكرة مشروعك، أهدافك، الجمهور المستهدف، والنتائج المتوقعة..."
                          required
                          className="border-gray-600 bg-gray-700 text-white focus:border-brand-blue focus:ring-brand-blue resize-none"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="references" className="text-gray-300">مراجع أو أفكار (اختياري)</Label>
                        <Textarea
                          id="references"
                          rows={3}
                          value={formData.references}
                          onChange={(e) => handleInputChange("references", e.target.value)}
                          placeholder="روابط لتصاميم أعجبتك، ألوان مفضلة، نماذج مشابهة..."
                          className="border-gray-600 bg-gray-700 text-white focus:border-brand-blue focus:ring-brand-blue resize-none"
                        />
                      </div>

                      {/* رفع الملفات */}
                      <div className="space-y-4">
                        <Label className="text-gray-300">رفع ملفات مساعدة (اختياري)</Label>
                        <div className="border-2 border-dashed border-gray-600 rounded-xl p-8 text-center hover:border-brand-blue transition-colors bg-gray-700/50">
                          <Input
                            type="file"
                            multiple
                            onChange={handleFileSelect}
                            className="hidden"
                            id="file-upload"
                            accept=".pdf,.jpg,.jpeg,.png,.ai,.psd,.doc,.docx"
                          />
                          <Label htmlFor="file-upload" className="cursor-pointer block">
                            <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                            <p className="text-gray-300 font-medium">اسحب الملفات أو اضغط للرفع</p>
                            <p className="text-sm text-gray-400 mt-2">
                              PDF, JPG, PNG, AI, PSD - الحد الأقصى 5 ملفات (10MB لكل ملف)
                            </p>
                          </Label>
                        </div>
                        
                        {/* عرض الملفات المرفوعة */}
                        {selectedFiles.length > 0 && (
                          <div className="space-y-3">
                            <h4 className="font-medium text-gray-300">الملفات المرفوعة:</h4>
                            {selectedFiles.map((file, index) => (
                              <div key={index} className="flex items-center justify-between bg-gray-700 p-4 rounded-lg border border-gray-600">
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 bg-brand-blue/20 rounded-lg flex items-center justify-center">
                                    <span className="text-brand-blue font-bold text-sm">
                                      {file.name.split('.').pop()?.toUpperCase()}
                                    </span>
                                  </div>
                                  <div>
                                    <p className="font-medium text-white text-sm">{file.name}</p>
                                    <p className="text-xs text-gray-400">
                                      {(file.size / 1024 / 1024).toFixed(2)} MB
                                    </p>
                                  </div>
                                </div>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeFile(index)}
                                  className="text-red-400 hover:text-red-300 hover:bg-red-400/10"
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}

                  {/* الخطوة 4: المراجعة النهائية */}
                  {step === 4 && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="space-y-6"
                    >
                      <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                          <CheckCircle className="h-8 w-8 text-green-500" />
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-2">مراجعة الطلب النهائية</h2>
                        <p className="text-gray-300">يرجى مراجعة المعلومات قبل التأكيد النهائي</p>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card className="bg-gray-700 border-gray-600">
                          <CardContent className="p-4">
                            <h3 className="font-bold text-lg mb-4 text-white">معلومات المشروع</h3>
                            <div className="space-y-3 text-sm">
                              <div className="flex justify-between">
                                <span className="text-gray-300">نوع المشروع:</span>
                                <span className="font-medium text-white">
                                  {projectTypes.find(t => t.id === formData.projectType)?.name}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-300">الباقة المختارة:</span>
                                <span className="font-medium text-white">
                                  {pricingPackages.find(p => p.id === formData.package)?.name}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-300">المبلغ:</span>
                                <span className="font-bold text-brand-blue">
                                  {pricingPackages.find(p => p.id === formData.package)?.price}
                                </span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>

                        <Card className="bg-gray-700 border-gray-600">
                          <CardContent className="p-4">
                            <h3 className="font-bold text-lg mb-4 text-white">معلومات التواصل</h3>
                            <div className="space-y-3 text-sm">
                              <div className="flex justify-between">
                                <span className="text-gray-300">الاسم:</span>
                                <span className="font-medium text-white">{formData.name}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-300">البريد:</span>
                                <span className="font-medium text-white">{formData.email}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-300">الهاتف:</span>
                                <span className="font-medium text-white">{formData.phone || "غير مذكور"}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-300">الشركة:</span>
                                <span className="font-medium text-white">{formData.company || "غير مذكور"}</span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>

                      <Card className="bg-gray-700 border-gray-600">
                        <CardContent className="p-4">
                          <h3 className="font-bold text-lg mb-4 text-white">وصف المشروع</h3>
                          <p className="text-gray-300 leading-relaxed">{formData.description}</p>
                        </CardContent>
                      </Card>

                      {selectedFiles.length > 0 && (
                        <Card className="bg-gray-700 border-gray-600">
                          <CardContent className="p-4">
                            <h3 className="font-bold text-lg mb-4 text-white">الملفات المرفوعة ({selectedFiles.length})</h3>
                            <div className="space-y-2">
                              {selectedFiles.map((file, index) => (
                                <div key={index} className="flex items-center gap-3 text-sm">
                                  <div className="w-8 h-8 bg-gray-600 rounded flex items-center justify-center">
                                    <span className="text-xs font-medium text-gray-300">.{file.name.split('.').pop()}</span>
                                  </div>
                                  <span className="text-gray-300">{file.name}</span>
                                </div>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      )}

                      <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
                        <h4 className="font-bold text-blue-400 mb-2">ماذا يحدث بعد التأكيد؟</h4>
                        <ul className="text-sm text-blue-300 space-y-1">
                          <li>• سنتواصل معك خلال 24 ساعة لتأكيد تفاصيل المشروع</li>
                          <li>• سيتم تعيين مصمم متخصص لمشروعك</li>
                          <li>• ستحصل على جدول زمني مفصل للمشروع</li>
                          <li>• يمكنك متابعة تقدم المشروع عبر المنصة</li>
                        </ul>
                      </div>
                    </motion.div>
                  )}

                  {/* أزرار التنقل */}
                  <div className="flex justify-between mt-8 pt-6 border-t border-gray-700">
                    {step > 1 ? (
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={prevStep}
                        className="border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white"
                      >
                        السابق
                      </Button>
                    ) : (
                      <div></div>
                    )}
                    
                    {step < 4 ? (
                      <Button 
                        type="button" 
                        onClick={nextStep}
                        className="bg-brand-blue hover:bg-brand-blue/90"
                      >
                        التالي
                      </Button>
                    ) : (
                      <Button 
                        type="submit" 
                        disabled={loading}
                        className="bg-green-600 hover:bg-green-700 px-8"
                      >
                        {loading ? (
                          <>
                            <Clock className="ml-2 h-4 w-4 animate-spin" />
                            جاري إرسال الطلب...
                          </>
                        ) : (
                          "تأكيد الطلب وإرسال"
                        )}
                      </Button>
                    )}
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* الشريط الجانبي */}
          <div className="space-y-6">
            {/* مزايا الخدمة */}
            <Card className="shadow-lg border-gray-700 bg-gray-800">
              <CardContent className="p-6">
                <h3 className="font-bold text-lg mb-4 text-white">لماذا تختارنا؟</h3>
                <div className="space-y-4">
                  {features.map((feature, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-start gap-3"
                    >
                      <div className="p-2 bg-brand-blue/20 rounded-lg">
                        <feature.icon className="h-5 w-5 text-brand-blue" />
                      </div>
                      <div>
                        <h4 className="font-medium text-white text-sm">{feature.title}</h4>
                        <p className="text-xs text-gray-400 mt-1">{feature.description}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* معلومات الاتصال */}
            <Card className="shadow-lg border-gray-700 bg-gradient-to-br from-brand-blue to-blue-600 text-white">
              <CardContent className="p-6">
                <h3 className="font-bold text-lg mb-4">هل تحتاج مساعدة؟</h3>
                <div className="space-y-3 text-sm">
                  <p className="flex items-center gap-2">
                    <span>📞</span>
                    <span>9200 12345</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <span>✉️</span>
                    <span>info@khat-ads.com</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <span>🕒</span>
                    <span>9:00 ص - 6:00 م</span>
                  </p>
                </div>
                <Button 
                  variant="outline" 
                  className="w-full mt-4 bg-white/10 text-white hover:bg-white/20 border-white/20"
                  onClick={() => router.push("/contact")}
                >
                  تواصل معنا
                </Button>
              </CardContent>
            </Card>

            {/* معلومات إضافية */}
            <Card className="shadow-lg border-gray-700 bg-gray-800">
              <CardContent className="p-6">
                <h3 className="font-bold text-lg mb-4 text-white">معلومات سريعة</h3>
                <div className="space-y-3 text-sm text-gray-300">
                  <div className="flex justify-between">
                    <span>متوسط وقت التسليم:</span>
                    <span className="text-brand-blue">3-7 أيام</span>
                  </div>
                  <div className="flex justify-between">
                    <span>معدل رضا العملاء:</span>
                    <span className="text-green-500">98%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>مراجعات مجانية:</span>
                    <span className="text-yellow-500">3-∞</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}