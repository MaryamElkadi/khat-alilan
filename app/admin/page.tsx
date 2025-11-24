"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { BarChart3, Package, Users, ShoppingCart, TrendingUp, Eye, DollarSign, Calendar, Zap, MessageSquare } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAdminAuth } from "@/lib/admin-auth";

// 💡 تعريف الـ Icons والألوان والعناوين لكل إحصائية محتملة
const STAT_CARD_CONFIG = {
  // المفتاح يجب أن يتطابق مع مفتاح البيانات القادم من الـ API (مثال: data.stats.sales)
  sales: { title: "إجمالي المبيعات", icon: TrendingUp, color: "text-green-500" },
  newOrders: { title: "الطلبات الجديدة", icon: ShoppingCart, color: "text-brand-blue" },
  activeCustomers: { title: "العملاء النشطين", icon: Users, color: "text-brand-yellow" },
  products: { title: "المنتجات", icon: Package, color: "text-purple-500" },
  revenue: { title: "الإيرادات الكلية", icon: DollarSign, color: "text-blue-500" },
  visits: { title: "زيارات الموقع", icon: Eye, color: "text-orange-500" },
  pendingOrders: { title: "طلبات قيد الانتظار", icon: Calendar, color: "text-red-500" },
  newUsers: { title: "مستخدمون جدد", icon: Zap, color: "text-cyan-500" },
  messages: { title: "رسائل الدعم", icon: MessageSquare, color: "text-gray-500" },
  // ... أضف المزيد من الإحصائيات هنا إذا كانت تأتي من الـ API
};

// 💡 دالة لحساب التغيير الديناميكي بناءً على البيانات السابقة والحالية
const calculateChange = (currentValue, previousValue, key) => {
  if (!previousValue || previousValue === 0) {
    // إذا لم توجد بيانات سابقة، نرجع رسالة افتراضية
    switch(key) {
      case 'sales': return "+0% هذا الشهر";
      case 'newOrders': return "+0 اليوم";
      case 'activeCustomers': return "+0%";
      case 'products': return "+0 هذا الأسبوع";
      case 'revenue': return "لا توجد بيانات سابقة";
      case 'visits': return "+0% هذا الشهر";
      case 'pendingOrders': return "تحتاج للمراجعة";
      case 'newUsers': return "+0% عن الأسبوع الماضي";
      case 'messages': return "+0 جديدة";
      default: return "لا توجد بيانات سابقة";
    }
  }
  
  const change = ((currentValue - previousValue) / previousValue) * 100;
  const absoluteChange = currentValue - previousValue;
  
  // تنسيق النسبة المئوية
  const formattedPercentage = change >= 0 ? `+${change.toFixed(1)}%` : `${change.toFixed(1)}%`;
  
  // تنسيق التغيير المطلق
  const formattedAbsolute = absoluteChange >= 0 ? `+${absoluteChange}` : `${absoluteChange}`;
  
  // إرجاع النص المناسب لكل نوع من الإحصائيات
  switch(key) {
    case 'sales':
      return formattedPercentage + " عن الشهر الماضي";
    case 'newOrders':
      return `${formattedAbsolute} اليوم`;
    case 'activeCustomers':
      return formattedPercentage + " عن الأسبوع الماضي";
    case 'products':
      return `${formattedAbsolute} هذا الأسبوع`;
    case 'revenue':
      return change >= 0 ? `بزيادة ${formattedPercentage}` : `بانخفاض ${formattedPercentage.replace('-', '')}`;
    case 'visits':
      return formattedPercentage + " هذا الشهر";
    case 'pendingOrders':
      return absoluteChange > 0 ? `زيادة ${absoluteChange} طلب` : absoluteChange < 0 ? `انخفاض ${Math.abs(absoluteChange)} طلب` : "لا تغيير";
    case 'newUsers':
      return formattedPercentage + " عن الأسبوع الماضي";
    case 'messages':
      return `${formattedAbsolute} جديدة`;
    default:
      return formattedPercentage;
  }
};

