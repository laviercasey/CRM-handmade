import AuthService from '@/shared/api/auth.service'

interface LoginCredentials {
  username: string
  password: string
}

interface UserData {
  username: string
  email: string
  password: string
  [key: string]: any
}

interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
}

/**
 * API адаптер для работы с аутентификацией
 * Предоставляет упрощенный интерфейс для entities слоя
 */
export class AuthApi {
  /**
   * Авторизация пользователя
   * @param credentials - учетные данные
   * @returns результат авторизации
   */
  static async login(credentials: LoginCredentials): Promise<ApiResponse> {
    try {
      const response = await AuthService.login(credentials)
      return {
        success: true,
        data: response
      }
    } catch (error: any) {
      console.error('Login error:', error)
      return {
        success: false,
        error: error.response?.data?.message || 'Ошибка входа в систему'
      }
    }
  }

  /**
   * Регистрация пользователя
   * @param userData - данные пользователя
   * @returns результат регистрации
   */  
  static async register(userData: UserData): Promise<ApiResponse> {
    try {
      const response = await AuthService.register(userData)
      return {
        success: true,
        data: response
      }
    } catch (error: any) {
      console.error('Registration error:', error)
      return {
        success: false,
        error: error.response?.data?.message || 'Ошибка регистрации'
      }
    }
  }

  /**
   * Получение текущего пользователя
   * @returns данные пользователя
   */
  static async getCurrentUser(): Promise<ApiResponse> {
    try {
      const response = await AuthService.getCurrentUser()
      return {
        success: true,
        data: response
      }
    } catch (error: any) {
      console.error('Get current user error:', error)
      return {
        success: false,
        error: error.response?.data?.message || 'Ошибка получения данных пользователя'
      }
    }
  }

  /**
   * Обновление токена
   * @param refreshToken - токен обновления
   * @returns новые токены
   */
  static async refreshToken(refreshToken: string): Promise<ApiResponse> {
    try {
      const response = await AuthService.refreshToken(refreshToken)
      return {
        success: true,
        data: response
      }
    } catch (error: any) {
      console.error('Refresh token error:', error)
      return {
        success: false,
        error: error.response?.data?.message || 'Ошибка обновления токена'
      }
    }
  }
}