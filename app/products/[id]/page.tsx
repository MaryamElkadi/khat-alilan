"use client";

import { useState, useEffect, use } from "react";
import { motion } from "framer-motion";
import { ArrowRight, ShoppingCart, Star, Heart, Share2 } from "lucide-react";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCart } from "@/lib/CartProvider";
import { useRouter } from "next/navigation";

interface ProductDetailPageProps {
  params: { id: string };
}
interface Product {
  _id: string;
  title: string;
  description: string;
  price: number;
  image: string[];
  category: string;
  quantityOptions: { quantity: number; price: number }[];
  featured: boolean;
  sizeOptions: string[] | { name: string; priceAddition: number }[]; // Updated
  sideOptions: string[] | { name: string; priceAddition: number }[]; // Updated
  materialOptions: string[] | { name: string; priceAddition: number }[]; // Updated
}


export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { addItem } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const [selectedImage, setSelectedImage] = useState<string | null>(null);
const [selectedSize, setSelectedSize] = useState<{name: string, priceAddition: number} | null>(null);
const [selectedSide, setSelectedSide] = useState<{name: string, priceAddition: number} | null>(null);
const [selectedMaterial, setSelectedMaterial] = useState<{name: string, priceAddition: number} | null>(null);
  const [selectedQuantityOption, setSelectedQuantityOption] = useState<
    { quantity: number; price: number } | null
  >(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/products/${id}`);
        if (!res.ok) throw new Error("Product not found");
        const data = await res.json();
        setProduct(data);
        setSelectedImage(data.image[0]);
      } catch (err) {
        console.error("Error fetching product:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);


const [designFile, setDesignFile] = useState<File | null>(null);

const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  if (e.target.files && e.target.files[0]) {
    setDesignFile(e.target.files[0]);
  }
};
const handleAddToCart = () => {
  if (!product) return;

  const productWithOptions = {
    ...product,
    price: currentPrice.total,
    selectedSize,
    selectedSide,
    selectedMaterial,
    selectedQuantity: selectedQuantityOption
      ? selectedQuantityOption.quantity
      : 1,
    designFile, // ✅ التصميم المرفوع يروح مع الطلب
  };

  addItem(productWithOptions);
};


  const goBack = () => {
    router.back();
  };
const calculateTotalPrice = () => {
  if (!product) return { subtotal: 0, tax: 0, total: 0 };
  
  const basePrice = selectedQuantityOption ? selectedQuantityOption.price : product.price;
  
  // Helper function to get price addition from selected option
  const getPriceAddition = (option: {name: string, priceAddition: number} | null) => {
    return option ? option.priceAddition : 0;
  };
  
  const subtotal = basePrice + getPriceAddition(selectedSize) + getPriceAddition(selectedSide) + getPriceAddition(selectedMaterial);
  const tax = subtotal * 0.15;
  
  return {
    subtotal,
    tax,
    total: subtotal + tax
  };
};

const currentPrice = calculateTotalPrice();


  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-yellow mx-auto mb-4"></div>
          <p>جاري تحميل المنتج...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">المنتج غير موجود</h1>
          <Button onClick={goBack} variant="outline">
            <ArrowRight className="h-4 w-4 ml-2" />
            العودة
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <main className="pt-8">
        {/* Breadcrumb */}
        <section className="py-4 border-b border-border">
          <div className="container mx-auto px-4">
            <Button
              variant="ghost"
              onClick={goBack}
              className="text-brand-blue hover:text-brand-yellow"
            >
              <ArrowRight className="h-4 w-4 ml-2" />
              العودة إلى المنتجات
            </Button>
          </div>
        </section>

        {/* Product Details */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* ✅ Product Gallery */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="relative"
              >
                <div className="w-full">
                  <div className="w-full h-80 md:h-[400px] lg:h-[500px] overflow-hidden rounded-lg border">
                    <img
                      src={selectedImage || "/placeholder.svg"}
                      alt={product.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Thumbnails */}
                  <div className="flex gap-3 mt-4 justify-center">
                    {Array.isArray(product.image) &&
                      product.image.map((img, idx) => (
                        <button
                          key={idx}
                          onClick={() => setSelectedImage(img)}
                          className={`w-20 h-20 rounded-lg border overflow-hidden ${
                            selectedImage === img
                              ? "ring-2 ring-primary"
                              : "opacity-70 hover:opacity-100"
                          }`}
                        >
                          <img
                            src={img}
                            alt={`${product.title} ${idx + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ))}
                  </div>
                </div>
              </motion.div>

              {/* Product Info */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="space-y-6"
              >
                <div>
                  <Badge
                    variant="outline"
                    className="mb-4 border-brand-blue text-brand-blue"
                  >
                    {product.category}
                  </Badge>
                  <h1 className="text-3xl lg:text-4xl font-bold mb-4 text-white">
                    {product.title}
                  </h1>
                  <div className="flex items-center mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="h-5 w-5 fill-brand-yellow text-brand-yellow"
                      />
                    ))}
                    <span className="text-muted-foreground mr-2">(4.8)</span>
                  </div>
                </div>

                {/* ✅ السعر */}
                <div className="space-y-2">
                  <div className="text-xl text-muted-foreground">
                    السعر قبل الضريبة:{" "}
                    {selectedQuantityOption
                      ? selectedQuantityOption.price.toLocaleString()
                      : product.price.toLocaleString()}{" "}
                    ر.س
                  </div>
                  <div className="text-3xl font-bold text-brand-yellow">
                    السعر بعد الضريبة:{" "}
                    {(
                      (selectedQuantityOption
                        ? selectedQuantityOption.price
                        : product.price) * 1.15
                    ).toFixed(2)}{" "}
                    ر.س
                  </div>
                </div>

                <p className="text-muted-foreground text-lg leading-relaxed">
                  {product.description}
                </p>

                {/* ✅ حجم / مقاس / مادة */}
 {/* ✅ المقاس (Size) */}
