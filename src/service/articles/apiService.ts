import axios, { type AxiosResponse } from 'axios'
import { 
  GET_ARTICLE, 
  POST_ARTICLE, 
  GET_ARTICLE_BY_ID, 
  UPDATE_ARTICLE, 
  DELETE_ARTICLE, 
  ARTICLE_STATUS 
} from '@/API/endpoint'

// Types based on API response
export interface Article {
  id: number
  title: string
  journal_name: string
  publication_date: string
  volume: string
  issue: string
  pages: string
  doi: string | null
  is_main_author: number | boolean
  co_authors: string
  calculated_points: number
  status: 'pending' | 'verified_auto' | 'verified_manual' | 'rejected'
  evidence_file: string | null
  created_at: string
  updated_at: string
  field_of_study: string
  publisher: string
}

export interface ArticleListResponse {
  articles: Article[]
  total: number
  limit: number
  offset: number
}

export interface CreateArticleRequest {
  title: string
  journal_name: string
  publisher: string
  field_of_study: string
  publication_date: string
  volume: string
  issue: string
  pages: string
  doi?: string
  is_main_author: boolean
  co_authors: string
}

export interface UpdateArticleRequest {
  title: string
  journal_name: string
  publication_date: string
  field_of_study: string
  publisher: string
  volume: string
  issue: string
  pages: string
  doi?: string
  is_main_author: boolean
  co_authors: string
}

export interface ArticleStats {
  summary: {
    total_articles: number
    total_points: number
    main_author_count: number
    total_journals: number
  }
  by_status: Array<{
    status: string
    count: number
  }>
  by_year: Array<{
    year: number
    count: number
    total_points: number
  }>
  top_journals: Array<{
    journal_name: string
    count: number
  }>
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

export class ArticleApiService {
  /**
   * Get articles list with optional filters
   */
  static async getArticles(params?: {
    status?: string
    limit?: number
    offset?: number
  }): Promise<ArticleListResponse> {
    try {
      const client = createAuthenticatedClient()
      console.log('Making API call to:', GET_ARTICLE)
      console.log('Query params:', params)
      
      const response: AxiosResponse<ArticleListResponse> = await client.get(GET_ARTICLE, { params })
      console.log('Articles API response:', response.data)
      
      return response.data
    } catch (error) {
      console.error('ArticleApiService.getArticles error:', error)
      
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message || 
                       error.response?.data?.detail || 
                       'Không thể lấy danh sách bài báo'
        throw new Error(message)
      }
      
      throw new Error('Có lỗi xảy ra khi lấy danh sách bài báo')
    }
  }

  /**
   * Get article by ID
   */
  static async getArticleById(articleId: number): Promise<Article> {
    try {
      const client = createAuthenticatedClient()
      const url = GET_ARTICLE_BY_ID.replace('{article_id}', articleId.toString())
      console.log('Making API call to:', url)
      
      const response: AxiosResponse<Article> = await client.get(url)
      console.log('Article detail API response:', response.data)
      
      return response.data
    } catch (error) {
      console.error('ArticleApiService.getArticleById error:', error)
      
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message || 
                       error.response?.data?.detail || 
                       'Không thể lấy thông tin bài báo'
        throw new Error(message)
      }
      
      throw new Error('Có lỗi xảy ra khi lấy thông tin bài báo')
    }
  }

  /**
   * Create new article
   */
  static async createArticle(articleData: CreateArticleRequest): Promise<Article> {
    try {
      const client = createAuthenticatedClient()
      console.log('Making API call to:', POST_ARTICLE)
      console.log('Article data:', articleData)
      
      const response: AxiosResponse<Article> = await client.post(POST_ARTICLE, articleData)
      console.log('Create article API response:', response.data)
      
      return response.data
    } catch (error) {
      console.error('ArticleApiService.createArticle error:', error)
      
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message || 
                       error.response?.data?.detail || 
                       'Không thể tạo bài báo'
        throw new Error(message)
      }
      
      throw new Error('Có lỗi xảy ra khi tạo bài báo')
    }
  }

  /**
   * Update article
   */
  static async updateArticle(articleId: number, articleData: UpdateArticleRequest): Promise<Article> {
    try {
      const client = createAuthenticatedClient()
      const url = UPDATE_ARTICLE.replace('{article_id}', articleId.toString())
      console.log('Making API call to:', url)
      console.log('Update data:', articleData)
      
      const response: AxiosResponse<Article> = await client.put(url, articleData)
      console.log('Update article API response:', response.data)
      
      return response.data
    } catch (error) {
      console.error('ArticleApiService.updateArticle error:', error)
      
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message || 
                       error.response?.data?.detail || 
                       'Không thể cập nhật bài báo'
        throw new Error(message)
      }
      
      throw new Error('Có lỗi xảy ra khi cập nhật bài báo')
    }
  }

  /**
   * Delete article
   */
  static async deleteArticle(articleId: number): Promise<void> {
    try {
      const client = createAuthenticatedClient()
      const url = DELETE_ARTICLE.replace('{article_id}', articleId.toString())
      console.log('Making API call to:', url)
      
      await client.delete(url)
      console.log('Delete article successful')
    } catch (error) {
      console.error('ArticleApiService.deleteArticle error:', error)
      
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message || 
                       error.response?.data?.detail || 
                       'Không thể xóa bài báo'
        throw new Error(message)
      }
      
      throw new Error('Có lỗi xảy ra khi xóa bài báo')
    }
  }

  /**
   * Get articles statistics
   */
  static async getArticleStats(): Promise<ArticleStats> {
    try {
      const client = createAuthenticatedClient()
      console.log('Making API call to:', ARTICLE_STATUS)
      
      const response: AxiosResponse<ArticleStats> = await client.get(ARTICLE_STATUS)
      console.log('Article stats API response:', response.data)
      
      return response.data
    } catch (error) {
      console.error('ArticleApiService.getArticleStats error:', error)
      
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message || 
                       error.response?.data?.detail || 
                       'Không thể lấy thống kê bài báo'
        throw new Error(message)
      }
      
      throw new Error('Có lỗi xảy ra khi lấy thống kê bài báo')
    }
  }
}
