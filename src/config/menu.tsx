import React from "react"
import { Home, BarChart2, /* List, ChevronRight, */ User, FileText, UserCog } from "lucide-react"

export type MenuItem = {
  label: string
  path: string
  icon: React.ReactNode
  // Optional children for submenus
  children?: MenuItem[]
}

export const menuItems: MenuItem[] = [
  { label: "Thống kê", path: "/dashboard", icon: <Home size={16} /> },
  { label: "Kiểm duyệt hồ sơ", path: "/analytics", icon: <BarChart2 size={16} /> },
  { label: "Quản lý tài khoản", path: "/quan-ly-tai-khoan", icon: <UserCog size={16} /> }, 
/*   {
    label: "Menu1",
    path: "/menu1",
    icon: <List size={16} />,
    children: [
      { label: "Submenu1", path: "/menu1/submenu1", icon: <ChevronRight size={16} /> },
      { label: "Submenu2", path: "/menu1/submenu2", icon: <ChevronRight size={16} /> },
    ],
  }, */
  { label: "Hồ sơ cá nhân", path: "/ho-so-ca-nhan", icon: <User size={16} /> },
  { label: "Quản lý công trình khoa học", path: "/cong-trinh-khoa-hoc", icon: <FileText size={16} /> },
]