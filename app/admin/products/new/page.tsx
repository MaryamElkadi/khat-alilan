"use client";

import type React from "react";
import { useState, useRef, useEffect } from "react";
import { Save, ArrowRight, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { useRouter } from "next/navigation";
import { useProducts } from "@/app/admin/context/products";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
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


// ✅ Make ProductOptions a named component, not default
function ProductOptions() {
  const sizeOptions = ["A4", "A3", "A5"];
  const sideOptions = ["وجه واحد", "وجهين"];
  const materialOptions = ["ورق عادي", "ورق لامع", "بلاستيك"];
  const quantityOptions = ["100", "200", "500", "1000"];

  return (
    <div className="flex flex-col gap-4">
      {/* ✅ Size Select */}
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="اختر المقاس" />
        </SelectTrigger>
        <SelectContent>
        {sizeOptions.map((size) => (
  <SelectItem key={size} value={size}>
    {size}
  </SelectItem>
))}

        </SelectContent>
      </Select>

      {/* ✅ Side Select */}
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="اختر الوجه" />
        </SelectTrigger>
        <SelectContent>
          {sideOptions.map((side) => (
  <SelectItem key={side} value={side}>
    {side}
  </SelectItem>
))}
        </SelectContent>
      </Select>

      {/* ✅ Material Select */}
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="اختر المادة" />
        </SelectTrigger>
        <SelectContent>
         {materialOptions.map((material) => (
  <SelectItem key={material} value={material}>
    {material}
  </SelectItem>
))}
        </SelectContent>
      </Select>

      {/* ✅ Quantity Select */}
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="اختر الكمية" />
        </SelectTrigger>
        <SelectContent>
          {quantityOptions.map((option, i) => (
            <SelectItem key={i} value={option}>
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

export default function NewProduct() {
  const router = useRouter();
  const { products, setProducts } = useProducts();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
// ✨ State جديدة للمخصص
const [customSizes, setCustomSizes] = useState<string[]>([""]);
const [customSides, setCustomSides] = useState<string[]>([""]);
const [customMaterials, setCustomMaterials] = useState<string[]>([""]);

// Update state for options with prices
const [sizeOptions, setSizeOptions] = useState<{name: string, priceAddition: string}[]>([
  { name: "A4", priceAddition: "0" },
  { name: "A3", priceAddition: "0" },
  { name: "A5", priceAddition: "0" },
]);

const [sideOptions, setSideOptions] = useState<{name: string, priceAddition: string}[]>([
  { name: "وجه واحد", priceAddition: "0" },
  { name: "وجهين", priceAddition: "0" },
]);

const [materialOptions, setMaterialOptions] = useState<{name: string, priceAddition: string}[]>([
  { name: "ورق عادي", priceAddition: "0" },
  { name: "ورق لامع", priceAddition: "0" },
  { name: "بلاستيك", priceAddition: "0" },
]);


const [formData, setFormData] = useState({
  title: "",
  description: "",
  price: "",
  category: "",
  featured: false,
  status: "مسودة",
  size: "",
  sizeCustom: "",
  side: "",
  sideCustom: "",
  material: "",
  materialCustom: "",
});




  // State for tax and total price calculation
  const [calculatedPrice, setCalculatedPrice] = useState({
    subtotal: 0,
    tax: 0,
    total: 0,
  });
type QuantityRow = {
  quantity: string;
  price: string; // أضف السعر
  total: number;
};

const [quantities, setQuantities] = useState<QuantityRow[]>([
  { quantity: "", price: "", total: 0 },
]);

  // ✅ تحديث useEffect لحساب السعر مع الإضافات
useEffect(() => {
  const basePrice = parseFloat(formData.price) || 0;

  // نحدد الاختيارات الحالية من state
  const selectedSize = sizeOptions.find(opt => opt.name === formData.size);
  const selectedSide = sideOptions.find(opt => opt.name === formData.side);
  const selectedMaterial = materialOptions.find(opt => opt.name === formData.material);

  // نحسب الإضافات
  const sizeAddition = selectedSize ? parseFloat(selectedSize.priceAddition) || 0 : 0;
  const sideAddition = selectedSide ? parseFloat(selectedSide.priceAddition) || 0 : 0;
  const materialAddition = selectedMaterial ? parseFloat(selectedMaterial.priceAddition) || 0 : 0;

  // المجموع قبل الضريبة
  const subtotal = basePrice + sizeAddition + sideAddition + materialAddition;

  // الضريبة
  const taxAmount = subtotal * 0.15;
  const totalAmount = subtotal + taxAmount;

  setCalculatedPrice({
    subtotal,
    tax: taxAmount,
    total: totalAmount,
  });
}, [formData.price, formData.size, formData.side, formData.material, sizeOptions, sideOptions, materialOptions]);

const handleQuantityChange = (index: number, field: "quantity" | "price", value: string) => {
  const newQuantities = [...quantities];
  newQuantities[index][field] = value;

  const qty = parseInt(newQuantities[index].quantity) || 0;
  const price = parseFloat(newQuantities[index].price) || 0;

  newQuantities[index].total = calculateTotal(price, qty);
  setQuantities(newQuantities);
};
const handleCustomChange = (
  type: "size" | "side" | "material",
  index: number,
  value: string
) => {
  if (type === "size") {
    const updated = [...customSizes];
    updated[index] = value;
    setCustomSizes(updated);
  } else if (type === "side") {
    const updated = [...customSides];
    updated[index] = value;
    setCustomSides(updated);
  } else if (type === "material") {
    const updated = [...customMaterials];
    updated[index] = value;
    setCustomMaterials(updated);
  }
};

const addCustomField = (type: "size" | "side" | "material") => {
  if (type === "size") setCustomSizes([...customSizes, ""]);
  if (type === "side") setCustomSides([...customSides, ""]);
  if (type === "material") setCustomMaterials([...customMaterials, ""]);
};

// دالة لحذف حقل
const removeCustomField = (type: "size" | "side" | "material", index: number) => {
  if (type === "size") setCustomSizes(customSizes.filter((_, i) => i !== index));
  if (type === "side") setCustomSides(customSides.filter((_, i) => i !== index));
  if (type === "material") setCustomMaterials(customMaterials.filter((_, i) => i !== index));
};

// ✨ إضافة صف كمية جديد
const addQuantityRow = () => {
  setQuantities([...quantities, { quantity: "", total: 0 }]);
};

// ✨ حذف صف كمية
const removeQuantityRow = (index: number) => {
  setQuantities(quantities.filter((_, i) => i !== index));
};

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFiles = (selectedFiles: FileList | null) => {
    if (!selectedFiles) return;
    setFiles((prev) => [...prev, ...Array.from(selectedFiles)]);
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
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
  const handleOptionChange = (
  type: "size" | "side" | "material", 
  index: number, 
  field: "name" | "priceAddition", 
  value: string
) => {
  if (type === "size") {
    const newOptions = [...sizeOptions];
    newOptions[index][field] = value;
    setSizeOptions(newOptions);
  } else if (type === "side") {
    const newOptions = [...sideOptions];
    newOptions[index][field] = value;
    setSideOptions(newOptions);
  } else if (type === "material") {
    const newOptions = [...materialOptions];
    newOptions[index][field] = value;
    setMaterialOptions(newOptions);
  }
};

// Update the option removal
const removeOption = (type: "size" | "side" | "material", index: number) => {
  if (type === "size") {
    setSizeOptions(sizeOptions.filter((_, i) => i !== index));
  } else if (type === "side") {
    setSideOptions(sideOptions.filter((_, i) => i !== index));
  } else if (type === "material") {
    setMaterialOptions(materialOptions.filter((_, i) => i !== index));
  }
};

// Update the option addition
const addOption = (type: "size" | "side" | "material") => {
  const newOption = { name: "", priceAddition: "0" };
  if (type === "size") setSizeOptions([...sizeOptions, newOption]);
  if (type === "side") setSideOptions([...sideOptions, newOption]);
  if (type === "material") setMaterialOptions([...materialOptions, newOption]);
};

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setUploading(true);

  // Validate required fields
  if (!formData.title || !formData.description || !formData.price || !formData.category) {
    alert("يرجى ملء جميع الحقول المطلوبة");
    setUploading(false);
    return;
  }

  // Validate images
  if (files.length === 0) {
    alert("يرجى إضافة صورة واحدة على الأقل للمنتج");
    setUploading(false);
    return;
  }

  const productFormData = new FormData();
  productFormData.append("title", formData.title);
  productFormData.append("price", formData.price);
  productFormData.append("description", formData.description); 
  productFormData.append("category", formData.category);
  productFormData.append("featured", String(formData.featured));
  productFormData.append("status", formData.status);

  // Prepare options with price additions
  const preparedSizeOptions = sizeOptions
    .filter(opt => opt.name.trim() !== "")
    .map(opt => ({
      name: opt.name,
      priceAddition: parseFloat(opt.priceAddition) || 0
    }));

  const preparedSideOptions = sideOptions
    .filter(opt => opt.name.trim() !== "")
    .map(opt => ({
      name: opt.name,
      priceAddition: parseFloat(opt.priceAddition) || 0
    }));

  const preparedMaterialOptions = materialOptions
    .filter(opt => opt.name.trim() !== "")
    .map(opt => ({
      name: opt.name,
      priceAddition: parseFloat(opt.priceAddition) || 0
    }));

  productFormData.append("sizeOptions", JSON.stringify(preparedSizeOptions));
  productFormData.append("sideOptions", JSON.stringify(preparedSideOptions));
  productFormData.append("materialOptions", JSON.stringify(preparedMaterialOptions));

  // Prepare quantity options
  const parsedQuantityOptions = quantities
    .filter((q) => q.quantity && q.price)
    .map((q) => ({
      quantity: parseInt(q.quantity),
      price: parseFloat(q.price),
      total: q.total,
    }));

  productFormData.append("quantityOptions", JSON.stringify(parsedQuantityOptions));

  // Append all image files
  files.forEach((file) => {
    productFormData.append("images", file);
  });

  try {
    const res = await fetch("/api/products", {
      method: "POST",
      body: productFormData,
    });

    const result = await res.json();

    if (res.ok) {
      alert("تم حفظ المنتج بنجاح!");
      router.push("/admin/products");
    } else {
      console.error("Server error:", result);
      alert(`فشل في الحفظ: ${result.error || "حدث خطأ غير معروف"}`);
    }
  } catch (error) {
    console.error("Network error:", error);
    alert("حدث خطأ في الشبكة أثناء حفظ المنتج");
  } finally {
    setUploading(false);
  }
};

const calculateTotal = (price: number, quantity: number) => {
  const subtotal = price * quantity;
  const tax = subtotal * 0.15;
  return subtotal + tax;
};

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Button variant="ghost" onClick={() => router.back()} className="p-2">
          <ArrowRight className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-brand-blue">إضافة منتج جديد</h1>
          <p className="text-muted-foreground mt-1">أضف منتج أو خدمة جديدة إلى الكتالوج</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="max-w-4xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Info */}
            <Card>
              <CardHeader>
                <CardTitle>معلومات المنتج الأساسية</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="title">اسم المنتج *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    placeholder="مثال: باقة تصميم الشعار الاحترافية"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="description">وصف المنتج *</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    placeholder="اكتب وصفاً مفصلاً للمنتج أو الخدمة..."
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
                      placeholder="1500"
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

 <Card>
  <CardHeader>
    <CardTitle>خيارات المقاس مع الأسعار الإضافية</CardTitle>
  </CardHeader>
  <CardContent className="space-y-4">
    <div>
      <Label>المقاسات المتاحة والسعر الإضافي</Label>
      <div className="mt-2 space-y-2">
        {sizeOptions.map((opt, i) => (
          <div key={i} className="flex gap-2 items-center">
            <Input
              value={opt.name}
              placeholder={`اسم المقاس ${i + 1}`}
              onChange={(e) => handleOptionChange("size", i, "name", e.target.value)}
              className="flex-1"
            />
            <Input
              type="number"
              value={opt.priceAddition}
              placeholder="السعر الإضافي"
              onChange={(e) => handleOptionChange("size", i, "priceAddition", e.target.value)}
              className="w-32"
            />
            <span className="text-sm text-muted-foreground">ر.س</span>
            <Button
              type="button"
              variant="destructive"
              size="icon"
              onClick={() => removeOption("size", i)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          onClick={() => addOption("size")}
        >
          + إضافة مقاس آخر
        </Button>
      </div>
    </div>
  </CardContent>
</Card>


{/* الحجم */}
<Card>
  <CardHeader>
    <CardTitle>خيارات الحجم مع الأسعار الإضافية</CardTitle>
  </CardHeader>
  <CardContent className="space-y-4">
    <div>
      <Label>الاحجام المتاحة والسعر الإضافي</Label>
      <div className="mt-2 space-y-2">
        {sideOptions.map((opt, i) => (
          <div key={i} className="flex gap-2 items-center">
            <Input
              value={opt.name}
              placeholder={`اسم الحجم ${i + 1}`}
              onChange={(e) => handleOptionChange("side", i, "name", e.target.value)}
              className="flex-1"
            />
            <Input
              type="number"
              value={opt.priceAddition}
              placeholder="السعر الإضافي"
              onChange={(e) => handleOptionChange("side", i, "priceAddition", e.target.value)}
              className="w-32"
            />
            <span className="text-sm text-muted-foreground">ر.س</span>
            <Button
              type="button"
              variant="destructive"
              size="icon"
              onClick={() => removeOption("side", i)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          onClick={() => addOption("side")}
        >
          + إضافة حجم آخر
        </Button>
      </div>
    </div>
  </CardContent>
</Card>
{/* المادة */}
<Card>
  <CardHeader>
    <CardTitle>خيارات المادة مع الأسعار الإضافية</CardTitle>
  </CardHeader>
  <CardContent className="space-y-4">
    <div>
      <Label>المواد المتاحة والسعر الإضافي</Label>
      <div className="mt-2 space-y-2">
        {materialOptions.map((opt, i) => (
          <div key={i} className="flex gap-2 items-center">
            <Input
              value={opt.name}
              placeholder={`اسم المادة ${i + 1}`}
              onChange={(e) => handleOptionChange("material", i, "name", e.target.value)}
              className="flex-1"
            />
            <Input
              type="number"
              value={opt.priceAddition}
              placeholder="السعر الإضافي"
              onChange={(e) => handleOptionChange("material", i, "priceAddition", e.target.value)}
              className="w-32"
            />
            <span className="text-sm text-muted-foreground">ر.س</span>
            <Button
              type="button"
              variant="destructive"
              size="icon"
              onClick={() => removeOption("material", i)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          onClick={() => addOption("material")}
        >
          + إضافة مادة آخر
        </Button>
      </div>
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
                  onClick={() => inputRef.current?.click()}
                >
                  <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground mb-4">اسحب الصور هنا أو انقر للتحديد</p>
                  <Button type="button" variant="outline" onClick={() => inputRef.current?.click()}>
                    اختيار الصور
                  </Button>
                  <input
                    type="file"
                    ref={inputRef}
                    multiple
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleFiles(e.target.files)}
                  />

                  {/* Preview selected images */}
                  {files.length > 0 && (
                    <div className="mt-6">
                      <h3 className="text-sm font-medium mb-3">الصور المحددة:</h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {files.map((file, idx) => (
                          <div key={idx} className="relative group">
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
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Publishing Settings */}
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
                    onCheckedChange={(checked) => handleInputChange("featured", checked)}
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

            {/* Quick Preview */}
         <Card>
  <CardHeader>
    <CardTitle>معاينة سريعة</CardTitle>
  </CardHeader>
  <CardContent>
    <div className="space-y-3">
      <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
        {files[0] ? (
          <img
            src={URL.createObjectURL(files[0])}
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
      {files.length > 1 && (
        <div className="text-xs text-muted-foreground">
          + {files.length - 1} صورة إضافية
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
                    حفظ المنتج
                  </>
                )}
              </Button>
              <Button type="button" variant="outline" className="w-full bg-transparent" onClick={() => router.back()}>
                إلغاء
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
