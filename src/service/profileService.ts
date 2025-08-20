import axios, { AxiosResponse } from 'axios'
import { GET_PROFILE_COMPLETION_STATUS, COMPLETE_USER_PROFILE, REGISTER } from '@/API/endpoint'

// Types for profile completion
export interface ProfileCompletionStatus {
  is_first_time: boolean
  completion_percentage: number
  required_fields: string[]
  missing_fields: string[]
  next_step: string
  can_submit_works: boolean
}

export interface CompleteProfileRequest {
  full_name: string
  phone_number: string
  birth_date: string // Format: YYYY-MM-DD
  thoi_gian_cong_tac: number
  so_nam_sau_ts: number
  so_gio_giang_chuan: number
  so_hoc_vien_thac_si_huong_dan: number
  so_ncs_tien_si_huong_dan: number
  so_de_tai_cap_bo: number
  so_de_tai_cap_co_so: number
}

export interface RegisterRequest {
  email: string
  password: string
  full_name: string
}

// Create axios instance with auth token
const createAuthenticatedClient = () => {
  const client = axios.create({
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
    },
  })

  // Add auth token to requests
  client.interceptors.request.use((config) => {
    const token = localStorage.getItem('auth_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  })

  return client
}

export class ProfileService {
  /**
   * Get profile completion status
   */
  static async getProfileCompletionStatus(): Promise<ProfileCompletionStatus> {
    try {
      const client = createAuthenticatedClient()
      const token = localStorage.getItem('auth_token')
      console.log('Making API call to:', GET_PROFILE_COMPLETION_STATUS)
      console.log('With token:', token ? 'Token exists' : 'No token')
      
      const response: AxiosResponse<ProfileCompletionStatus> = await client.get(
        GET_PROFILE_COMPLETION_STATUS
      )
      console.log('Raw API Response:', response.data)
      console.log('is_first_time value:', response.data.is_first_time)
      console.log('is_first_time type:', typeof response.data.is_first_time)
      
      // Ensure boolean conversion - handle various API response formats
      const isFirstTime = response.data.is_first_time
      const result = {
        ...response.data,
        is_first_time: isFirstTime === true
      }
      console.log('Processed result:', result)
      return result
    } catch (error) {
      console.error('ProfileService.getProfileCompletionStatus error:', error)
      if (axios.isAxiosError(error)) {
        console.error('Response status:', error.response?.status)
        console.error('Response data:', error.response?.data)
        const message = error.response?.data?.message || error.response?.data?.detail || 'Không thể lấy thông tin hồ sơ'
        throw new Error(message)
      }
      throw new Error('Có lỗi xảy ra khi kiểm tra hồ sơ')
    }
  }

  /**
   * Complete user profile
   */
  static async completeProfile(data: CompleteProfileRequest): Promise<void> {
    try {
      const client = createAuthenticatedClient()
      await client.put(COMPLETE_USER_PROFILE, data)
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message || error.response?.data?.detail || 'Không thể cập nhật hồ sơ'
        throw new Error(message)
      }
      throw new Error('Có lỗi xảy ra khi cập nhật hồ sơ')
    }
  }

  /**
   * Register new user
   */
  static async register(data: RegisterRequest): Promise<void> {
    try {
      await axios.post(REGISTER, {
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
}
