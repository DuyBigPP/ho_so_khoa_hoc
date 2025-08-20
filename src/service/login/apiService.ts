import axios, { AxiosResponse } from 'axios'
import { LOGIN, LOGOUT, REGISTER, GET_USER_PROFILE } from '@/API/endpoint'
import type { LoginCredentials, User } from '@/types/auth'

// API Response types based on endpoint.ts
interface LoginResponse {
  access_token: string
  token_type: string
  role?: 'user' | 'admin' // Optional in case API doesn't return it
}

interface UserProfileResponse {
  id: number
  full_name: string
  email: string
  phone_number: string | null
  birth_date: string | null
  avatar_path: string | null
  avatar_url: string | null
  thoi_gian_cong_tac: number
  so_nam_sau_ts: number
  so_gio_giang_chuan: number
  so_hoc_vien_thac_si_huong_dan: number
  so_ncs_tien_si_huong_dan: number
  so_de_tai_cap_bo: number
  so_de_tai_cap_co_so: number
  created_at: string
}

interface RegisterRequest {
  email: string
  password: string
  full_name: string
}

// Create axios instance with base configuration
const apiClient = axios.create({
  timeout: 10000, // 10 seconds
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add request interceptor to include auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Add response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('auth_token')
      localStorage.removeItem('auth_user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export class LoginApiService {
  /**
   * Login user with email and password
   */
  static async login(credentials: LoginCredentials): Promise<User> {
    try {
      console.log('Making login API call to:', LOGIN)
      const response: AxiosResponse<LoginResponse> = await apiClient.post(LOGIN, {
        email: credentials.email,
        password: credentials.password,
      })

      console.log('Login API response:', response.data)
      const { access_token, role } = response.data

      // Store token
      localStorage.setItem('auth_token', access_token)

      // Get user profile information (only for user role)
      if (role === 'user') {
        try {
          console.log('Fetching user profile from:', GET_USER_PROFILE)
          const profileResponse: AxiosResponse<UserProfileResponse> = await axios.get(
            GET_USER_PROFILE,
            {
              headers: {
                'Authorization': `Bearer ${access_token}`,
                'Content-Type': 'application/json',
              },
            }
          )

          console.log('User profile API response:', profileResponse.data)
          const profileData = profileResponse.data

          // Create user object with real profile data
          const user: User = {
            id: profileData.id.toString(),
            email: profileData.email,
            name: profileData.full_name || 'User',
            role: role || 'user',
            avatar: profileData.avatar_url || profileData.avatar_path || undefined
          }

          console.log('Created user object with profile data:', user)
          localStorage.setItem('auth_user', JSON.stringify(user))
          return user

        } catch (profileError) {
          console.warn('Failed to fetch user profile, using fallback data:', profileError)
        }
      }
      
      // Fallback for admin or when profile fetch fails
      const user: User = {
        id: `user_${Date.now()}`,
        email: credentials.email,
        name: role === 'admin' ? 'Administrator' : 'User',
        role: role || 'user',
        avatar: undefined
      }

      console.log('Created fallback user object:', user)
      localStorage.setItem('auth_user', JSON.stringify(user))
      return user
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message || error.response?.data?.detail || 'Đăng nhập thất bại'
        throw new Error(message)
      }
      throw new Error('Có lỗi xảy ra khi đăng nhập')
    }
  }

  /**
   * Register new user
   */
  static async register(data: RegisterRequest): Promise<void> {
    try {
      await apiClient.post(REGISTER, {
        email: data.email,
        password: data.password,
        full_name: data.full_name,
      })
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message || error.response?.data?.detail || 'Đăng ký thất bại'
        throw new Error(message)
      }
      throw new Error('Có lỗi xảy ra khi đăng ký')
    }
  }

  /**
   * Logout user
   */
  static async logout(): Promise<void> {
    try {
      // Call logout API
      await apiClient.post(LOGOUT)
    } catch (error) {
      // Even if API call fails, still clear local storage
      console.warn('Logout API call failed:', error)
    } finally {
      // Always clear local storage
      localStorage.removeItem('auth_token')
      localStorage.removeItem('auth_user')
    }
  }

  /**
   * Get current user from localStorage
   */
  static getCurrentUser(): User | null {
    const token = localStorage.getItem('auth_token')
    const userStr = localStorage.getItem('auth_user')

    if (!token || !userStr) {
      return null
    }

    try {
      return JSON.parse(userStr)
    } catch {
      return null
    }
  }

  /**
   * Check if user is authenticated
   */
  static isAuthenticated(): boolean {
    return !!localStorage.getItem('auth_token')
  }

  /**
   * Get auth token
   */
  static getToken(): string | null {
    return localStorage.getItem('auth_token')
  }
}
