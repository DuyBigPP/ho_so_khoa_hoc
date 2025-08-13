import type { User, LoginCredentials } from '@/types/auth'

// Mock users data
const MOCK_USERS: Record<string, User & { password: string }> = {
  'admin@example.com': {
    id: '1',
    email: 'admin@example.com',
    name: 'Admin User',
    role: 'admin',
    password: 'admin123',
    avatar: undefined
  },
  'user@example.com': {
    id: '2',
    email: 'user@example.com',
    name: 'Nguyễn Văn A',
    role: 'user',
    password: 'user123',
    avatar: undefined
  }
}

export class AuthService {
  private static readonly TOKEN_KEY = 'auth_token'
  private static readonly USER_KEY = 'auth_user'

  static async login(credentials: LoginCredentials): Promise<User> {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000))

    const user = MOCK_USERS[credentials.email]
    
    if (!user || user.password !== credentials.password) {
      throw new Error('Email hoặc mật khẩu không đúng')
    }

    // Remove password from user object
    const { password, ...userWithoutPassword } = user

    // Mock JWT token
    const token = `mock_jwt_token_${Date.now()}`
    
    // Store in localStorage (in real app, use httpOnly cookies)
    localStorage.setItem(this.TOKEN_KEY, token)
    localStorage.setItem(this.USER_KEY, JSON.stringify(userWithoutPassword))

    return userWithoutPassword
  }

  static logout(): void {
    localStorage.removeItem(this.TOKEN_KEY)
    localStorage.removeItem(this.USER_KEY)
  }

  static getCurrentUser(): User | null {
    const token = localStorage.getItem(this.TOKEN_KEY)
    const userStr = localStorage.getItem(this.USER_KEY)

    if (!token || !userStr) {
      return null
    }

    try {
      return JSON.parse(userStr)
    } catch {
      return null
    }
  }

  static isAuthenticated(): boolean {
    return !!localStorage.getItem(this.TOKEN_KEY)
  }

  // Mock method to get available demo credentials
  static getDemoCredentials() {
    return {
      admin: {
        email: 'admin@example.com',
        password: 'admin123',
        role: 'admin'
      },
      user: {
        email: 'user@example.com',
        password: 'user123',
        role: 'user'
      }
    }
  }
}
