"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, Eye, Trash2, Edit, ShoppingCart, Package, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function OrdersManagement() {
  const [orders, setOrders] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
const [editOrder, setEditOrder] = useState<any | null>(null);

  const [showForm, setShowForm] = useState(false);
  const [newOrder, setNewOrder] = useState({
    customer: "",
    total: 0,
    items: 1,
    status: "قيد التنفيذ",
  });

  // جلب الطلبات من الـ API
  useEffect(() => {
    fetch("/api/orders")
      .then((res) => res.json())
      .then((data) => setOrders(data));
  }, []);

  // حذف طلب
  const deleteOrder = async (id: string) => {
    const res = await fetch(`/api/orders/${id}`, { method: "DELETE" });
    if (res.ok) {
      setOrders(orders.filter((o) => o._id !== id));
    }
  };

  // إضافة طلب جديد
  const addOrder = async () => {
    const res = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newOrder),
    });
    if (res.ok) {
      const saved = await res.json();
      setOrders([saved, ...orders]);
      setShowForm(false);
      setNewOrder({ customer: "", total: 0, items: 1, status: "قيد التنفيذ" });
    }
  };

  const filteredOrders = orders.filter(
    (order) =>
      order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-brand-blue">إدارة الطلبات</h1>
          <p className="text-muted-foreground mt-1">متابعة الطلبات وحالة التنفيذ</p>
        </div>
        <Button onClick={() => setShowForm(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" /> إضافة طلب جديد
        </Button>
      </div>

      {/* Search */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="relative flex-1">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="البحث في الطلبات..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pr-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Orders List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredOrders.map((order, index) => (
          <motion.div
            key={order._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="overflow-hidden hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-lg">{order._id}</CardTitle>
                <Badge
                  variant={
                    order.status === "مكتمل"
                      ? "default"
                      : order.status === "قيد التنفيذ"
                      ? "secondary"
                      : "destructive"
                  }
                >
                  {order.status}
                </Badge>
              </CardHeader>
              <CardContent>
                <p className="text-sm mb-2">العميل: {order.customer}</p>
<p className="text-sm mb-2">
  عدد المنتجات: {Array.isArray(order.items) ? order.items.length : order.items}
</p>
                <p className="font-bold text-brand-yellow">
                  {order.total.toLocaleString()} ر.س
                </p>
                <div className="flex gap-2 mt-4">
                  <Button
  size="sm"
  variant="outline"
  className="flex-1"
  onClick={() => setSelectedOrder(order)}
>
  <Eye className="h-4 w-4 ml-1" />
  عرض
</Button>

              <Button
  size="sm"
  variant="outline"
  className="flex-1"
  onClick={() => setEditOrder(order)}
>
  <Edit className="h-4 w-4 ml-1" />
  تعديل
</Button>

                  <Button
                    size="sm"
                    variant="outline"
                    className="text-red-500 hover:text-red-600"
                    onClick={() => deleteOrder(order._id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
        <Card>
          <CardContent className="p-6 text-center">
            <ShoppingCart className="h-8 w-8 text-brand-blue mx-auto mb-2" />
            <div className="text-2xl font-bold">{orders.length}</div>
            <div className="text-sm text-muted-foreground">إجمالي الطلبات</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <Package className="h-8 w-8 text-green-500 mx-auto mb-2" />
            <div className="text-2xl font-bold">
              {orders.filter((o) => o.status === "مكتمل").length}
            </div>
            <div className="text-sm text-muted-foreground">مكتملة</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="h-8 w-8 bg-red-500 rounded-full mx-auto mb-2"></div>
            <div className="text-2xl font-bold">
              {orders.filter((o) => o.status === "ملغي").length}
            </div>
            <div className="text-sm text-muted-foreground">ملغاة</div>
          </CardContent>
        </Card>
      </div>

      {/* Add Order Form (Modal) */}
      {showForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 text-black">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>إضافة طلب جديد</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                placeholder="اسم العميل"
                value={newOrder.customer}
                onChange={(e) => setNewOrder({ ...newOrder, customer: e.target.value })}
              />
              <Input
                type="number"
                placeholder="المجموع (ر.س)"
                value={newOrder.total}
                onChange={(e) => setNewOrder({ ...newOrder, total: Number(e.target.value) })}
              />
              <Input
                type="number"
                placeholder="عدد المنتجات"
                value={newOrder.items}
                onChange={(e) => setNewOrder({ ...newOrder, items: Number(e.target.value) })}
              />
              <select
                className="border rounded p-2 w-full"
                value={newOrder.status}
                onChange={(e) => setNewOrder({ ...newOrder, status: e.target.value })}
              >
                <option value="قيد التنفيذ">قيد التنفيذ</option>
                <option value="مكتمل">مكتمل</option>
                <option value="ملغي">ملغي</option>
              </select>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowForm(false)}>
                  إلغاء
                </Button>
                <Button onClick={addOrder}>حفظ</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
      {selectedOrder && (
  <div className="fixed inset-0 flex items-center justify-center bg-black/50 text-black">
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>تفاصيل الطلب</CardTitle>
      </CardHeader>
      <CardContent>
        <p><strong>العميل:</strong> {selectedOrder.customer}</p>
        <p><strong>عدد المنتجات:</strong> {selectedOrder.items}</p>
        <p><strong>المجموع:</strong> {selectedOrder.total} ر.س</p>
        <p><strong>الحالة:</strong> {selectedOrder.status}</p>
        <div className="flex justify-end mt-4">
          <Button variant="outline" onClick={() => setSelectedOrder(null)}>إغلاق</Button>
        </div>
      </CardContent>
    </Card>
  </div>
)}
{editOrder && (
  <div className="fixed inset-0 flex items-center justify-center bg-black/50 text-black">
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>تعديل الطلب</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Input
          placeholder="اسم العميل"
          value={editOrder.customer}
          onChange={(e) => setEditOrder({ ...editOrder, customer: e.target.value })}
        />
        <Input
          type="number"
          placeholder="المجموع (ر.س)"
          value={editOrder.total}
          onChange={(e) => setEditOrder({ ...editOrder, total: Number(e.target.value) })}
        />
        <Input
          type="number"
          placeholder="عدد المنتجات"
          value={editOrder.items}
          onChange={(e) => setEditOrder({ ...editOrder, items: Number(e.target.value) })}
        />
        <select
          className="border rounded p-2 w-full"
          value={editOrder.status}
          onChange={(e) => setEditOrder({ ...editOrder, status: e.target.value })}
        >
          <option value="قيد التنفيذ">قيد التنفيذ</option>
          <option value="مكتمل">مكتمل</option>
          <option value="ملغي">ملغي</option>
        </select>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => setEditOrder(null)}>إلغاء</Button>
          <Button
            onClick={async () => {
              const res = await fetch(`/api/orders/${editOrder._id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(editOrder),
              });
              if (res.ok) {
                const updated = await res.json();
                setOrders(orders.map((o) => (o._id === updated._id ? updated : o)));
                setEditOrder(null);
              }
            }}
          >
            حفظ التعديلات
          </Button>
        </div>
      </CardContent>
    </Card>
  </div>
)}


    </div>
  );
}
