"use client";

import type React from "react";
import { useState, useRef } from "react";
import { Save, ArrowRight, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { useRouter } from "next/navigation";
import { useProducts } from "@/app/admin/context/products";

const categories = [
  "تصميم جرافيك",
  "إعلانات وسائل التواصل",
  "تصميم مواقع ويب",
  "طباعة ونشر",
  "التصوير الفوتوغرافي",
  "الهوية التجارية",
  "التسويق الرقمي",
];

export default function NewProduct() {
  const router = useRouter();
  const { products, setProducts } = useProducts();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [files, setFiles] = useState<File[]>([]);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    category: "",
    featured: false,
    status: "مسودة",
  });

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFiles = (selectedFiles: FileList | null) => {
    if (!selectedFiles) return;
    setFiles((prev) => [...prev, ...Array.from(selectedFiles)]);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let imagePath = "/placeholder.svg"; // default

    // Upload first image if selected
    if (files[0]) {
      const formDataFile = new FormData();
      formDataFile.append("file", files[0]);

      const uploadRes = await fetch("/api/upload", {
        method: "POST",
        body: formDataFile,
      });

      const uploadData = await uploadRes.json();
      if (uploadRes.ok) {
        imagePath = uploadData.path; // ✅ this will be "/uploads/filename.png"
      }
    }

    const newProduct = {
      title: formData.title,
      description: formData.description,
      price: Number(formData.price),
      category: formData.category,
      featured: formData.featured,
      status: formData.status,
      sales: 0,
      image: imagePath, // ✅ real path
    };

    const res = await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newProduct),
    });

    if (res.ok) {
      router.push("/admin/products");
    } else {
      alert("فشل في الحفظ");
    }
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
                    <div className="mt-4 grid grid-cols-3 gap-2">
                      {files.map((file, idx) => (
                        <img
                          key={idx}
                          src={URL.createObjectURL(file)}
                          alt={file.name}
                          className="w-full h-24 object-cover rounded-lg"
                        />
                      ))}
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
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button type="submit" className="w-full bg-brand-blue hover:bg-brand-blue/90">
                <Save className="h-4 w-4 ml-2" />
                حفظ المنتج
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