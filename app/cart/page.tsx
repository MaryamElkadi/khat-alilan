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
