"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { ArrowRight, Save, X, Plus, Trash2, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface Product {
  _id: string
  title: string
  description: string
  price: number
  category: string
  featured: boolean
  status: string
  image: string | string[]
  quantityOptions?: any[]
  sizeOptions?: any[]
  sideOptions?: any[]
  materialOptions?: any[]
  createdAt: string
  updatedAt: string
}

interface Category {
  _id: string
  name: string
  description: string
  slug: string
  image: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export default function EditProductPage() {
  const router = useRouter()
  const params = useParams()
  const [productId, setProductId] = useState<string | null>(null)
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [allCategories, setAllCategories] = useState<string[]>([])
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: 0,
    category: "",
    featured: false,
    status: "مسودة",
    quantityOptions: [] as any[],
    sizeOptions: [] as any[],
    sideOptions: [] as any[],
    materialOptions: [] as any[]
  })

  const [images, setImages] = useState<string[]>([])
  const [newImages, setNewImages] = useState<File[]>([])

  // Get the ID from params when component mounts
  useEffect(() => {
    if (params && params.id) {
      const id = params.id as string
      setProductId(id)
      console.log("🆔 Product ID from params:", id)
    }
  }, [params])

  // Fetch ALL categories from Category Model API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        console.log("🔄 Fetching ALL categories from Category Model...")
        const res = await fetch('/api/categories')
        console.log("📡 Categories response status:", res.status)
        
        if (res.ok) {
          const data = await res.json()
          console.log("📡 Categories data:", data)
          setCategories(data.categories || [])
        } else {
          console.error('Failed to fetch categories:', res.status)
        }
      } catch (error) {
        console.error('Error fetching categories:', error)
      }
    }
    fetchCategories()
  }, [])

  // Fetch ALL products to extract ALL unique categories from Product Model
  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        console.log("🔄 Fetching ALL products to extract categories...")
        
        const res = await fetch('/api/products?limit=1000')
        console.log("📡 Products response status:", res.status)
        
        if (res.ok) {
          const data = await res.json()
          console.log("📡 Products data for categories:", data)
          
          // Extract ALL unique categories from products
          const productCategories = new Set<string>()
          
          if (data.products && Array.isArray(data.products)) {
            data.products.forEach((product: Product) => {
              if (product.category && product.category.trim() !== "") {
                productCategories.add(product.category.trim())
              }
            })
          } else if (Array.isArray(data)) {
            data.forEach((product: Product) => {
              if (product.category && product.category.trim() !== "") {
                productCategories.add(product.category.trim())
              }
            })
          }
          
          const categoriesArray = Array.from(productCategories).sort()
          console.log("📊 ALL unique categories from products:", categoriesArray)
          console.log("📊 Total categories from products:", categoriesArray.length)
          return categoriesArray
        } else {
          console.error('Failed to fetch products:', res.status)
          return []
        }
      } catch (error) {
        console.error('Error fetching products for categories:', error)
        return []
      }
    }

    const combineAllCategories = async () => {
      const productCategories = await fetchAllProducts()
      
      // Combine categories from both sources
      const categoryModelNames = categories.map(cat => cat.name.trim())
      const allUniqueCategories = [...new Set([...categoryModelNames, ...productCategories])].sort()
      
      console.log("🎯 ALL Combined categories:", allUniqueCategories)
      console.log("📈 Total official categories:", categoryModelNames.length)
      console.log("📈 Total product categories:", productCategories.length)
      console.log("📈 Total combined categories:", allUniqueCategories.length)
      
      setAllCategories(allUniqueCategories)
    }

    // Combine categories whenever categories from API are loaded
    if (categories.length > 0) {
      combineAllCategories()
    }
  }, [categories])

  // Fetch product data
  useEffect(() => {
    const fetchProduct = async () => {
      if (!productId) return

      try {
        setLoading(true)
        console.log("🔄 Fetching product with ID:", productId)
        
        const res = await fetch(`/api/products/${productId}`)
        console.log("📡 Response status:", res.status)
        
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`)
        }
        
        const data = await res.json()
        console.log("📡 Response data:", data)
        
        if (data.success && data.product) {
          setProduct(data.product)
          setFormData({
            title: data.product.title || "",
            description: data.product.description || "",
            price: data.product.price || 0,
            category: data.product.category || "",
            featured: data.product.featured || false,
            status: data.product.status || "مسودة",
            quantityOptions: data.product.quantityOptions || [],
            sizeOptions: data.product.sizeOptions || [],
            sideOptions: data.product.sideOptions || [],
            materialOptions: data.product.materialOptions || []
          })
          
          // Set images from product data
          if (data.product.image) {
            if (Array.isArray(data.product.image)) {
              setImages(data.product.image.filter((img: string) => img && img.trim() !== ""))
            } else {
              setImages([data.product.image].filter((img: string) => img && img.trim() !== ""))
            }
          }
          
          console.log("✅ Product data loaded successfully")
        } else {
          console.error("Product not found in response")
          alert(data.error || "المنتج غير موجود")
          router.push("/admin/products")
        }
      } catch (error) {
        console.error("Error fetching product:", error)
        alert("حدث خطأ في جلب بيانات المنتج")
        router.push("/admin/products")
      } finally {
        setLoading(false)
      }
    }

    if (productId) {
      fetchProduct()
    }
  }, [productId, router])

  // Handle image upload
  const handleImageUpload = async (files: FileList) => {
    const uploadedImages: string[] = []
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert(`الملف ${file.name} ليس صورة`)
        continue
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert(`حجم الصورة ${file.name} كبير جداً (الحد الأقصى 5MB)`)
        continue
      }
      
      setNewImages(prev => [...prev, file])
      
      // Create preview URL
      const previewUrl = URL.createObjectURL(file)
      uploadedImages.push(previewUrl)
    }
    
    setImages(prev => [...prev, ...uploadedImages])
  }

  // Remove image
  const removeImage = (index: number) => {
    // Check if it's a new image (has blob URL)
    const imageUrl = images[index]
    if (imageUrl.startsWith('blob:')) {
      URL.revokeObjectURL(imageUrl)
    }
    
    setImages(prev => prev.filter((_, i) => i !== index))
    
    // Also remove from newImages if it was a newly uploaded file
    if (imageUrl.startsWith('blob:')) {
      setNewImages(prev => prev.filter((_, i) => i !== index - (images.length - newImages.length)))
    }
  }

  // Upload images to server and get URLs
  const uploadImagesToServer = async (): Promise<string[]> => {
    if (newImages.length === 0) return images.filter(img => !img.startsWith('blob:'))

    setUploading(true)
    const uploadedUrls: string[] = []

    try {
      for (const file of newImages) {
        const formData = new FormData()
        formData.append('file', file)
        
        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        })

        if (!response.ok) {
          throw new Error(`Failed to upload image: ${file.name}`)
        }

        const data = await response.json()
        if (data.url) {
          uploadedUrls.push(data.url)
        }
      }
    } catch (error) {
      console.error('Error uploading images:', error)
      throw new Error('فشل في رفع الصور')
    } finally {
      setUploading(false)
    }

    // Combine existing images (that are not blob URLs) with new uploaded URLs
    const existingImages = images.filter(img => !img.startsWith('blob:'))
    return [...existingImages, ...uploadedUrls]
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!productId) {
      alert("معرف المنتج غير موجود")
      return
    }

    setSaving(true)

    try {
      console.log("🔄 Updating product with data:", formData)
      
      // Upload new images first
      let finalImageUrls: string[] = []
      if (newImages.length > 0) {
        finalImageUrls = await uploadImagesToServer()
      } else {
        finalImageUrls = images
      }

      // Prepare data for API
      const updateData = {
        ...formData,
        image: finalImageUrls.length === 1 ? finalImageUrls[0] : finalImageUrls
      }

      console.log("📤 Sending update with images:", updateData)
      
      const res = await fetch(`/api/products/${productId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      })

      const result = await res.json()
      console.log("📡 Update response:", result)

      if (res.ok && result.success) {
        alert("✅ تم تحديث المنتج بنجاح")
        router.push("/admin/products")
      } else {
        alert(`❌ ${result.error || "فشل في تحديث المنتج"}`)
      }
    } catch (error) {
      console.error("Error updating product:", error)
      alert("❌ حدث خطأ أثناء تحديث المنتج")
    } finally {
      setSaving(false)
    }
  }

  const handleAddQuantityOption = () => {
    setFormData(prev => ({
      ...prev,
      quantityOptions: [...prev.quantityOptions, { quantity: 1, price: 0 }]
    }))
  }

  const handleRemoveQuantityOption = (index: number) => {
    setFormData(prev => ({
      ...prev,
      quantityOptions: prev.quantityOptions.filter((_, i) => i !== index)
    }))
  }

  const handleQuantityOptionChange = (index: number, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      quantityOptions: prev.quantityOptions.map((option, i) => 
        i === index ? { ...option, [field]: value } : option
      )
    }))
  }

  const handleAddOption = (optionType: 'sizeOptions' | 'sideOptions' | 'materialOptions') => {
    setFormData(prev => ({
      ...prev,
      [optionType]: [...prev[optionType], { name: "", priceAddition: 0 }]
    }))
  }

  const handleRemoveOption = (optionType: 'sizeOptions' | 'sideOptions' | 'materialOptions', index: number) => {
    setFormData(prev => ({
      ...prev,
      [optionType]: prev[optionType].filter((_, i) => i !== index)
    }))
  }

  const handleOptionChange = (optionType: 'sizeOptions' | 'sideOptions' | 'materialOptions', index: number, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [optionType]: prev[optionType].map((option, i) => 
        i === index ? { ...option, [field]: value } : option
      )
    }))
  }

  // Get categories that are only in products (legacy categories)
  const getLegacyCategories = () => {
    return allCategories.filter(cat => 
      !categories.some(officialCat => officialCat.name === cat)
    )
  }

  if (loading) {
    return (
      <div className="p-8">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg">جاري تحميل بيانات المنتج...</div>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="p-8">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg">المنتج غير موجود</div>
          <Button 
            onClick={() => router.push("/admin/products")}
            className="mt-4"
          >
            العودة إلى القائمة
          </Button>
        </div>
      </div>
    )
  }

  const legacyCategories = getLegacyCategories()

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-brand-blue">تعديل المنتج</h1>
          <p className="text-muted-foreground mt-1">تعديل بيانات المنتج: {product.title}</p>
        </div>
        <Button
          variant="outline"
          onClick={() => router.push("/admin/products")}
        >
          <ArrowRight className="h-4 w-4 ml-2" />
          العودة إلى القائمة
        </Button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Information */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>المعلومات الأساسية</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="title">اسم المنتج *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="أدخل اسم المنتج"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="description">وصف المنتج *</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="أدخل وصف المنتج"
                    rows={4}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="price">السعر الأساسي (ر.س) *</Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => setFormData(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                      placeholder="0.00"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="category">الفئة *</Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="اختر الفئة" />
                      </SelectTrigger>
                      <SelectContent>
                        {/* Official categories from Category Model */}
                        {categories.length > 0 && (
                          <>
                            <div className="px-2 py-1 text-xs font-semibold text-muted-foreground border-b">
                              الفئات الرسمية ({categories.length})
                            </div>
                            {categories.map((category) => (
                              <SelectItem key={`${category._id}`} value={category.name}>
                                {category.name}
                              </SelectItem>
                            ))}
                          </>
                        )}
                        
                        {/* Categories from Product Model (legacy) */}
                        {legacyCategories.length > 0 && (
                          <>
                            <div className="px-2 py-1 text-xs font-semibold text-muted-foreground border-b mt-2">
                              فئات من المنتجات ({legacyCategories.length})
                            </div>
                            {legacyCategories.map((category, index) => (
                              <SelectItem key={`legacy-${index}`} value={category}>
                                {category}
                              </SelectItem>
                            ))}
                          </>
                        )}
                        
                        {/* If no categories found at all */}
                        {allCategories.length === 0 && (
                          <SelectItem value="" disabled>
                            لا توجد فئات متاحة
                          </SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                    
                    {/* Info about categories sources */}
                    <div className="mt-2 text-xs text-muted-foreground bg-blue-50 p-3 rounded-lg">
                      <p className="font-semibold">مصادر الفئات:</p>
                      <ul className="list-disc list-inside mt-1 space-y-1">
                        <li>الفئات الرسمية: {categories.length} فئة</li>
                        <li>فئات من المنتجات: {legacyCategories.length} فئة</li>
                        <li className="font-semibold">الإجمالي: {allCategories.length} فئة</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Image Management */}
            <Card>
              <CardHeader>
                <CardTitle>إدارة الصور</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Alert>
                  <AlertDescription className="text-sm">
                    يمكنك رفع عدة صور للمنتج. الصور المدعومة: JPG, PNG, WebP. الحد الأقصى للحجم: 5MB لكل صورة.
                  </AlertDescription>
                </Alert>

                {/* Image Upload */}
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <input
                    type="file"
                    id="image-upload"
                    multiple
                    accept="image/*"
                    onChange={(e) => e.target.files && handleImageUpload(e.target.files)}
                    className="hidden"
                  />
                  <label
                    htmlFor="image-upload"
                    className="cursor-pointer flex flex-col items-center justify-center space-y-2"
                  >
                    <Upload className="h-8 w-8 text-muted-foreground" />
                    <span className="text-sm font-medium">انقر لرفع الصور</span>
                    <span className="text-xs text-muted-foreground">
                      أو اسحب وأفلت الصور هنا
                    </span>
                  </label>
                </div>

                {/* Image Gallery */}
                {images.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
                    {images.map((img, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={img || "/placeholder.svg"}
                          alt={`Product image ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg border"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 rounded-lg flex items-center justify-center">
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            onClick={() => removeImage(index)}
                            className="opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                        <div className="absolute top-1 left-1">
                          <Badge variant="secondary" className="text-xs">
                            {index + 1}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {images.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    لا توجد صور للمنتج
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quantity Options */}
            <Card>
              <CardHeader>
                <CardTitle>خيارات الكمية</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {formData.quantityOptions.map((option, index) => (
                  <div key={index} className="flex items-center gap-4 p-4 border rounded-lg">
                    <div className="flex-1">
                      <Label>الكمية</Label>
                      <Input
                        type="number"
                        value={option.quantity}
                        onChange={(e) => handleQuantityOptionChange(index, 'quantity', parseInt(e.target.value) || 0)}
                        placeholder="الكمية"
                      />
                    </div>
                    <div className="flex-1">
                      <Label>السعر (ر.س)</Label>
                      <Input
                        type="number"
                        step="0.01"
                        value={option.price}
                        onChange={(e) => handleQuantityOptionChange(index, 'price', parseFloat(e.target.value) || 0)}
                        placeholder="السعر"
                      />
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleRemoveQuantityOption(index)}
                      className="mt-6"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleAddQuantityOption}
                >
                  <Plus className="h-4 w-4 ml-2" />
                  إضافة خيار كمية
                </Button>
              </CardContent>
            </Card>

            {/* Additional Options */}
            {['sizeOptions', 'sideOptions', 'materialOptions'].map((optionType) => (
              <Card key={optionType}>
                <CardHeader>
                  <CardTitle>
                    {optionType === 'sizeOptions' && 'خيارات المقاس'}
                    {optionType === 'sideOptions' && 'خيارات الجوانب'}
                    {optionType === 'materialOptions' && 'خيارات المواد'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {formData[optionType as keyof typeof formData].map((option: any, index: number) => (
                    <div key={index} className="flex items-center gap-4 p-4 border rounded-lg">
                      <div className="flex-1">
                        <Label>الاسم</Label>
                        <Input
                          value={option.name}
                          onChange={(e) => handleOptionChange(optionType as any, index, 'name', e.target.value)}
                          placeholder="أدخل الاسم"
                        />
                      </div>
                      <div className="flex-1">
                        <Label>السعر الإضافي (ر.س)</Label>
                        <Input
                          type="number"
                          step="0.01"
                          value={option.priceAddition}
                          onChange={(e) => handleOptionChange(optionType as any, index, 'priceAddition', parseFloat(e.target.value) || 0)}
                          placeholder="0.00"
                        />
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handleRemoveOption(optionType as any, index)}
                        className="mt-6"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => handleAddOption(optionType as any)}
                  >
                    <Plus className="h-4 w-4 ml-2" />
                    {optionType === 'sizeOptions' && 'إضافة مقاس'}
                    {optionType === 'sideOptions' && 'إضافة جانب'}
                    {optionType === 'materialOptions' && 'إضافة مادة'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>الإعدادات</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="featured" className="cursor-pointer">
                    منتج مميز
                  </Label>
                  <Switch
                    id="featured"
                    checked={formData.featured}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, featured: checked }))}
                  />
                </div>

                <div>
                  <Label htmlFor="status">الحالة</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="اختر الحالة" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="نشط">نشط</SelectItem>
                      <SelectItem value="مسودة">مسودة</SelectItem>
                      <SelectItem value="غير نشط">غير نشط</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <Card>
              <CardHeader>
                <CardTitle>الإجراءات</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button 
                  type="submit" 
                  className="w-full bg-brand-blue hover:bg-brand-blue/90"
                  disabled={saving || uploading}
                >
                  <Save className="h-4 w-4 ml-2" />
                  {saving ? "جاري الحفظ..." : uploading ? "جاري رفع الصور..." : "حفظ التغييرات"}
                </Button>
                
                <Button 
                  type="button" 
                  variant="outline" 
                  className="w-full"
                  onClick={() => router.push("/admin/products")}
                >
                  إلغاء
                </Button>
              </CardContent>
            </Card>

            {/* Product Info */}
            <Card>
              <CardHeader>
                <CardTitle>معلومات المنتج</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>معرف المنتج:</span>
                  <Badge variant="secondary" className="font-mono text-xs">
                    {product._id}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span>عدد الصور:</span>
                  <Badge variant="outline">
                    {images.length} صورة
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span>الصور الجديدة:</span>
                  <Badge variant={newImages.length > 0 ? "default" : "outline"}>
                    {newImages.length} صورة
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span>تاريخ الإنشاء:</span>
                  <span>{new Date(product.createdAt).toLocaleDateString('ar-SA')}</span>
                </div>
                <div className="flex justify-between">
                  <span>آخر تحديث:</span>
                  <span>{new Date(product.updatedAt).toLocaleDateString('ar-SA')}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  )
}