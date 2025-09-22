"use client"

import { useCart } from "./CartProvider"

export default function CartPage() {
  const { items, total, removeItem, updateQuantity } = useCart()

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">سلة التسوق</h1>

      {items.length > 0 ? (
        <div>
          {items.map((item) => (
            <div key={item._id} className="border-b py-4 flex justify-between items-center">
              <div>
                <h3 className="text-xl font-semibold">{item.name}</h3>
                <p className="text-gray-600">السعر: {item.price} ر.س</p>
                <p className="text-gray-600">الكمية: {item.quantity}</p>
              </div>
              <div>
                <button
                  onClick={() => removeItem(item._id)}
                  className="bg-red-500 text-white px-4 py-2 rounded mr-2"
                >
                  إزالة
                </button>
                <button
                  onClick={() => updateQuantity(item._id, item.quantity + 1)}
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                  +
                </button>
                <button
                  onClick={() => updateQuantity(item._id, Math.max(1, item.quantity - 1))}
                  className="bg-blue-500 text-white px-4 py-2 rounded ml-2"
                >
                  -
                </button>
              </div>
            </div>
          ))}
          <div className="mt-8">
            <h2 className="text-2xl font-bold">المجموع: {total} ر.س</h2>
            <button className="bg-green-600 text-white px-6 py-3 rounded-lg mt-4">
              اتمام الشراء
            </button>
          </div>
        </div>
      ) : (
        <p>سلة التسوق فارغة</p>
      )}
    </div>
  )
}
