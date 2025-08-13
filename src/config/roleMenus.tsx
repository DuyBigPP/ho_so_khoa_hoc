import React from "react"
import { Home, BarChart2, UserCog, User, FileText } from "lucide-react"
import type { UserRole } from "@/types/auth"

export type MenuItem = {
  label: string
  path: string
  icon: React.ReactNode
  // Optional children for submenus
  children?: MenuItem[]
}

// Admin menu items
export const adminMenuItems: MenuItem[] = [
  { label: "Thống kê", path: "/dashboard", icon: <Home size={16} /> },
  { label: "Kiểm duyệt hồ sơ", path: "/analytics", icon: <BarChart2 size={16} /> },
  { label: "Quản lý tài khoản", path: "/quan-ly-tai-khoan", icon: <UserCog size={16} /> },
]

// User menu items
export const userMenuItems: MenuItem[] = [
  { label: "Hồ sơ cá nhân", path: "/ho-so-ca-nhan", icon: <User size={16} /> },
  { label: "Quản lý công trình khoa học", path: "/cong-trinh-khoa-hoc", icon: <FileText size={16} /> },
]

// Get menu items based on user role
export function getMenuItemsByRole(role: UserRole): MenuItem[] {
  switch (role) {
    case 'admin':
      return adminMenuItems
    case 'user':
      return userMenuItems
    default:
      return []
  }
}

// Get default route based on user role
export function getDefaultRouteByRole(role: UserRole): string {
  switch (role) {
    case 'admin':
      return '/dashboard'
    case 'user':
      return '/ho-so-ca-nhan'
    default:
      return '/login'
  }
}
