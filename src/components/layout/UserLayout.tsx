import { Outlet } from "react-router-dom"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { UserSidebar } from "./UserSidebar.tsx"
import { BreadcrumbHeader } from "./Header"

export function UserLayout() {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <UserSidebar />
        <SidebarInset className="flex w-full flex-1 flex-col">
          <BreadcrumbHeader />
          <main className="flex-1 w-full p-4 md:p-6">
            <Outlet />
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}
