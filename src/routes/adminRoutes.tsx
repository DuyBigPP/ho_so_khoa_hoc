import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { ProtectedRoute } from "@/components/auth/ProtectedRoute"
import { AdminLayout } from "@/components/layout/AdminLayout"
import { UserLayout } from "@/components/layout/UserLayout"

// Pages
import LoginPage from "@/pages/login"
import CompleteProfilePage from "@/pages/complete-profile"
import DashboardPage from "@/pages/dashboard/DashboardPage"
import AnalyticsPage from "@/pages/analytics/AnalyticsPage"
import HoSoCaNhan from "@/pages/ho_so_ca_nhan"
import CongTrinhKhoaHoc from "@/pages/cong_trinh_khoa_hoc"
import QuanLyTaiKhoan from "@/pages/quan_ly_tai_khoan"



export function AdminRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Root route - redirect to login */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Public Routes */}
        <Route 
          path="/login" 
          element={
            <ProtectedRoute requireAuth={false}>
              <LoginPage />
            </ProtectedRoute>
          } 
        />

        {/* Profile Completion Route */}
        <Route 
          path="/complete-profile" 
          element={
            <ProtectedRoute allowedRoles={['admin', 'user']}>
              <CompleteProfilePage />
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