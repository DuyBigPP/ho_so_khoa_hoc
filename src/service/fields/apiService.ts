import axios, { AxiosResponse } from 'axios'
import { GET_FIELD_OF_STUDY } from '@/API/endpoint'

export interface FieldOfStudy {
  id: number
  name: string
}

export interface FieldsOfStudyResponse {
  fields_of_study: FieldOfStudy[]
}

const createClient = () => {
  return axios.create({
    headers: {
      'Content-Type': 'application/json',
    },
  })
}

export class FieldsApiService {
  static async getFieldsOfStudy(): Promise<FieldOfStudy[]> {
    try {
      const client = createClient()
      const response: AxiosResponse<FieldsOfStudyResponse> = await client.get(GET_FIELD_OF_STUDY)
      
      console.log('FieldsApiService: Fields loaded:', response.data)
      return response.data.fields_of_study
    } catch (error) {
      console.error('FieldsApiService: Error loading fields:', error)
      throw new Error('Không thể tải danh sách lĩnh vực nghiên cứu')
    }
  }
}
