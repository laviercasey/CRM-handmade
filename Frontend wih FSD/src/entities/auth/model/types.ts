/**
 * Состояния аутентификации
 */
export const AUTH_STATUS = {
  IDLE: 'idle',
  LOADING: 'loading',
  AUTHENTICATED: 'authenticated',
  UNAUTHENTICATED: 'unauthenticated',
  ERROR: 'error'
} as const

export type AuthStatus = typeof AUTH_STATUS[keyof typeof AUTH_STATUS]

/**
 * Типы токенов
 */
export const TOKEN_TYPES = {
  ACCESS: 'access_token',
  REFRESH: 'refresh_token'
} as const

export type TokenType = typeof TOKEN_TYPES[keyof typeof TOKEN_TYPES]

/**
 * Ключи для localStorage
 */
export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'accessToken',
  REFRESH_TOKEN: 'refreshToken',
  USER: 'user'
} as const

export type StorageKey = typeof STORAGE_KEYS[keyof typeof STORAGE_KEYS]

/**
 * Типы модальных окон аутентификации
 */
export const AUTH_MODALS = {
  LOGIN: 'login',
  REGISTER: 'register',
  FORGOT_PASSWORD: 'forgot_password',
  RESET_PASSWORD: 'reset_password'
} as const

export type AuthModal = typeof AUTH_MODALS[keyof typeof AUTH_MODALS]

/**
 * Сообщения аутентификации
 */
export const AUTH_MESSAGES = {
  LOGIN_SUCCESS: 'Вы успешно вошли в систему',
  LOGIN_ERROR: 'Ошибка входа в систему',
  REGISTER_SUCCESS: 'Регистрация прошла успешно',
  REGISTER_ERROR: 'Ошибка регистрации',
  LOGOUT_SUCCESS: 'Вы вышли из системы',
  TOKEN_EXPIRED: 'Сессия истекла, войдите снова',
  INVALID_CREDENTIALS: 'Неверные учетные данные'
} as const

export type AuthMessage = typeof AUTH_MESSAGES[keyof typeof AUTH_MESSAGES]