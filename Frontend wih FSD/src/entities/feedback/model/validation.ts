import { validateRequiredField, validateFieldLength } from '@/shared/lib/validation'
import { FEEDBACK_FORM_CONFIG } from './types'

interface FeedbackFormData {
  name?: string
  message: string
}

interface ValidationResult {
  isValid: boolean
  errors: Record<string, string>
}

export function validateFeedbackName(name: string): string | null {
  const config = FEEDBACK_FORM_CONFIG.name
  
  const requiredError = validateRequiredField(name, 'Имя')
  if (requiredError) return requiredError
  
  return validateFieldLength(name, config.minLength, config.maxLength, 'Имя')
}

export function validateFeedbackMessage(message: string): string | null {
  const config = FEEDBACK_FORM_CONFIG.message
  
  const requiredError = validateRequiredField(message, 'Сообщение')
  if (requiredError) return requiredError
  
  return validateFieldLength(message, config.minLength, config.maxLength, 'Сообщение')
}

export function validateFeedbackForm(formData: FeedbackFormData, isAuthenticated: boolean = false): ValidationResult {
  const errors: Record<string, string> = {}
  
  if (!isAuthenticated) {
    const nameError = validateFeedbackName(formData.name || '')
    if (nameError) errors.name = nameError
  }
  
  const messageError = validateFeedbackMessage(formData.message)
  if (messageError) errors.message = messageError
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  }
}