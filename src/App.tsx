import { AdminRoutes } from "@/routes/adminRoutes"
import { ThemeProvider } from "@/components/ui/theme-provider"
import { AuthProvider } from "@/contexts/AuthContext"
import { UserProfileProvider } from "@/contexts/UserProfileContext.tsx"

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="app-theme">
      <AuthProvider>
        <UserProfileProvider>
          <AdminRoutes />
        </UserProfileProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App