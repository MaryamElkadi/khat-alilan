"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, Eye, Trash2, Edit, ShoppingCart, Package, Plus, X, User, Phone, Mail, Calendar, DollarSign, MapPin, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";

export default function OrdersManagement() {
  const [orders, setOrders] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [editOrder, setEditOrder] = useState<any | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);

  // ✅ حالة الطلب الجديد
  const [newOrder, setNewOrder] = useState({
    user: "", // User ID
    items: [
      {
        product: "", // Product ID or name
        modelType: "Product",
        quantity: 1,
        designFile: "",
      },
    ],
    shippingInfo: {
      customer: "",
      phone: "",
      email: "",
      address: "",
      city: "",
    },
    paymentMethod: "cash",
    notes: "",
    status: "جديد"
  });

  // جلب الطلبات
  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/orders");
      if (res.ok) {
        const data = await res.json();
        console.log("Orders data:", data); // Debug: see actual API response
        setOrders(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  // إضافة طلب جديد
  const addOrder = async () => {
    if (!newOrder.user || !newOrder.items[0].product) {
      alert("يرجى ملء جميع الحقول المطلوبة");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newOrder)
      });

      const result = await response.json();
      
      if (result.success) {
        alert("تم إنشاء الطلب بنجاح");
        setShowForm(false);
        setNewOrder({
          user: "",
          items: [{ product: "", modelType: "Product", quantity: 1, designFile: "" }],
          shippingInfo: { customer: "", phone: "", email: "", address: "", city: "" },
          paymentMethod: "cash",
          notes: "",
          status: "جديد"
        });
        fetchOrders();
      } else {
        alert(result.error || "فشل في إنشاء الطلب");
      }
    } catch (error) {
      console.error('Failed to create order:', error);
      alert("فشل في إنشاء الطلب");
    } finally {
      setLoading(false);
    }
  };

  // حذف طلب
  const deleteOrder = async (id: string) => {
    if (!confirm("هل أنت متأكد من حذف هذا الطلب؟")) return;
    
    try {
      const res = await fetch(`/api/orders/${id}`, { method: "DELETE" });
      if (res.ok) {
        setOrders(orders.filter((o) => o._id !== id));
        alert("تم حذف الطلب بنجاح");
      } else {
        alert("فشل في حذف الطلب");
      }
    } catch (error) {
      console.error("Error deleting order:", error);
      alert("فشل في حذف الطلب");
    }
  };

  // تحديث الطلب
  const updateOrder = async () => {
    if (!editOrder) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/orders/${editOrder._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editOrder),
      });

      if (res.ok) {
        alert("تم تحديث الطلب بنجاح");
        setEditOrder(null);
        fetchOrders();
      } else {
        alert("فشل في تحديث الطلب");
      }
    } catch (error) {
      console.error("Error updating order:", error);
      alert("فشل في تحديث الطلب");
    } finally {
      setLoading(false);
    }
  };

  // وظائف المساعدة لتحديث الحالة
  const updateNewOrder = (field: string, value: any) => {
    setNewOrder(prev => ({ ...prev, [field]: value }));
  };

  const updateNewOrderShipping = (field: string, value: any) => {
    setNewOrder(prev => ({
      ...prev,
      shippingInfo: { ...prev.shippingInfo, [field]: value }
    }));
  };

  const updateNewOrderItem = (index: number, field: string, value: any) => {
    const updatedItems = [...newOrder.items];
    updatedItems[index] = { ...updatedItems[index], [field]: value };
    setNewOrder(prev => ({ ...prev, items: updatedItems }));
  };

  const addNewItem = () => {
    setNewOrder(prev => ({
      ...prev,
      items: [...prev.items, { product: "", modelType: "Product", quantity: 1, designFile: "" }]
    }));
  };

  const removeItem = (index: number) => {
    if (newOrder.items.length > 1) {
      const updatedItems = newOrder.items.filter((_, i) => i !== index);
      setNewOrder(prev => ({ ...prev, items: updatedItems }));
    }
  };

  // ✅ FIXED: Extract customer information properly
  const getCustomerInfo = (order: any) => {
    // Try different possible fields in the API response
    return {
      name: order.user?.name || 
            order.shippingInfo?.customer || 
            order.customerName || 
            "غير محدد",
      phone: order.user?.phone || 
             order.shippingInfo?.phone || 
             order.phone || 
             "غير محدد",
      email: order.user?.email || 
             order.shippingInfo?.email || 
             order.email || 
             "غير محدد",
      address: order.shippingInfo?.address || 
               order.address || 
               "غير محدد"
    };
  };

  // ✅ FIXED: Extract order amount properly
  const getOrderAmount = (order: any) => {
    return order.totalAmount || order.amount || 0;
  };

  // تصفية الطلبات
  const filteredOrders = orders.filter(order => {
    const customer = getCustomerInfo(order);
    return (
      order._id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.phone.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // الحصول على لون البادج حسب الحالة
  const getStatusColor = (status: string) => {
    switch (status) {
      case "جديد": return "bg-blue-500 text-white dark:bg-blue-600";
      case "قيد التنفيذ": return "bg-yellow-500 text-black dark:bg-yellow-600";
      case "مكتمل": return "bg-green-500 text-white dark:bg-green-600";
      case "ملغي": return "bg-red-500 text-white dark:bg-red-600";
      default: return "bg-gray-500 text-white dark:bg-gray-600";
    }
  };

  // تنسيق التاريخ
  const formatDate = (dateString: string) => {
    if (!dateString) return "غير محدد";
    return new Date(dateString).toLocaleDateString('ar-EG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
<div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white p-6">
      {/* الهيدر */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-blue-400">إدارة الطلبات</h1>
          <p className="text-gray-400 mt-1">متابعة الطلبات وحالة التنفيذ</p>
        </div>
        <Button 
          onClick={() => setShowForm(true)} 
          className="flex items-center gap-2 mt-4 sm:mt-0 bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" /> إضافة طلب جديد
        </Button>
      </div>

      {/* البحث */}
      <Card className="mb-6 bg-gray-800 border-gray-700">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="البحث برقم الطلب، اسم العميل، البريد أو الهاتف..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pr-10 bg-gray-700 border-gray-600 text-white placeholder-gray-400"
            />
          </div>
        </CardContent>
      </Card>

      {/* قائمة الطلبات */}
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredOrders.map((order, index) => {
            const customer = getCustomerInfo(order);
            const amount = getOrderAmount(order);
            
            return (
              <motion.div
                key={order._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="overflow-hidden hover:shadow-lg transition-shadow bg-gray-800 border-gray-700 border-l-4 border-l-blue-500">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                    <div>
                      <CardTitle className="text-sm font-medium text-white">
                        طلب #{order._id?.slice(-8)}
                      </CardTitle>
                      <CardDescription className="text-gray-400 text-xs">
                        {formatDate(order.createdAt || order.date)}
                      </CardDescription>
                    </div>
                    <Badge className={getStatusColor(order.status)}>
                      {order.status}
                    </Badge>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-gray-400" />
                        <span className="text-sm font-medium text-white">
                          {customer.name}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-300">
                          {customer.phone}
                        </span>
                      </div>

                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <Package className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-300">
                            {Array.isArray(order.items) ? order.items.length : 0} منتج
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4 text-gray-400" />
                          <span className="font-bold text-yellow-400">
                            {amount.toLocaleString()} ر.س
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-2 mt-4">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="flex-1 bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
                        onClick={() => setSelectedOrder(order)}
                      >
                        <Eye className="h-4 w-4 ml-1" />
                        عرض
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="flex-1 bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
                        onClick={() => setEditOrder(order)}
                      >
                        <Edit className="h-4 w-4 ml-1" />
                        تعديل
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-red-400 border-red-800 hover:text-red-300 hover:bg-red-900"
                        onClick={() => deleteOrder(order._id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* ✅ نموذج إضافة طلب جديد */}
      {showForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/80 z-50 p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-gray-800 border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-white">إضافة طلب جديد</CardTitle>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setShowForm(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* معلومات المستخدم */}
              <div className="space-y-4">
                <h3 className="font-medium border-b border-gray-600 pb-2 text-lg text-white">معلومات المستخدم</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block text-gray-300">
                      معرّف المستخدم *
                    </label>
                    <Input
                      placeholder="أدخل معرّف المستخدم..."
                      value={newOrder.user}
                      onChange={(e) => updateNewOrder('user', e.target.value)}
                      className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block text-gray-300">
                      اسم العميل
                    </label>
                    <Input
                      placeholder="اسم العميل"
                      value={newOrder.shippingInfo.customer}
                      onChange={(e) => updateNewOrderShipping('customer', e.target.value)}
                      className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block text-gray-300">
                      الهاتف
                    </label>
                    <Input
                      placeholder="رقم الهاتف"
                      value={newOrder.shippingInfo.phone}
                      onChange={(e) => updateNewOrderShipping('phone', e.target.value)}
                      className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block text-gray-300">
                      البريد الإلكتروني
                    </label>
                    <Input
                      type="email"
                      placeholder="البريد الإلكتروني"
                      value={newOrder.shippingInfo.email}
                      onChange={(e) => updateNewOrderShipping('email', e.target.value)}
                      className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block text-gray-300">
                    العنوان
                  </label>
                  <Textarea
                    placeholder="العنوان الكامل"
                    value={newOrder.shippingInfo.address}
                    onChange={(e) => updateNewOrderShipping('address', e.target.value)}
                    className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                  />
                </div>
              </div>

              {/* المنتجات */}
              <div className="space-y-4">
                <div className="flex justify-between items-center border-b border-gray-600 pb-2">
                  <h3 className="font-medium text-lg text-white">المنتجات والخدمات</h3>
                  <Button 
                    type="button" 
                    size="sm" 
                    onClick={addNewItem}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Plus className="h-4 w-4 ml-1" /> إضافة منتج
                  </Button>
                </div>
                
                {newOrder.items.map((item, index) => (
                  <div key={index} className="border border-gray-600 rounded-lg p-4 space-y-3">
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium text-white">منتج #{index + 1}</h4>
                      {newOrder.items.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeItem(index)}
                          className="text-red-400 hover:text-red-300"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label className="text-sm font-medium mb-1 block text-gray-300">
                          معرّف المنتج/الخدمة *
                        </label>
                        <Input
                          placeholder="أدخل معرّف أو اسم المنتج..."
                          value={item.product}
                          onChange={(e) => updateNewOrderItem(index, 'product', e.target.value)}
                          className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                        />
                      </div>

                      <div>
                        <label className="text-sm font-medium mb-1 block text-gray-300">النوع</label>
                        <select
                          className="border border-gray-600 rounded p-2 w-full bg-gray-700 text-white"
                          value={item.modelType}
                          onChange={(e) => updateNewOrderItem(index, 'modelType', e.target.value)}
                        >
                          <option value="Product">منتج</option>
                          <option value="Service">خدمة</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium mb-1 block text-gray-300">الكمية</label>
                        <Input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => updateNewOrderItem(index, 'quantity', Number(e.target.value))}
                          className="bg-gray-700 border-gray-600 text-white"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* معلومات إضافية */}
              <div className="space-y-4">
                <h3 className="font-medium border-b border-gray-600 pb-2 text-lg text-white">معلومات إضافية</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block text-gray-300">طريقة الدفع</label>
                    <select
                      className="border border-gray-600 rounded p-2 w-full bg-gray-700 text-white"
                      value={newOrder.paymentMethod}
                      onChange={(e) => updateNewOrder('paymentMethod', e.target.value)}
                    >
                      <option value="cash">نقدي</option>
                      <option value="card">بطاقة</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-2 block text-gray-300">الحالة</label>
                    <select
                      className="border border-gray-600 rounded p-2 w-full bg-gray-700 text-white"
                      value={newOrder.status}
                      onChange={(e) => updateNewOrder('status', e.target.value)}
                    >
                      <option value="جديد">جديد</option>
                      <option value="قيد التنفيذ">قيد التنفيذ</option>
                      <option value="مكتمل">مكتمل</option>
                      <option value="ملغي">ملغي</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block text-gray-300">ملاحظات</label>
                  <Textarea
                    placeholder="ملاحظات إضافية حول الطلب..."
                    value={newOrder.notes}
                    onChange={(e) => updateNewOrder('notes', e.target.value)}
                    rows={3}
                    className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                  />
                </div>
              </div>

              {/* أزرار */}
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-600">
                <Button 
                  variant="outline" 
                  onClick={() => setShowForm(false)}
                  disabled={loading}
                  className="bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
                >
                  إلغاء
                </Button>
                <Button 
                  onClick={addOrder}
                  disabled={loading}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
                >
                  {loading ? "جاري الإضافة..." : "حفظ الطلب"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* مودال عرض التفاصيل */}
      {selectedOrder && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/80 z-50 p-4">
          <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-gray-800 border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-white">تفاصيل الطلب #{selectedOrder._id?.slice(-8)}</CardTitle>
                <CardDescription className="text-gray-400">
                  {formatDate(selectedOrder.createdAt || selectedOrder.date)}
                </CardDescription>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setSelectedOrder(null)}
                className="text-gray-400 hover:text-white"
              >
                <X className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* معلومات العميل */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-gray-700 border-gray-600">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2 text-white">
                      <User className="h-5 w-5" />
                      معلومات العميل
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 text-gray-300">
                    <div>
                      <strong className="text-white">الاسم:</strong> {getCustomerInfo(selectedOrder).name}
                    </div>
                    <div>
                      <strong className="text-white">البريد:</strong> {getCustomerInfo(selectedOrder).email}
                    </div>
                    <div>
                      <strong className="text-white">الهاتف:</strong> {getCustomerInfo(selectedOrder).phone}
                    </div>
                    <div>
                      <strong className="text-white">العنوان:</strong> {getCustomerInfo(selectedOrder).address}
                    </div>
                  </CardContent>
                </Card>

                {/* معلومات الطلب */}
                <Card className="bg-gray-700 border-gray-600">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2 text-white">
                      <FileText className="h-5 w-5" />
                      معلومات الطلب
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 text-gray-300">
                    <div>
                      <strong className="text-white">الحالة:</strong>{" "}
                      <Badge className={getStatusColor(selectedOrder.status)}>
                        {selectedOrder.status}
                      </Badge>
                    </div>
                    <div>
                      <strong className="text-white">طريقة الدفع:</strong> {selectedOrder.paymentMethod === "card" ? "بطاقة ائتمان" : "نقدي"}
                    </div>
                    <div>
                      <strong className="text-white">حالة الدفع:</strong> {selectedOrder.paymentStatus === "paid" ? "مدفوع" : "قيد الانتظار"}
                    </div>
                    <div>
                      <strong className="text-white">المجموع:</strong>{" "}
                      <span className="font-bold text-yellow-400 text-lg">
                        {getOrderAmount(selectedOrder).toLocaleString()} ر.س
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* المنتجات */}
              <Card className="bg-gray-700 border-gray-600">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2 text-white">
                    <Package className="h-5 w-5" />
                    المنتجات ({Array.isArray(selectedOrder.items) ? selectedOrder.items.length : 0})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Array.isArray(selectedOrder.items) && selectedOrder.items.map((item: any, index: number) => (
                      <div key={index} className="flex justify-between items-center border-b border-gray-600 pb-3">
                        <div className="flex-1">
                          <div className="font-medium text-white">{item.name || "منتج"}</div>
                          <div className="text-sm text-gray-400">
                            {item.modelType === "Product" ? "منتج" : "خدمة"} • الكمية: {item.quantity}
                          </div>
                          {item.designFile && (
                            <div className="text-sm text-blue-400">ملف التصميم: {item.designFile}</div>
                          )}
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-white">{item.price?.toLocaleString()} ر.س</div>
                          <div className="text-sm text-gray-400">
                            المجموع: {(item.price * item.quantity)?.toLocaleString()} ر.س
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* الملاحظات */}
              {selectedOrder.notes && (
                <Card className="bg-gray-700 border-gray-600">
                  <CardHeader>
                    <CardTitle className="text-white">ملاحظات</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-300">{selectedOrder.notes}</p>
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* مودال التعديل */}
      {editOrder && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/80 z-50 p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-gray-800 border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-white">تعديل الطلب #{editOrder._id?.slice(-8)}</CardTitle>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setEditOrder(null)}
                className="text-gray-400 hover:text-white"
              >
                <X className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block text-gray-300">حالة الطلب</label>
                <select
                  className="border border-gray-600 rounded p-2 w-full bg-gray-700 text-white"
                  value={editOrder.status}
                  onChange={(e) => setEditOrder({ ...editOrder, status: e.target.value })}
                >
                  <option value="جديد">جديد</option>
                  <option value="قيد التنفيذ">قيد التنفيذ</option>
                  <option value="مكتمل">مكتمل</option>
                  <option value="ملغي">ملغي</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block text-gray-300">ملاحظات</label>
                <Textarea
                  value={editOrder.notes || ""}
                  onChange={(e) => setEditOrder({ ...editOrder, notes: e.target.value })}
                  rows={3}
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-600">
                <Button 
                  variant="outline" 
                  onClick={() => setEditOrder(null)}
                  className="bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
                >
                  إلغاء
                </Button>
                <Button 
                  onClick={updateOrder} 
                  disabled={loading}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {loading ? "جاري التحديث..." : "حفظ التغييرات"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* الإحصائيات */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8">
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-6 text-center">
            <ShoppingCart className="h-8 w-8 text-blue-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">{orders.length}</div>
            <div className="text-sm text-gray-400">إجمالي الطلبات</div>
          </CardContent>
        </Card>
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-6 text-center">
            <Package className="h-8 w-8 text-green-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">
              {orders.filter((o) => o.status === "مكتمل").length}
            </div>
            <div className="text-sm text-gray-400">مكتملة</div>
          </CardContent>
        </Card>
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-6 text-center">
            <div className="h-8 w-8 bg-orange-500 rounded-full mx-auto mb-2"></div>
            <div className="text-2xl font-bold text-white">
              {orders.filter((o) => o.status === "قيد التنفيذ").length}
            </div>
            <div className="text-sm text-gray-400">قيد التنفيذ</div>
          </CardContent>
        </Card>
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-6 text-center">
            <div className="h-8 w-8 bg-red-500 rounded-full mx-auto mb-2"></div>
            <div className="text-2xl font-bold text-white">
              {orders.filter((o) => o.status === "ملغي").length}
            </div>
            <div className="text-sm text-gray-400">ملغاة</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}