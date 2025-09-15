"use client"

import { useEffect, useState } from "react";

export default function CartPage() {
  const [cart, setCart] = useState<any>(null);
  const userId = "123"; // later replace with logged-in user ID

  useEffect(() => {
    const fetchCart = async () => {
      const res = await fetch(`/api/cart?userId=${userId}`);
      const data = await res.json();
      setCart(data);
    };
    fetchCart();
  }, []);

  // Example: remove item
  const removeItem = async (productId: string) => {
    const res = await fetch(`/api/cart`, {
      method: "DELETE",
      body: JSON.stringify({ userId, productId }),
    });
    const data = await res.json();
    setCart(data);
  };

  // Example: update quantity
  const updateQuantity = async (productId: string, quantity: number) => {
    const res = await fetch(`/api/cart`, {
      method: "PUT",
      body: JSON.stringify({ userId, productId, quantity }),
    });
    const data = await res.json();
    setCart(data);
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">سلة التسوق</h1>
      
      {cart ? (
        <div>
          {cart.items && cart.items.length > 0 ? (
            <div>
              {cart.items.map((item: any) => (
                <div key={item.productId} className="border-b py-4 flex justify-between items-center">
                  <div>
                    <h3 className="text-xl font-semibold">{item.name}</h3>
                    <p className="text-gray-600">السعر: {item.price} ر.س</p>
                    <p className="text-gray-600">الكمية: {item.quantity}</p>
                  </div>
                  <div>
                    <button 
                      onClick={() => removeItem(item.productId)}
                      className="bg-red-500 text-white px-4 py-2 rounded mr-2"
                    >
                      إزالة
                    </button>
                    <button 
                      onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                      className="bg-blue-500 text-white px-4 py-2 rounded"
                    >
                      +
                    </button>
                    <button 
                      onClick={() => updateQuantity(item.productId, Math.max(1, item.quantity - 1))}
                      className="bg-blue-500 text-white px-4 py-2 rounded ml-2"
                    >
                      -
                    </button>
                  </div>
                </div>
              ))}
              <div className="mt-8">
                <h2 className="text-2xl font-bold">المجموع: {cart.total} ر.س</h2>
                <button className="bg-green-600 text-white px-6 py-3 rounded-lg mt-4">
                  اتمام الشراء
                </button>
              </div>
            </div>
          ) : (
            <p>سلة التسوق فارغة</p>
          )}
        </div>
      ) : (
        <p>جاري تحميل سلة التسوق...</p>
      )}
    </div>
  );
}