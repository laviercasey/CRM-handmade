import { ref, reactive, computed, Ref } from 'vue'
import { useStore } from 'vuex'
import { validateFeedbackForm } from '@/entities/feedback/model/validation'
import { FeedbackApi } from '@/entities/feedback/api/api'
import { FEEDBACK_MESSAGES } from '@/entities/feedback/model/types'

interface FeedbackFormData {
  name: string
  message: string
}

interface FeedbackFormComposable {
  formData: FeedbackFormData
  errors: Ref<Record<string, string>>
  isSubmitting: Ref<boolean>
  showSuccess: Ref<boolean>
  submitError: Ref<string>
  isAuthenticated: Ref<boolean>
  isFormValid: Ref<boolean>
  hasChanges: Ref<boolean>
  canSubmit: Ref<boolean>
  validateForm: () => boolean
  validateField: (fieldName: string) => void
  clearErrors: () => void
  clearFieldError: (fieldName: string) => void
  resetForm: () => void
  submitForm: () => Promise<void>
}

export function useFeedbackForm(): FeedbackFormComposable {
  const store = useStore()
  
  const formData: FeedbackFormData = reactive({
    name: '',
    message: ''
  })
  
  const errors = ref<Record<string, string>>({})
  const isSubmitting = ref<boolean>(false)
  const showSuccess = ref<boolean>(false)
  const submitError = ref<string>('')
  
  const isAuthenticated = computed<boolean>(() => {
    return store?.getters?.['auth/isAuthenticated'] || false
  })
  
  const isFormValid = computed<boolean>(() => {
    const validation = validateFeedbackForm(formData, isAuthenticated.value)
    return validation.isValid
  })
  
  function validateForm(): boolean {
    const validation = validateFeedbackForm(formData, isAuthenticated.value)
    errors.value = validation.errors
    return validation.isValid
  }
  
  function clearErrors(): void {
    errors.value = {}
    submitError.value = ''
  }
  
  function resetForm(): void {
    formData.name = ''
    formData.message = ''
    clearErrors()
    showSuccess.value = false
  }
  
  async function submitForm(): Promise<void> {
    if (isSubmitting.value) return
    
    if (!validateForm()) {
      return
    }
    
    isSubmitting.value = true
    clearErrors()
    
    try {
      const feedbackData = FeedbackApi.formatFeedbackData(formData, isAuthenticated.value)
      
      const result = await FeedbackApi.createFeedback(feedbackData)
      
      if (result.success) {
        formData.message = ''
        if (!isAuthenticated.value) {
          formData.name = ''
        }
        
        showSuccess.value = true
        
        if (store?.dispatch) {
          store.dispatch('notifications/showSuccess', {
            title: 'Отзыв отправлен',
            message: FEEDBACK_MESSAGES.success
          })
        }
        
        setTimeout(() => {
          showSuccess.value = false
        }, 5000)
        
      } else {
        submitError.value = result.error || FEEDBACK_MESSAGES.error
        
        if (store?.dispatch) {
          store.dispatch('notifications/showError', {
            title: 'Ошибка отправки',
            message: result.error || FEEDBACK_MESSAGES.error
          })
        }
      }
      
    } catch (error) {
      console.error('Unexpected error submitting feedback:', error)
      submitError.value = FEEDBACK_MESSAGES.error
      
      if (store?.dispatch) {
        store.dispatch('notifications/showError', {
          title: 'Неожиданная ошибка',
          message: FEEDBACK_MESSAGES.error
        })
      }
    } finally {
      isSubmitting.value = false
    }
  }
  
  function validateField(fieldName: string): void {
    const validation = validateFeedbackForm(formData, isAuthenticated.value)
    if (validation.errors[fieldName]) {
      errors.value[fieldName] = validation.errors[fieldName]
    } else {
      delete errors.value[fieldName]
    }
  }
  
  function clearFieldError(fieldName: string): void {
    delete errors.value[fieldName]
  }
  
  const hasChanges = computed<boolean>(() => {
    return formData.message.trim() !== '' || (!isAuthenticated.value && formData.name.trim() !== '')
  })
  
  const canSubmit = computed<boolean>(() => {
    return isFormValid.value && !isSubmitting.value && hasChanges.value
  })
  
  return {
    formData,
    errors,
    isSubmitting,
    showSuccess,
    submitError,
    isAuthenticated,
    isFormValid,
    hasChanges,
    canSubmit,
    validateForm,
    validateField,
    clearErrors,
    clearFieldError,
    resetForm,
    submitForm
  }
}