"use client"

import { motion } from "framer-motion"
import { User, Settings, ShoppingBag, Heart, LogOut, CreditCard } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from "@/lib/auth-context"
import { AuthModal } from "./auth-modal"
import Link from "next/link"

export function UserMenu() {
  const { state, logout } = useAuth()

  if (!state.isAuthenticated || !state.user) {
    return (
      <AuthModal>
        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
          <Button variant="ghost" size="icon">
            <User className="h-5 w-5" />
          </Button>
        </motion.div>
      </AuthModal>
    )
  }

  const handleLogout = () => {
    logout()
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
          <Button variant="ghost" size="icon" className="relative">
            <Avatar className="h-8 w-8">
              <AvatarImage src="/placeholder.svg" alt={state.user.name} />
              <AvatarFallback className="bg-primary/10 text-primary font-semibold text-sm">
                {state.user.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
          </Button>
        </motion.div>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="text-right">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{state.user.name}</p>
            <p className="text-xs leading-none text-muted-foreground">{state.user.email}</p>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <Link href="/profile">
          <DropdownMenuItem className="cursor-pointer">
            <User className="ml-2 h-4 w-4" />
            <span>الملف الشخصي</span>
          </DropdownMenuItem>
        </Link>

        <Link href="/orders">
          <DropdownMenuItem className="cursor-pointer">
            <ShoppingBag className="ml-2 h-4 w-4" />
            <span>طلباتي</span>
          </DropdownMenuItem>
        </Link>

        <Link href="/wishlist">
          <DropdownMenuItem className="cursor-pointer">
            <Heart className="ml-2 h-4 w-4" />
            <span>المفضلة</span>
          </DropdownMenuItem>
        </Link>

        <Link href="/payment-methods">
          <DropdownMenuItem className="cursor-pointer">
            <CreditCard className="ml-2 h-4 w-4" />
            <span>طرق الدفع</span>
          </DropdownMenuItem>
        </Link>

        <Link href="/settings">
          <DropdownMenuItem className="cursor-pointer">
            <Settings className="ml-2 h-4 w-4" />
            <span>الإعدادات</span>
          </DropdownMenuItem>
        </Link>

        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-destructive focus:text-destructive">
          <LogOut className="ml-2 h-4 w-4" />
          <span>تسجيل الخروج</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
