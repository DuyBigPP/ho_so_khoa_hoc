import axios, { type AxiosResponse } from 'axios'
import { UPLOAD_DOCUMENT } from '@/API/endpoint'

// Types based on API endpoint
export interface UploadDocumentRequest {
  work_id: number
  document_type: string
  file: File
}

export interface UploadDocumentResponse {
  success: boolean
  message: string
  document_id?: number
  file_path?: string
}

// Create authenticated axios client
const createAuthenticatedClient = () => {
  const token = localStorage.getItem('auth_token')
  return axios.create({
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  })
}

export class DocumentApiService {
  /**
   * Upload document for a work
   */
  static async uploadDocument(data: UploadDocumentRequest): Promise<UploadDocumentResponse> {
    try {
      const client = createAuthenticatedClient()
      console.log('Making API call to:', UPLOAD_DOCUMENT)
      console.log('Upload data:', {
        work_id: data.work_id,
        document_type: data.document_type,
        fileName: data.file.name,
        fileSize: data.file.size,
        fileType: data.file.type
      })

      // Create FormData for file upload
      const formData = new FormData()
      formData.append('work_id', data.work_id.toString())
      formData.append('document_type', data.document_type)
      formData.append('file', data.file)

      const response: AxiosResponse<UploadDocumentResponse> = await client.post(
        UPLOAD_DOCUMENT, 
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      )

      console.log('Upload document API response:', response.data)
      return response.data

    } catch (error) {
      console.error('DocumentApiService.uploadDocument error:', error)
      
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message || 
                       error.response?.data?.detail || 
                       'Không thể tải lên tài liệu'
        throw new Error(message)
      }
      
      throw new Error('Có lỗi xảy ra khi tải lên tài liệu')
    }
  }

  /**
   * Validate file before upload
   */
  static validateFile(file: File): { isValid: boolean; error?: string } {
    // File size limit (10MB)
    const maxSize = 10 * 1024 * 1024
    if (file.size > maxSize) {
      return {
        isValid: false,
        error: 'Kích thước file không được vượt quá 10MB'
      }
    }

    // Allowed file types
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'image/jpeg',
      'image/png',
      'image/gif'
    ]

    if (!allowedTypes.includes(file.type)) {
      return {
        isValid: false,
        error: 'Chỉ chấp nhận file PDF, Word, Excel, hoặc ảnh (JPG, PNG, GIF)'
      }
    }

    return { isValid: true }
  }

  /**
   * Format file size for display
   */
  static formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes'
    
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }
}