// 💡 مكون الرسم البياني البسيط
const SimpleBarChart = ({ data, title }) => {
  if (!data || data.length === 0) {
    return (
      <div className="h-48 sm:h-64 flex items-center justify-center bg-muted/20 rounded-lg">
        <div className="text-center">
          <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
          <p className="text-muted-foreground">لا توجد بيانات متاحة</p>
        </div>
      </div>
    );
  }

  const maxValue = Math.max(...data.map(item => item.value));
  const months = ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو", 
                 "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"];

  return (
    <div className="h-48 sm:h-64 flex flex-col">
      <div className="flex-1 flex items-end justify-between gap-1 sm:gap-2 px-2 sm:px-4 pb-4">
        {data.map((item, index) => {
          const heightPercentage = maxValue > 0 ? (item.value / maxValue) * 80 : 0;
          const monthName = months[item.month - 1] || `الشهر ${item.month}`;
          
          return (
            <div key={index} className="flex flex-col items-center flex-1">
              <div 
                className="w-full bg-gradient-to-t from-brand-blue to-blue-400 rounded-t transition-all duration-500 hover:from-blue-500 hover:to-brand-blue"
                style={{ height: `${heightPercentage}%` }}
              />
              <div className="text-xs text-muted-foreground mt-1 text-center">
                {monthName}
              </div>
              <div className="text-xs font-medium mt-1">
                {item.value.toLocaleString()}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default function AdminDashboard() {
  const { user, isAdmin, isLoading } = useAdminAuth();
  const router = useRouter();

  const [stats, setStats] = useState<Record<string, any> | null>(null);
  const [previousStats, setPreviousStats] = useState<Record<string, any> | null>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [salesData, setSalesData] = useState<any[]>([]); // بيانات المبيعات للرسم البياني
  const [loadingData, setLoadingData] = useState(true);

  // ... (Auth useEffect remains the same)
  useEffect(() => {
    if (!isLoading && (!user || !isAdmin)) {
      router.push("/login");
    }
  }, [user, isAdmin, isLoading, router]);

  // ... (Data Fetching useEffect)
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/dashboard"); // replace with your DB API
        const data = await res.json();
    
        setStats(data?.stats || {});
        setPreviousStats(data?.previousStats || {});
        setSalesData(data?.salesData || []); // بيانات الرسم البياني
        setOrders(data?.orders?.slice(0, 3) || []);
      } catch (error) {
        console.error("فشل تحميل البيانات", error);
        setStats({});
        setPreviousStats({});
        setSalesData([]);
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

  // 🪄 إنشاء بطاقات الإحصائيات الديناميكية
  const dynamicStatsCards = stats
    ? Object.keys(stats)
        .filter(key => STAT_CARD_CONFIG[key] !== undefined)
        .map((key) => {
          const config = STAT_CARD_CONFIG[key];
          const statValue = stats[key];
          const previousValue = previousStats ? previousStats[key] : 0;
          
          const changeValue = calculateChange(statValue, previousValue, key);
          
          return {
            title: config.title,
            value: statValue,
            change: changeValue,
            icon: config.icon,
            color: config.color,
            key: key
          };
        })
    : [];

  // ✅ مسار صفحة إدارة الطلبات
  const ordersPagePath = "/admin/orders"; 

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
          {dynamicStatsCards.map((stat, index) => (
            <motion.div key={stat.key} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader className="flex items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
                  <stat.icon className={`h-4 w-4 ${stat.color}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-xl sm:text-2xl font-bold">{stat.value}</div>
                  <p className={`text-xs mt-1 ${
                    stat.change.includes('+') || stat.change.includes('زيادة') || stat.change.includes('بزيادة') 
                      ? 'text-green-500' 
                      : stat.change.includes('-') || stat.change.includes('انخفاض') || stat.change.includes('بانخفاض')
                      ? 'text-red-500'
                      : 'text-muted-foreground'
                  }`}>
                    {stat.change}
                  </p>
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
                <CardDescription>آخر {orders.length} طلبات مستلمة من العملاء</CardDescription>
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
                          <Button size="sm" variant="ghost" className="mt-0 sm:mt-1" onClick={() => router.push(ordersPagePath)}>
                            عرض التفاصيل
                          </Button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-center">لا توجد طلبات حتى الآن</p>
                )}
                <Button 
                  variant="outline" 
                  className="w-full mt-4 bg-transparent"
                  onClick={() => router.push(ordersPagePath)}
                >
                  عرض جميع الطلبات
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Dynamic Performance Chart */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1 }}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  أداء المبيعات
                </CardTitle>
                <CardDescription>
                  {salesData.length > 0 
                    ? `إحصائيات المبيعات لآخر ${salesData.length} أشهر` 
                    : "إحصائيات المبيعات للأشهر الماضية"
                  }
                </CardDescription>
              </CardHeader>
              <CardContent>
                <SimpleBarChart data={salesData} title="المبيعات الشهرية" />
                
                {/* إحصائيات إضافية */}
                {salesData.length > 0 && (
                  <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                    <div className="text-center p-2 bg-muted/20 rounded">
                      <div className="text-muted-foreground">أعلى شهر</div>
                      <div className="font-bold text-green-600">
                        {Math.max(...salesData.map(item => item.value)).toLocaleString()} ر.س
                      </div>
                    </div>
                    <div className="text-center p-2 bg-muted/20 rounded">
                      <div className="text-muted-foreground">متوسط المبيعات</div>
                      <div className="font-bold text-blue-600">
                        {Math.round(salesData.reduce((sum, item) => sum + item.value, 0) / salesData.length).toLocaleString()} ر.س
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}