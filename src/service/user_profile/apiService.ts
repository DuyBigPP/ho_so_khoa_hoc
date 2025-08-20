import axios, { type AxiosResponse } from 'axios'
import { GET_USER_PROFILE, UPDATE_USER_PROFILE, UPLOAD_AVATAR } from '@/API/endpoint'

// Types based on API response
export interface UserProfile {
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

// Update request type (based on API endpoint)
export interface UpdateUserProfileRequest {
  full_name: string
  phone_number: string
  birth_date: string
  thoi_gian_cong_tac: number
  so_nam_sau_ts: number
  so_gio_giang_chuan: number
  so_hoc_vien_thac_si_huong_dan: number
  so_ncs_tien_si_huong_dan: number
  so_de_tai_cap_bo: number
  so_de_tai_cap_co_so: number
}

// Create authenticated axios client
const createAuthenticatedClient = () => {
  const token = localStorage.getItem('auth_token')
  return axios.create({
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  })
}

// Create authenticated axios client for file uploads
const createFileUploadClient = () => {
  const token = localStorage.getItem('auth_token')
  return axios.create({
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'multipart/form-data',
    },
  })
}

export class UserProfileApiService {
  /**
   * Get user profile information
   */
  static async getUserProfile(): Promise<UserProfile> {
    try {
      const client = createAuthenticatedClient()
      console.log('Making API call to:', GET_USER_PROFILE)
      
      const response: AxiosResponse<UserProfile> = await client.get(GET_USER_PROFILE)
      console.log('User profile API response:', response.data)
      
      return response.data
    } catch (error) {
      console.error('UserProfileApiService.getUserProfile error:', error)
      
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message || 
                       error.response?.data?.detail || 
                       'Không thể lấy thông tin hồ sơ'
        throw new Error(message)
      }
      
      throw new Error('Có lỗi xảy ra khi lấy thông tin hồ sơ')
    }
  }

  /**
   * Update user profile information
   */
  static async updateUserProfile(profileData: UpdateUserProfileRequest): Promise<UserProfile> {
    try {
      const client = createAuthenticatedClient()
      console.log('Making API call to:', UPDATE_USER_PROFILE)
      console.log('Update data:', profileData)
      
      const response: AxiosResponse<UserProfile | Record<string, unknown>> = await client.put(UPDATE_USER_PROFILE, profileData)
      console.log('Update profile API response:', response.data)
      console.log('Update response status:', response.status)
      
      // Check if update was successful
      if (response.status === 200 || response.status === 204) {
        // If API doesn't return updated data, fetch it separately
        if (!response.data || typeof response.data !== 'object' || !response.data.id) {
          console.log('Update API returned empty/invalid data, fetching fresh profile...')
          return await this.getUserProfile()
        }
        
        // Validate the returned data has required fields
        if (response.data.id && response.data.email) {
          return response.data as UserProfile
        } else {
          console.log('Update API returned incomplete data, fetching fresh profile...')
          return await this.getUserProfile()
        }
      }
      
      throw new Error('Cập nhật thất bại')
    } catch (error) {
      console.error('UserProfileApiService.updateUserProfile error:', error)
      
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message || 
                       error.response?.data?.detail || 
                       'Không thể cập nhật thông tin hồ sơ'
        throw new Error(message)
      }
      
      throw new Error('Có lỗi xảy ra khi cập nhật thông tin hồ sơ')
    }
  }

  /**
   * Upload avatar image
   */
  static async uploadAvatar(file: File): Promise<UserProfile> {
    try {
      const client = createFileUploadClient()
      console.log('Making API call to:', UPLOAD_AVATAR)
      console.log('Uploading file:', file.name, 'Size:', file.size)

      // Validate file
      if (!file) {
        throw new Error('Vui lòng chọn file ảnh')
      }

      // Check file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif']
      if (!allowedTypes.includes(file.type)) {
        throw new Error('Chỉ chấp nhận file ảnh (JPEG, PNG, GIF)')
      }

      // Check file size (max 5MB)
      const maxSize = 5 * 1024 * 1024
      if (file.size > maxSize) {
        throw new Error('Kích thước file không được vượt quá 5MB')
      }

      // Create form data
      const formData = new FormData()
      formData.append('file', file)

      const response: AxiosResponse<UserProfile | Record<string, unknown>> = await client.post(UPLOAD_AVATAR, formData)
      console.log('Upload avatar API response:', response.data)
      console.log('Upload response status:', response.status)

      // Check if upload was successful
      if (response.status === 200 || response.status === 201) {
        // If API doesn't return updated profile, fetch it separately
        if (!response.data || typeof response.data !== 'object' || !response.data.id) {
          console.log('Upload API returned empty/invalid data, fetching fresh profile...')
          return await this.getUserProfile()
        }

        // Validate the returned data has required fields
        if (response.data.id && response.data.email) {
          return response.data as UserProfile
        } else {
          console.log('Upload API returned incomplete data, fetching fresh profile...')
          return await this.getUserProfile()
        }
      }

      throw new Error('Upload thất bại')
    } catch (error) {
      console.error('UserProfileApiService.uploadAvatar error:', error)

      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message || 
                       error.response?.data?.detail || 
                       'Không thể upload ảnh đại diện'
        throw new Error(message)
      }

      throw new Error('Có lỗi xảy ra khi upload ảnh đại diện')
    }
  }
}
