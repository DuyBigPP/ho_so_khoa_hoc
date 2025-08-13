import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { ProtectedRoute } from "@/components/auth/ProtectedRoute"
import { AdminLayout } from "@/components/layout/AdminLayout"
import { UserLayout } from "@/components/layout/UserLayout"
import { useAuth } from "@/contexts/AuthContext"

// Pages
import LoginPage from "@/pages/login"
import DashboardPage from "@/pages/dashboard/DashboardPage"
import AnalyticsPage from "@/pages/analytics/AnalyticsPage"
import HoSoCaNhan from "@/pages/ho_so_ca_nhan"
import CongTrinhKhoaHoc from "@/pages/cong_trinh_khoa_hoc"
import QuanLyTaiKhoan from "@/pages/quan_ly_tai_khoan"

// Root redirect component
function RootRedirect() {
  const { user, isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-sm text-muted-foreground">Đang tải...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  // Redirect based on user role
  const redirectPath = user?.role === 'admin' ? '/dashboard' : '/ho-so-ca-nhan'
  return <Navigate to={redirectPath} replace />
}

export function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Root route */}
        <Route path="/" element={<RootRedirect />} />

        {/* Public Routes */}
        <Route 
          path="/login" 
          element={
            <ProtectedRoute requireAuth={false}>
              <LoginPage />
            </ProtectedRoute>
          } 
        />

        {/* Admin Routes */}
        <Route 
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route path="/quan-ly-tai-khoan" element={<QuanLyTaiKhoan />} />
        </Route>

        {/* User Routes */}
        <Route 
          element={
            <ProtectedRoute allowedRoles={['user']}>
              <UserLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/ho-so-ca-nhan" element={<HoSoCaNhan />} />
          <Route path="/cong-trinh-khoa-hoc" element={<CongTrinhKhoaHoc />} />
        </Route>

        {/* Catch all route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