<div>
  <h3 className="font-semibold text-white mb-2">اختر المقاس:</h3>
  <Select 
    value={selectedSize?.name || ""} 
    onValueChange={(value) => {
      // Handle case where product.sizeOptions might be undefined or have different structure
      const sizeOptions = product?.sizeOptions || [];
      const option = typeof sizeOptions[0] === 'string' 
        ? { name: value, priceAddition: 0 } // Fallback for old string format
        : sizeOptions.find((opt: any) => opt?.name === value);
      setSelectedSize(option || null);
    }}
  >
    <SelectTrigger className="w-full">
      <SelectValue placeholder="اختر المقاس المطلوب" />
    </SelectTrigger>
    <SelectContent>
      {product?.sizeOptions && product.sizeOptions.length > 0 ? (
        // Handle both string array and object array formats
        product.sizeOptions.map((opt: any, i: number) => {
          const optionName = typeof opt === 'string' ? opt : opt?.name;
          const priceAddition = typeof opt === 'string' ? 0 : opt?.priceAddition || 0;
          
          return (
            <SelectItem key={i} value={optionName}>
              {optionName} {priceAddition > 0 ? `(+${priceAddition} ر.س)` : ""}
            </SelectItem>
          );
        })
      ) : (
        <SelectItem value="no-options">لا توجد خيارات متاحة</SelectItem>
      )}
    </SelectContent>
  </Select>
</div>

{/* ✅ الحجم (Side) */}
<div>
  <h3 className="font-semibold text-white mb-2">اختر الحجم:</h3>
  <Select 
    value={selectedSide?.name || ""} 
    onValueChange={(value) => {
      const sideOptions = product?.sideOptions || [];
      const option = typeof sideOptions[0] === 'string'
        ? { name: value, priceAddition: 0 }
        : sideOptions.find((opt: any) => opt?.name === value);
      setSelectedSide(option || null);
    }}
  >
    <SelectTrigger className="w-full">
      <SelectValue placeholder="اختر الحجم المطلوب" />
    </SelectTrigger>
    <SelectContent>
      {product?.sideOptions && product.sideOptions.length > 0 ? (
        product.sideOptions.map((opt: any, i: number) => {
          const optionName = typeof opt === 'string' ? opt : opt?.name;
          const priceAddition = typeof opt === 'string' ? 0 : opt?.priceAddition || 0;
          
          return (
            <SelectItem key={i} value={optionName}>
              {optionName} {priceAddition > 0 ? `(+${priceAddition} ر.س)` : ""}
            </SelectItem>
          );
        })
      ) : (
        <SelectItem value="no-options">لا توجد خيارات متاحة</SelectItem>
      )}
    </SelectContent>
  </Select>
