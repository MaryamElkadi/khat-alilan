"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter, useParams } from "next/navigation"
import { Save, ArrowRight, Upload, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"

const categories = [
  "تصميم جرافيك",
  "إعلانات وسائل التواصل",
  "تصميم مواقع ويب",
  "طباعة ونشر",
  "التصوير الفوتوغرافي",
  "الهوية التجارية",
  "التسويق الرقمي",
  "طباعة رقمية", 
  "هدايا اعلانية"
];

interface FormData {
  title: string
  description: string
  price: string
  category: string
  featured: boolean
  status: string
  images: string[]
  sizeOptions: string[]
  sideOptions: string[]
  materialOptions: string[]
  quantityOptions: {
    quantity: number
    price: number
  }[]
}

interface QuantityRow {
  quantity: string;
  price: string;
  total: number;
}

export default function EditProductPage() {
  const [images, setImages] = useState<File[]>([])
  const [existingImages, setExistingImages] = useState<string[]>([])
  const [uploading, setUploading] = useState(false)
  const router = useRouter()
  const params = useParams()
  const id = params?.id as string
  const inputRef = useRef<HTMLInputElement | null>(null)
  const [sizeOptions, setSizeOptions] = useState<string[]>([])
  const [sideOptions, setSideOptions] = useState<string[]>([])
  const [materialOptions, setMaterialOptions] = useState<string[]>([])
  


  const [formData, setFormData] = useState<FormData>({
    title: "",
    description: "",
    price: "",
    category: "",
    featured: false,
    status: "نشط",
    images: [],
    sizeOptions: [],
    sideOptions: [],
    materialOptions: [],
    quantityOptions: []
  })

  const [quantities, setQuantities] = useState<QuantityRow[]>([
    { quantity: "", price: "", total: 0 }
  ]);

  const [calculatedPrice, setCalculatedPrice] = useState({
    subtotal: 0,
    tax: 0,
    total: 0,
  })
// Add this function to remove existing images
const removeExistingImage = (index: number) => {
  setExistingImages(prev => prev.filter((_, i) => i !== index));
};

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/products/${id}`)
        if (res.ok) {
          const data = await res.json()
          console.log("Fetched product data:", data); // Debug log
          
          setFormData({
            title: data.title || "",
            description: data.description || "",
            price: data.price?.toString() || "",
            category: data.category || "",
            featured: data.featured || false,
            status: data.status || "نشط",
            images: data.image || [],
            sizeOptions: data.sizeOptions || [],
            sideOptions: data.sideOptions || [],
            materialOptions: data.materialOptions || [],
            quantityOptions: data.quantityOptions || []
          })

          setExistingImages(data.image || [])
          
          // FIXED: Extract names from option objects
          if (data.sizeOptions && data.sizeOptions.length > 0) {
            setSizeOptions(data.sizeOptions.map((opt: any) => opt.name || opt))
          } else {
            setSizeOptions(["A4", "A3", "A5"]) // Default values
          }
          
          if (data.sideOptions && data.sideOptions.length > 0) {
            setSideOptions(data.sideOptions.map((opt: any) => opt.name || opt))
          } else {
            setSideOptions(["وجه واحد", "وجهين"]) // Default values
          }
          
          if (data.materialOptions && data.materialOptions.length > 0) {
            setMaterialOptions(data.materialOptions.map((opt: any) => opt.name || opt))
          } else {
            setMaterialOptions(["ورق عادي", "ورق لامع", "بلاستيك"]) // Default values
          }
          
          // Set quantity options
          if (data.quantityOptions && data.quantityOptions.length > 0) {
            const qtyRows = data.quantityOptions.map((q: any) => ({
              quantity: q.quantity.toString(),
              price: q.price.toString(),
              total: calculateTotal(q.price, q.quantity)
            }))
            setQuantities(qtyRows)
          } else {
            setQuantities([{ quantity: "", price: "", total: 0 }])
          }
        } else {
          console.error("Failed to fetch product:", res.status);
        }
      } catch (error) {
        console.error("خطأ في تحميل المنتج", error)
      }
    }

    if (id) fetchProduct()
  }, [id])

  // Effect to calculate tax and total whenever the price changes
  useEffect(() => {
    const price = parseFloat(formData.price);
    if (!isNaN(price) && price >= 0) {
      const taxAmount = price * 0.15;
      const totalAmount = price + taxAmount;
      setCalculatedPrice({
        subtotal: price,
        tax: taxAmount,
        total: totalAmount,
      });
    } else {
      setCalculatedPrice({
        subtotal: 0,
        tax: 0,
        total: 0,
      });
    }
  }, [formData.price]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return
    setImages(Array.from(e.target.files))
  }

  const triggerFileInput = () => {
    document.getElementById("product-image-input")?.click()
  }

  const handleInputChange = (field: keyof FormData, value: string | boolean | string[] | any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleFiles = (selectedFiles: FileList | null) => {
    if (!selectedFiles) return;
    setImages((prev) => [...prev, ...Array.from(selectedFiles)]);
  };

  const removeFile = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    handleFiles(e.dataTransfer.files);
  };

  const handleQuantityChange = (index: number, field: "quantity" | "price", value: string) => {
    const newQuantities = [...quantities];
    newQuantities[index][field] = value;

    const qty = parseInt(newQuantities[index].quantity) || 0;
    const price = parseFloat(newQuantities[index].price) || 0;

    newQuantities[index].total = calculateTotal(price, qty);
    setQuantities(newQuantities);
  };

  const addQuantityRow = () => {
    setQuantities([...quantities, { quantity: "", price: "", total: 0 }]);
  };

  const removeQuantityRow = (index: number) => {
    setQuantities(quantities.filter((_, i) => i !== index));
  };

  const calculateTotal = (price: number, quantity: number) => {
    const subtotal = price * quantity;
    const tax = subtotal * 0.15;
    return subtotal + tax;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!id) return

    setUploading(true)

    try {
      const form = new FormData()
      form.append("title", formData.title)
      form.append("description", formData.description)
      form.append("price", formData.price)
      form.append("category", formData.category)
      form.append("featured", String(formData.featured))
      form.append("status", formData.status)

      // FIXED: Convert string arrays to proper object structure
      const sizeOptionsData = sizeOptions
        .filter(opt => opt.trim() !== "")
        .map(opt => ({ name: opt, priceAddition: 0 }));
      
      const sideOptionsData = sideOptions
        .filter(opt => opt.trim() !== "")
        .map(opt => ({ name: opt, priceAddition: 0 }));
      
      const materialOptionsData = materialOptions
        .filter(opt => opt.trim() !== "")
        .map(opt => ({ name: opt, priceAddition: 0 }));

      form.append("sizeOptions", JSON.stringify(sizeOptionsData))
      form.append("sideOptions", JSON.stringify(sideOptionsData))
      form.append("materialOptions", JSON.stringify(materialOptionsData))
      
      // Add quantity options
      const parsedQuantityOptions = quantities
        .filter((q) => q.quantity && q.price)
        .map((q) => ({
          quantity: parseInt(q.quantity),
          price: parseFloat(q.price),
        }));
      form.append("quantityOptions", JSON.stringify(parsedQuantityOptions))

      // Add images
      if (images.length > 0) {
        images.forEach((file) => form.append("images", file))
      }
      
      // Always send existing images to prevent losing them
      form.append("existingImages", JSON.stringify(existingImages))

      const res = await fetch(`/api/products/${id}`, {
        method: "PUT",
        body: form,
      })

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "فشل تعديل المنتج");
      }

      alert("تم تعديل المنتج وحفظه في قاعدة البيانات ✅")
      router.push("/admin/products")
    } catch (error: any) {
      console.error("Error updating product:", error)
      alert(`حدث خطأ أثناء تعديل المنتج ❌: ${error.message}`)
    } finally {
      setUploading(false)
    }
  }
  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Button variant="ghost" onClick={() => router.back()} className="p-2">
          <ArrowRight className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-brand-blue">تعديل المنتج</h1>
          <p className="text-muted-foreground mt-1">قم بتعديل بيانات المنتج ثم اضغط حفظ</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="max-w-4xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>معلومات المنتج</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="title">اسم المنتج *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="description">وصف المنتج *</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    rows={4}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="price">السعر (ر.س) *</Label>
                    <Input
                      id="price"
                      type="number"
                      value={formData.price}
                      onChange={(e) => handleInputChange("price", e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="category">الفئة *</Label>
                    <select
                      id="category"
                      value={formData.category}
                      onChange={(e) => handleInputChange("category", e.target.value)}
                      className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm"
                      required
                    >
                      <option value="">اختر الفئة</option>
                      {categories.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Tax and Total Price Display */}
                {calculatedPrice.subtotal > 0 && (
                  <div className="bg-gray-100 p-4 rounded-lg text-black">
                    <h4 className="font-semibold text-sm mb-2">حساب السعر</h4>
                    <div className="flex justify-between text-sm">
                      <p>السعر الأساسي:</p>
                      <p className="font-medium">{calculatedPrice.subtotal.toFixed(2)} ر.س</p>
                    </div>
                    <div className="flex justify-between text-sm">
                      <p>ضريبة القيمة المضافة (15%):</p>
                      <p className="font-medium">{calculatedPrice.tax.toFixed(2)} ر.س</p>
                    </div>
                    <div className="flex justify-between font-bold text-lg mt-2 pt-2 border-t border-gray-300">
                      <p>الإجمالي:</p>
                      <p>{calculatedPrice.total.toFixed(2)} ر.س</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Size Options */}
            <Card>
              <CardHeader>
                <CardTitle>خيارات المقاس</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>المقاسات المتاحة</Label>
                  <div className="mt-2 space-y-2">
                    {sizeOptions.map((opt, i) => (
                      <div key={i} className="flex gap-2">
                        <Input
                          value={opt}
                          placeholder={`خيار مقاس ${i + 1}`}
                          onChange={(e) => {
                            const newOptions = [...sizeOptions];
                            newOptions[i] = e.target.value;
                            setSizeOptions(newOptions);
                          }}
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          onClick={() => setSizeOptions(sizeOptions.filter((_, idx) => idx !== i))}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setSizeOptions([...sizeOptions, ""])}
                    >
                      + إضافة مقاس آخر
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Side Options */}
            <Card>
              <CardHeader>
                <CardTitle>خيارات الوجه</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>الوجه المتاح</Label>
                  <div className="mt-2 space-y-2">
                    {sideOptions.map((opt, i) => (
                      <div key={i} className="flex gap-2">
                        <Input
                          value={opt}
                          placeholder={`خيار وجه ${i + 1}`}
                          onChange={(e) => {
                            const newOptions = [...sideOptions];
                            newOptions[i] = e.target.value;
                            setSideOptions(newOptions);
                          }}
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          onClick={() => setSideOptions(sideOptions.filter((_, idx) => idx !== i))}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setSideOptions([...sideOptions, ""])}
                    >
                      + إضافة وجه آخر
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Material Options */}
            <Card>
              <CardHeader>
                <CardTitle>خيارات المادة</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>المواد المتاحة</Label>
                  <div className="mt-2 space-y-2">
                    {materialOptions.map((opt, i) => (
                      <div key={i} className="flex gap-2">
                        <Input
                          value={opt}
                          placeholder={`خيار مادة ${i + 1}`}
                          onChange={(e) => {
                            const newOptions = [...materialOptions];
                            newOptions[i] = e.target.value;
                            setMaterialOptions(newOptions);
                          }}
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          onClick={() => setMaterialOptions(materialOptions.filter((_, idx) => idx !== i))}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setMaterialOptions([...materialOptions, ""])}
                    >
                      + إضافة مادة أخرى
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quantity Options */}
            <Card>
              <CardHeader>
                <CardTitle>خيارات الكمية والأسعار</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {quantities.map((q, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <Input
                        type="number"
                        placeholder="الكمية"
                        value={q.quantity}
                        onChange={(e) => handleQuantityChange(index, "quantity", e.target.value)}
                      />
                      <Input
                        type="number"
                        placeholder="السعر للوحدة"
                        value={q.price}
                        onChange={(e) => handleQuantityChange(index, "price", e.target.value)}
                      />
                      <span className="font-medium w-28 text-center">
                        {q.total > 0 ? `${q.total.toFixed(2)} ر.س` : "--"}
                      </span>
                      {index > 0 && (
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          onClick={() => removeQuantityRow(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    className="flex items-center gap-2"
                    onClick={addQuantityRow}
                  >
                    + إضافة كمية أخرى
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Image Upload */}
         <Card>
  <CardHeader>
    <CardTitle>صور المنتج</CardTitle>
  </CardHeader>
  <CardContent>
    <div
      className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center cursor-pointer"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onClick={triggerFileInput}
    >
      <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
      <p className="text-muted-foreground mb-4">اسحب الصور هنا أو انقر للتحديد</p>
      <Button type="button" variant="outline" onClick={triggerFileInput}>
        اختيار الصور
      </Button>

      {/* Preview selected images OR existing */}
      <div className="mt-6 grid grid-cols-2 md:grid-cols-3 gap-3">
        {/* Show new images first */}
        {images.map((file, idx) => (
          <div key={`new-${idx}`} className="relative group">
            <img
              src={URL.createObjectURL(file)}
              alt={file.name}
              className="w-full h-24 object-cover rounded-lg"
            />
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                removeFile(idx);
              }}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X className="h-3 w-3" />
            </button>
            <div className="absolute bottom-1 left-1 bg-blue-500 text-white text-xs px-1 rounded">
              جديد
            </div>
          </div>
        ))}
        
        {/* Show existing images */}
        {existingImages.map((url, idx) => (
          <div key={`existing-${idx}`} className="relative group">
            <img
              src={url}
              alt={`existing-${idx}`}
              className="w-full h-24 object-cover rounded-lg"
            />
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                removeExistingImage(idx);
              }}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X className="h-3 w-3" />
            </button>
            <div className="absolute bottom-1 left-1 bg-gray-500 text-white text-xs px-1 rounded">
              موجود
            </div>
          </div>
        ))}
      </div>

      {/* Show message when no images */}
      {images.length === 0 && existingImages.length === 0 && (
        <div className="mt-4 text-sm text-muted-foreground">
          لم يتم إضافة أي صور بعد
        </div>
      )}

      <input
        type="file"
        id="product-image-input"
        className="hidden"
        accept="image/*"
        multiple
        onChange={handleImageChange}
        ref={inputRef}
      />
    </div>
  </CardContent>
</Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>إعدادات النشر</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="featured">منتج مميز</Label>
                  <Switch
                    id="featured"
                    checked={formData.featured}
                    onCheckedChange={(checked: boolean) => handleInputChange("featured", checked)}
                  />
                </div>

                <div>
                  <Label htmlFor="status">حالة المنتج</Label>
                  <select
                    id="status"
                    value={formData.status}
                    onChange={(e) => handleInputChange("status", e.target.value)}
                    className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm mt-2"
                  >
                    <option value="مسودة">مسودة</option>
                    <option value="نشط">نشط</option>
                    <option value="معطل">معطل</option>
                  </select>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>معاينة سريعة</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                    {existingImages[0] ? (
                      <img
                        src={existingImages[0]}
                        alt="معاينة"
                        className="object-cover w-full h-full rounded-lg"
                      />
                    ) : (
                      <span className="text-muted-foreground text-sm">صورة المنتج</span>
                    )}
                  </div>
                  <h3 className="font-semibold">{formData.title || "اسم المنتج"}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {formData.description || "وصف المنتج سيظهر هنا..."}
                  </p>
                  <div className="text-lg font-bold text-brand-yellow">
                    {formData.price ? `${formData.price} ر.س` : "السعر"}
                  </div>
                  {existingImages.length > 1 && (
                    <div className="text-xs text-muted-foreground">
                      + {existingImages.length - 1} صورة إضافية
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button 
                type="submit" 
                className="w-full bg-brand-blue hover:bg-brand-blue/90"
                disabled={uploading}
              >
                {uploading ? (
                  <>جاري الحفظ...</>
                ) : (
                  <>
                    <Save className="h-4 w-4 ml-2" />
                    حفظ التعديلات
                  </>
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => router.push("/admin/products")}
              >
                إلغاء
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}