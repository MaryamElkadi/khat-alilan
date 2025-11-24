"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ShoppingCart, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useCart } from "@/lib/CartProvider";
import type { Product } from "@/lib/types";

export default function ProductDetails({ params }: { params: { id: string } }) {
  const { id } = params;
  const router = useRouter();
  const { addItem } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selected, setSelected] = useState({
    size: "",
    side: "",
    material: "",
    quantity: "",
  });

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/products/${id}`);
        const data = await res.json();
        const p = data.product || data.data || data;

        const normalized: Product = {
          _id: p._id,
          title: p.title,
          description: p.description,
          price: p.price || 0,
          category: p.category,
          featured: p.featured,
          status: p.status,
          image: Array.isArray(p.image) ? p.image : [p.image],
          sizeOptions: p.sizeOptions || [],
          sideOptions: p.sideOptions || [],
          materialOptions: p.materialOptions || [],
          quantityOptions: p.quantityOptions || [],
        };

        setProduct(normalized);

        // Default option selections
        setSelected({
          size: normalized.sizeOptions[0]?.name || "",
          side: normalized.sideOptions[0]?.name || "",
          material: normalized.materialOptions[0]?.name || "",
          quantity: normalized.quantityOptions[0]?.quantity?.toString() || "",
        });
      } catch {
        setError("Failed loading product");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [id]);

  // ---------------- CALCULATE PRICE ---------------- //
  const calculatePrice = () => {
    if (!product) return 0;

    let price = product.price;

    const size = product.sizeOptions.find((s) => s.name === selected.size);
    const side = product.sideOptions.find((s) => s.name === selected.side);
    const material = product.materialOptions.find((m) => m.name === selected.material);
    const quantity = product.quantityOptions.find(
      (q) => q.quantity.toString() === selected.quantity
    );

    if (size) price += size.price;
    if (side) price += side.price;
    if (material) price += material.price;
    if (quantity) price = quantity.price;

    const final = price * 1.15;
    return { base: price, tax: final - price, total: final };
  };

  const { base, tax, total } = calculatePrice();

  const handleAddToCart = () => {
    if (!product) return;
    addItem({
      ...product,
      selectedOptions: selected,
      finalPrice: total,
    });
  };

  if (loading) return <div className="pt-20 text-center text-white">Loading...</div>;
  if (error || !product) return <div className="pt-20 text-center text-red-500">{error}</div>;

  return (
    <div className="min-h-screen bg-black text-white pt-20">
      <div className="container mx-auto px-4 py-8">
        
        {/* BREADCRUMB */}
        <nav className="flex gap-2 text-gray-400 text-sm mb-8">
          <button onClick={() => router.push("/")}>الرئيسية</button>
          <ArrowRight className="h-3 w-3" />
          <button onClick={() => router.push("/products")}>المنتجات</button>
          <ArrowRight className="h-3 w-3" />
          <span>{product.title}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          
          {/* LEFT IMAGES */}
          <div>
            <div className="aspect-square bg-gray-800 rounded-lg overflow-hidden">
              <img src={product.image[currentImageIndex]} className="w-full h-full object-cover" />
            </div>

            {/* Thumbnails */}
            {product.image.length > 1 && (
              <div className="flex gap-3 mt-4">
                {product.image.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-20 h-20 rounded border ${
                      currentImageIndex === index ? "border-primary" : "border-gray-700"
                    }`}
                  >
                    <img src={img} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT INFO */}
          <div>
            <Badge className="mb-3">{product.category}</Badge>
            <h1 className="text-3xl font-bold mb-3">{product.title}</h1>
            <p className="text-gray-400 mb-6">{product.description}</p>

            {/* ------------ OPTIONS ------------ */}

            {/* SIZE */}
            {product.sizeOptions.length > 0 && (
              <div className="mb-4">
                <label className="text-gray-300">المقاس:</label>
                <select
                  value={selected.size}
                  onChange={(e) =>
                    setSelected((prev) => ({ ...prev, size: e.target.value }))
                  }
                  className="w-full p-3 rounded bg-gray-800 border border-gray-700 mt-2"
                >
                  {product.sizeOptions.map((s) => (
                    <option key={s.name} value={s.name}>
                      {s.name} — {s.price} ر.س
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* SIDE */}
            {product.sideOptions.length > 0 && (
              <div className="mb-4">
                <label className="text-gray-300">الجهة:</label>
                <select
                  value={selected.side}
                  onChange={(e) =>
                    setSelected((prev) => ({ ...prev, side: e.target.value }))
                  }
                  className="w-full p-3 rounded bg-gray-800 border border-gray-700 mt-2"
                >
                  {product.sideOptions.map((s) => (
                    <option key={s.name} value={s.name}>
                      {s.name} — {s.price} ر.س
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* MATERIAL */}
            {product.materialOptions.length > 0 && (
              <div className="mb-4">
                <label className="text-gray-300">الخامة:</label>
                <select
                  value={selected.material}
                  onChange={(e) =>
                    setSelected((prev) => ({ ...prev, material: e.target.value }))
                  }
                  className="w-full p-3 rounded bg-gray-800 border border-gray-700 mt-2"
                >
                  {product.materialOptions.map((m) => (
                    <option key={m.name} value={m.name}>
                      {m.name} — {m.price} ر.س
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* QUANTITY */}
            {product.quantityOptions.length > 0 && (
              <div className="mb-6">
                <label className="text-gray-300">الكمية:</label>
                <select
                  value={selected.quantity}
                  onChange={(e) =>
                    setSelected((prev) => ({ ...prev, quantity: e.target.value }))
                  }
                  className="w-full p-3 rounded bg-gray-800 border border-gray-700 mt-2"
                >
                  {product.quantityOptions.map((q) => (
                    <option key={q.quantity} value={q.quantity}>
                      {q.quantity} — {q.price} ر.س
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* ------------ PRICE BOX ------------ */}
            <Card className="bg-gray-900 border-gray-700 mb-6">
              <CardContent className="p-4">
                <p className="text-lg">السعر الأساسي: {base.toFixed(2)} ر.س</p>
                <p className="text-lg text-yellow-400">الضريبة (15%): {tax.toFixed(2)} ر.س</p>
                <p className="text-2xl font-bold text-green-400 mt-2">
                  السعر النهائي: {total.toFixed(2)} ر.س
                </p>
              </CardContent>
            </Card>

            {/* ADD TO CART */}
            <Button className="w-full flex items-center gap-2" onClick={handleAddToCart}>
              <ShoppingCart className="w-5 h-5" />
              أضف إلى السلة
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
