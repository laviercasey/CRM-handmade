export const FEEDBACK_TYPES = {
  GENERAL: 'general',
  BUG_REPORT: 'bug_report',
  FEATURE_REQUEST: 'feature_request',
  COMPLAINT: 'complaint',
  PRAISE: 'praise'
} as const

export type FeedbackType = typeof FEEDBACK_TYPES[keyof typeof FEEDBACK_TYPES]

export const FEEDBACK_STATUS = {
  NEW: 'new',
  IN_PROGRESS: 'in_progress',
  RESOLVED: 'resolved',
  CLOSED: 'closed'
} as const

export type FeedbackStatus = typeof FEEDBACK_STATUS[keyof typeof FEEDBACK_STATUS]

export const FEEDBACK_PRIORITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  URGENT: 'urgent'
} as const

export type FeedbackPriority = typeof FEEDBACK_PRIORITY[keyof typeof FEEDBACK_PRIORITY]

interface FeedbackFieldConfig {
  required: boolean
  minLength: number
  maxLength: number
  placeholder: string
}

interface FeedbackFormConfigType {
  name: FeedbackFieldConfig
  message: FeedbackFieldConfig
}

export const FEEDBACK_FORM_CONFIG: FeedbackFormConfigType = {
  name: {
    required: true,
    minLength: 2,
    maxLength: 50,
    placeholder: 'Представьтесь, пожалуйста'
  },
  message: {
    required: true,
    minLength: 10,
    maxLength: 1000,
    placeholder: 'Ваш отзыв или пожелания'
  }
}

interface FeedbackMessagesType {
  success: string
  error: string
  submitting: string
  submitButton: string
}

export const FEEDBACK_MESSAGES: FeedbackMessagesType = {
  success: 'Спасибо за ваш отзыв! Он поможет нам сделать проект лучше.',
  error: 'Произошла ошибка при отправке отзыва. Пожалуйста, попробуйте позже.',
  submitting: 'Отправка...',
  submitButton: 'Отправить отзыв'
}