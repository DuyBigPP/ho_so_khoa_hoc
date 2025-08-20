import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import type { UserRole } from '@/types/auth'
import { Loader2 } from 'lucide-react'

interface ProtectedRouteProps {
  children: React.ReactNode
  allowedRoles?: UserRole[]
  requireAuth?: boolean
}

export function ProtectedRoute({ 
  children, 
  allowedRoles = [], 
  requireAuth = true 
}: ProtectedRouteProps) {
  const { user, isAuthenticated, isLoading } = useAuth()
  const location = useLocation()
  
  console.log('ProtectedRoute check:', {
    path: location.pathname,
    requireAuth,
    allowedRoles,
    isAuthenticated,
    userRole: user?.role,
    isLoading
  })

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Đang tải...</span>
        </div>
      </div>
    )
  }

  // Redirect to login if authentication is required but user is not authenticated
  if (requireAuth && !isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  // Redirect authenticated users away from login page
  if (!requireAuth && isAuthenticated) {
    console.log('ProtectedRoute: Authenticated user accessing login, redirecting to dashboard')
    const redirectPath = user?.role === 'admin' ? '/dashboard' : '/ho-so-ca-nhan'
    return <Navigate to={redirectPath} replace />
  }

  // Check role-based access
  if (requireAuth && isAuthenticated && allowedRoles.length > 0) {
    if (!user || !allowedRoles.includes(user.role)) {
      // Redirect to appropriate dashboard based on user role
      const redirectPath = user?.role === 'admin' ? '/dashboard' : '/ho-so-ca-nhan'
      console.log('ProtectedRoute: Role mismatch, redirecting to:', redirectPath)
      return <Navigate to={redirectPath} replace />
    }
  }

  console.log('ProtectedRoute: Access granted to:', location.pathname)
  return <>{children}</>
}
