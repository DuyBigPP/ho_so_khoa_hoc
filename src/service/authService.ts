import type { User, LoginCredentials } from '@/types/auth'
import { LoginApiService } from '@/service/login'

export class AuthService {
  /**
   * Login with real API
   */
  static async login(credentials: LoginCredentials): Promise<User> {
    try {
      return await LoginApiService.login(credentials)
    } catch (error) {
      throw error
    }
  }

  /**
   * Logout with real API
   */
  static async logout(): Promise<void> {
    try {
      await LoginApiService.logout()
    } catch (error) {
      // Even if API fails, still clear local data
      console.warn('Logout API failed:', error)
    }
  }

  /**
   * Get current user from storage
   */
  static getCurrentUser(): User | null {
    return LoginApiService.getCurrentUser()
  }

  /**
   * Check if user is authenticated
   */
  static isAuthenticated(): boolean {
    return LoginApiService.isAuthenticated()
  }

  /**
   * Get auth token
   */
  static getToken(): string | null {
    return LoginApiService.getToken()
  }


}
