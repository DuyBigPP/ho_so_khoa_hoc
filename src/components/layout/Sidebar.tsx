import React from "react"
import { useLocation, useNavigate } from "react-router-dom"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarRail,
} from "@/components/ui/sidebar"
import { adminMenuItems } from "@/config/roleMenus"
import { LucideLayoutDashboard, ChevronRight, LogOut } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/AuthContext"

export function AdminSidebar() {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  // State to control which menu with children is open 
  const [openSubmenu, setOpenSubmenu] = React.useState<string | null>(null)

  const toggleSubmenu = (path: string) => {
    setOpenSubmenu((prev) => (prev === path ? null : path))
  }

  const handleLogout = async () => {
    try {
      await logout()
      navigate('/login')
    } catch (error) {
      console.error('Logout error:', error)
      navigate('/login')
    }
  }

  return (
    <Sidebar
      side="left"
      variant="sidebar"
      collapsible="offcanvas"
      className="border-r border-border"
    >
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <LucideLayoutDashboard className="h-4 w-4" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold">Hồ sơ khoa học</span>
          </div>
        </div>
      </SidebarHeader>
      {/* <SidebarSeparator /> */}
      <SidebarContent className="p-2">
        <SidebarMenu>
          {adminMenuItems.map((item) => {
            if (item.children) {
              return (
                <SidebarMenuItem key={item.path}>
                  <div>
                    <SidebarMenuButton
                      onClick={() => toggleSubmenu(item.path)}
                      // Check if pathname starts with this item's path (to include children)
                      isActive={location.pathname.startsWith(item.path)}
                      tooltip={item.label}
                      className="flex justify-between items-center transition-colors hover:bg-accent hover:text-accent-foreground data-[active=true]:bg-accent/50 data-[active=true]:font-medium"
                    >
                      <div className="flex items-center gap-2">
                        {item.icon}
                        <span>{item.label}</span>
                      </div>
                      <ChevronRight
                        size={16}
                        className={`transition-transform duration-200 ${openSubmenu === item.path ? "rotate-90" : ""}`}
                      />
                    </SidebarMenuButton>
                    {openSubmenu === item.path && (
                      <ul className="mt-1 pl-4 transition-all duration-200 ease-out">
                        {item.children.map((child) => (
                          <li key={child.path}>
                            <SidebarMenuButton
                              onClick={() => navigate(child.path)}
                              isActive={location.pathname === child.path}
                              tooltip={child.label}
                              className="transition-colors hover:bg-accent hover:text-accent-foreground data-[active=true]:bg-accent/50 data-[active=true]:font-medium text-sm"
                            >
                              {child.icon}
                              <span>{child.label}</span>
                            </SidebarMenuButton>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </SidebarMenuItem>
              )
            }
            return (
              <SidebarMenuItem key={item.path}>
                <SidebarMenuButton
                  onClick={() => navigate(item.path)}
                  isActive={location.pathname === item.path}
                  tooltip={item.label}
                  className="transition-colors hover:bg-accent hover:text-accent-foreground data-[active=true]:bg-accent/50 data-[active=true]:font-medium"
                >
                  {item.icon}
                  <span>{item.label}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="mt-auto border-t border-border p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={user?.avatar} alt={user?.name} />
              <AvatarFallback>
                {user?.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'A'}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-sm font-medium">{user?.name}</span>
              <span className="text-xs text-muted-foreground">{user?.email}</span>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="h-8 w-8 p-0"
            title="Đăng xuất"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}