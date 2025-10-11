"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { BarChart3, Package, Users, ShoppingCart, TrendingUp, Eye } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAdminAuth } from "@/lib/admin-auth";

export default function AdminDashboard() {
  const { user, isAdmin, isLoading } = useAdminAuth();
  const router = useRouter();

  const [stats, setStats] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (!isLoading && (!user || !isAdmin)) {
      router.push("/login");
    }
  }, [user, isAdmin, isLoading, router]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/dashboard"); // replace with your DB API
        const data = await res.json();
        setStats(data?.stats || {});
        setOrders(data?.orders || []);
      } catch (error) {
        console.error("فشل تحميل البيانات", error);
        setStats({});
        setOrders([]);
      } finally {
        setLoadingData(false);
      }
    };
    fetchData();
  }, []);

  if (isLoading || loadingData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-blue mx-auto mb-4"></div>
          <p>جاري التحميل...</p>
        </div>
      </div>
    );
  }

  if (!user || !isAdmin) return null;

  const statsCards = [
    { title: "إجمالي المبيعات", value: stats?.sales || 0, change: "+12.5%", icon: TrendingUp, color: "text-green-500" },
    { title: "الطلبات الجديدة", value: stats?.newOrders || 0, change: "+5 اليوم", icon: ShoppingCart, color: "text-brand-blue" },
    { title: "العملاء النشطين", value: stats?.activeCustomers || 0, change: "+8.2%", icon: Users, color: "text-brand-yellow" },
    { title: "المنتجات", value: stats?.products || 0, change: "+3 هذا الأسبوع", icon: Package, color: "text-purple-500" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 sm:py-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-brand-blue leading-tight">لوحة التحكم الإدارية</h1>
            <p className="text-sm sm:text-base text-muted-foreground mt-1">مرحباً بك، {user.name}</p>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <Badge className="bg-brand-yellow text-black">مدير</Badge>
            <Button variant="outline" className="whitespace-nowrap" onClick={() => router.push("/") }>
              <Eye className="h-4 w-4 ml-2" />
              عرض الموقع
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 sm:py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
          {statsCards.map((stat, index) => (
            <motion.div key={stat.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader className="flex items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
                  <stat.icon className={`h-4 w-4 ${stat.color}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-xl sm:text-2xl font-bold">{stat.value}</div>
                  <p className="text-xs text-muted-foreground mt-1">{stat.change}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Recent Orders + Performance Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Recent Orders */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5" />
                  الطلبات الأخيرة
                </CardTitle>
                <CardDescription>آخر الطلبات المستلمة من العملاء</CardDescription>
              </CardHeader>
              <CardContent>
                {orders?.length > 0 ? (
                  <div className="space-y-4">
                    {orders.map((order, index) => (
                      <motion.div
                        key={order._id || index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7 + index * 0.1 }}
                        className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1 min-w-0">
                            <span className="font-medium truncate">{order.customer}</span>
                            <Badge
                              variant={
                                order.status === "جديد" ? "default" : order.status === "قيد التنفيذ" ? "secondary" : "outline"
                              }
                              className={
                                order.status === "جديد"
                                  ? "bg-brand-blue text-white"
                                  : order.status === "قيد التنفيذ"
                                  ? "bg-brand-yellow text-black"
                                  : "border-green-500 text-green-500"
                              }
                            >
                              {order.status}
                            </Badge>
                          </div>
                          <div className="text-sm text-muted-foreground truncate">{order.product}</div>
                          <div className="text-xs text-muted-foreground mt-1">{new Date(order.date).toLocaleDateString("ar-EG")}</div>
                        </div>
                        <div className="w-full sm:w-auto sm:text-left flex items-center justify-between sm:block">
                          <div className="font-bold text-brand-yellow">{order.amount} ر.س</div>
                          <Button size="sm" variant="ghost" className="mt-0 sm:mt-1">
                            عرض التفاصيل
                          </Button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-center">لا توجد طلبات حتى الآن</p>
                )}
                <Button variant="outline" className="w-full mt-4 bg-transparent">عرض جميع الطلبات</Button>
              </CardContent>
            </Card>
          </div>

          {/* Performance Chart */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1 }}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  أداء المبيعات
                </CardTitle>
                <CardDescription>إحصائيات المبيعات للأشهر الماضية</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-48 sm:h-64 flex items-center justify-center bg-muted/20 rounded-lg">
                  <div className="text-center">
                    <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                    <p className="text-muted-foreground">سيتم إضافة الرسوم البيانية قريباً</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
