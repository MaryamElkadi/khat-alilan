"use client"

import { motion } from "framer-motion"
import { Heart, ShoppingCart, X } from "lucide-react"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useCart } from "@/lib/CartProvider"

const wishlistItems = [
  {
    id: "website-design",
    title: "تصميم موقع ويب متجاوب",
    description: "موقع ويب حديث ومتجاوب مع لوحة تحكم إدارية",
    price: 5000,
    image: "/responsive-website-design.png",
    category: "تصميم مواقع ويب",
  },
  {
    id: "branding-package",
    title: "باقة الهوية التجارية الكاملة",
    description: "هوية تجارية شاملة تتضمن الشعار والألوان والخطوط",
    price: 3500,
    image: "/complete-branding-package.jpg",
    category: "تصميم جرافيك",
  },
]

export default function WishlistPage() {
  const { dispatch } = useCart()

  const addToCart = (item: any) => {
    dispatch({ type: "ADD_ITEM", payload: item })
  }

  const removeFromWishlist = (id: string) => {
    // Handle wishlist removal
    console.log("Remove from wishlist:", id)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-right">المفضلة</h1>
          <Badge variant="outline" className="text-brand-blue border-brand-blue">
            {wishlistItems.length} عنصر
          </Badge>
        </div>

        {wishlistItems.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16">
            <Heart className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold mb-2">قائمة المفضلة فارغة</h2>
            <p className="text-muted-foreground mb-6">أضف المنتجات التي تعجبك إلى المفضلة</p>
            <Button className="bg-brand-blue hover:bg-brand-blue/90">تصفح المنتجات</Button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {wishlistItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow">
                  <CardHeader className="p-0 relative">
                    <img
                      src={item.image || "/placeholder.svg"}
                      alt={item.title}
                      className="w-full h-48 object-cover rounded-t-lg"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeFromWishlist(item.id)}
                      className="absolute top-2 right-2 bg-white/80 hover:bg-white"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </CardHeader>

                  <CardContent className="p-4">
                    <Badge variant="outline" className="text-xs mb-2">
                      {item.category}
                    </Badge>
                    <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                    <p className="text-muted-foreground text-sm mb-4">{item.description}</p>
                    <div className="text-2xl font-bold text-brand-yellow">{item.price.toLocaleString()} ر.س</div>
                  </CardContent>

                  <CardFooter className="p-4 pt-0">
                    <Button onClick={() => addToCart(item)} className="w-full bg-brand-blue hover:bg-brand-blue/90">
                      <ShoppingCart className="h-4 w-4 ml-2" />
                      أضف إلى السلة
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  )
}
