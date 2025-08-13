import { AdminRoutes } from "@/routes/adminRoutes"
import { ThemeProvider } from "@/components/ui/theme-provider"
import { AuthProvider } from "@/contexts/AuthContext"

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="app-theme">
      <AuthProvider>
        <AdminRoutes />
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App