</div>

{/* ✅ المادة (Material) */}
<div>
  <h3 className="font-semibold text-white mb-2">اختر المادة:</h3>
  <Select 
    value={selectedMaterial?.name || ""} 
    onValueChange={(value) => {
      const materialOptions = product?.materialOptions || [];
      const option = typeof materialOptions[0] === 'string'
        ? { name: value, priceAddition: 0 }
        : materialOptions.find((opt: any) => opt?.name === value);
      setSelectedMaterial(option || null);
    }}
  >
    <SelectTrigger className="w-full">
      <SelectValue placeholder="اختر المادة المطلوبة" />
    </SelectTrigger>
    <SelectContent>
      {product?.materialOptions && product.materialOptions.length > 0 ? (
        product.materialOptions.map((opt: any, i: number) => {
          const optionName = typeof opt === 'string' ? opt : opt?.name;
          const priceAddition = typeof opt === 'string' ? 0 : opt?.priceAddition || 0;
          
          return (
            <SelectItem key={i} value={optionName}>
              {optionName} {priceAddition > 0 ? `(+${priceAddition} ر.س)` : ""}
            </SelectItem>
          );
        })
      ) : (
        <SelectItem value="no-options">لا توجد خيارات متاحة</SelectItem>
      )}
    </SelectContent>
  </Select>
</div>
{/* ✅ الكمية */}
<div>
  <h3 className="font-semibold text-white mb-2">اختر الكمية:</h3>
  <Select
  value={selectedQuantityOption?.quantity ? String(selectedQuantityOption.quantity) : undefined}
  onValueChange={(value) => {
    const option = product.quantityOptions.find(
      (opt: { quantity: number; price: number }) =>
        String(opt.quantity) === value
    );
    setSelectedQuantityOption(option || null);
  }}
>
  <SelectTrigger className="w-full">
    <SelectValue placeholder="اختر الكمية المطلوبة" />
  </SelectTrigger>
<SelectContent>
  {product.quantityOptions?.length > 0 ? (
    product.quantityOptions
      .filter((opt) => opt?.quantity !== undefined && opt?.price !== undefined)
      .map((option: { quantity: number; price: number }) => (
        <SelectItem key={option.quantity} value={String(option.quantity)}>
         نسخة =  {option.quantity} / {option.price.toLocaleString()} ر.س
        </SelectItem>
      ))
  ) : (
    <SelectItem value="default">لا توجد خيارات متاحة</SelectItem>
  )}
</SelectContent>

</Select>

</div>
            {product.category === "طباعة رقمية" && (
  <div>
    <h3 className="font-semibold text-white mb-2">ارفع التصميم:</h3>
    <input
      type="file"
      accept="image/*,.pdf"
      onChange={handleFileChange}
      className="text-white"
    />
    {designFile && (
      <p className="text-sm text-green-400 mt-2">
        تم اختيار: {designFile.name}
      </p>
    )}
  </div>
)}


                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    onClick={handleAddToCart}
                    disabled={
                      !selectedSize || !selectedSide || !selectedMaterial
                    }
                    className="flex-1 bg-brand-blue hover:bg-brand-blue/90 text-white py-3 text-lg"
                  >
                    <ShoppingCart className="h-5 w-5 ml-2" />
                    أضف إلى السلة
                  </Button>
                  <Button
                    variant="outline"
                    className="border-brand-yellow text-brand-yellow hover:bg-brand-yellow hover:text-black bg-transparent"
                  >
                    <Heart className="h-5 w-5 ml-2" />
                    إضافة للمفضلة
                  </Button>
                  <Button
                    variant="outline"
                    className="border-muted-foreground text-muted-foreground hover:bg-muted bg-transparent"
                  >
                    <Share2 className="h-5 w-5 ml-2" />
                    مشاركة
                  </Button>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
