"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"

export default function ProductDetails() {
  const { id } = useParams()
  const [product, setProduct] = useState<any>(null)

  useEffect(() => {
    async function fetchProduct() {
      const res = await fetch(`/api/products/${id}`)
      const data = await res.json()
      setProduct(data)
    }
    fetchProduct()
  }, [id])

  if (!product) return <div className="p-8">جاري التحميل...</div>

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">{product.title}</h1>
      <img src={product.image} alt={product.title} className="w-64 h-64 object-cover mb-4" />
      <p className="mb-4">{product.description}</p>
      <div className="text-lg font-semibold">السعر: {product.price} ر.س</div>
      <div className="mt-2">الحالة: {product.status}</div>
      <div className="mt-2">الفئة: {product.category}</div>
    </div>
  )
}
