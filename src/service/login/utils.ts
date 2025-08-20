import { STORAGE_KEYS, ERROR_MESSAGES } from './constants'
import type { User } from '@/types/auth'

/**
 * Validate email format
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Validate password strength
 */
export const isValidPassword = (password: string): boolean => {
  return password.length >= 6
}

/**
 * Get error message from API response
 */
export const getErrorMessage = (error: unknown): string => {
  // Type guard for axios error
  if (error && typeof error === 'object' && 'response' in error) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const axiosError = error as any
    
    if (axiosError.response?.data?.message) {
      return axiosError.response.data.message
    }
    
    if (axiosError.response?.data?.detail) {
      return axiosError.response.data.detail
    }

    if (axiosError.response?.status === 401) {
      return ERROR_MESSAGES.UNAUTHORIZED
    }

    if (axiosError.response?.status === 400) {
      return ERROR_MESSAGES.INVALID_CREDENTIALS
    }

    if (axiosError.response?.status >= 500) {
      return ERROR_MESSAGES.SERVER_ERROR
    }
  }

  // Type guard for network error
  if (error && typeof error === 'object' && 'code' in error) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const networkError = error as any
    if (networkError.code === 'NETWORK_ERROR' || networkError.message?.includes('Network Error')) {
      return ERROR_MESSAGES.NETWORK_ERROR
    }
  }

  // Type guard for error with message
  if (error && typeof error === 'object' && 'message' in error) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (error as any).message || ERROR_MESSAGES.LOGIN_FAILED
  }

  return ERROR_MESSAGES.LOGIN_FAILED
}

/**
 * Clear all auth data from storage
 */
export const clearAuthData = (): void => {
  localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN)
  localStorage.removeItem(STORAGE_KEYS.AUTH_USER)
}

/**
 * Store auth data
 */
export const storeAuthData = (token: string, user: User): void => {
  localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token)
  localStorage.setItem(STORAGE_KEYS.AUTH_USER, JSON.stringify(user))
}

/**
 * Get stored auth data
 */
export const getStoredAuthData = (): { token: string | null; user: User | null } => {
  const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN)
  const userStr = localStorage.getItem(STORAGE_KEYS.AUTH_USER)
  
  let user: User | null = null
  if (userStr) {
    try {
      user = JSON.parse(userStr)
    } catch (error) {
      console.warn('Failed to parse stored user data:', error)
      clearAuthData()
    }
  }

  return { token, user }
}

/**
 * Check if token is expired (basic check)
 * Note: This is a simple check. For JWT, you should decode and check exp claim
 */
export const isTokenExpired = (token: string): boolean => {
  if (!token) return true
  
  // For JWT tokens, you can decode and check expiration
  // For now, just check if token exists
  try {
    // Simple check - if token is very old format or empty
    if (token.length < 10) return true
    return false
  } catch {
    return true
  }
}

/**
 * Format user display name
 */
export const formatUserDisplayName = (user: User): string => {
  return user.name || user.email.split('@')[0]
}

/**
 * Get user avatar URL or fallback
 */
export const getUserAvatarUrl = (user: User): string | undefined => {
  return user.avatar || undefined
}

/**
 * Get user initials for avatar fallback
 */
export const getUserInitials = (user: User): string => {
  const name = user.name || user.email
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}
