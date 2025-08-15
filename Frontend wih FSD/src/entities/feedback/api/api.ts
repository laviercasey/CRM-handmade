import FeedbackService from '@/shared/api/feedback.service'

interface FeedbackData {
  message: string
  type?: string
  name?: string
}

interface FeedbackFormData {
  message: string
  name?: string
}

interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
}

interface FeedbackParams {
  [key: string]: any
}

export class FeedbackApi {
  static async createFeedback(feedbackData: FeedbackData): Promise<ApiResponse> {
    try {
      const response = await FeedbackService.createFeedback(feedbackData)
      return {
        success: true,
        data: response
      }
    } catch (error: any) {
      console.error('Error creating feedback:', error)
      return {
        success: false,
        error: error.message || 'Не удалось отправить отзыв'
      }
    }
  }

  static async getFeedbacks(params: FeedbackParams = {}): Promise<ApiResponse> {
    try {
      const response = await FeedbackService.getFeedbacks(params)
      return {
        success: true,
        data: response
      }
    } catch (error: any) {
      console.error('Error getting feedbacks:', error)
      return {
        success: false,
        error: error.message || 'Не удалось загрузить отзывы'
      }
    }
  }

  static formatFeedbackData(formData: FeedbackFormData, isAuthenticated: boolean = false): FeedbackData {
    const data: FeedbackData = {
      message: formData.message.trim(),
      type: 'general'
    }

    if (!isAuthenticated && formData.name) {
      data.name = formData.name.trim()
    }

    return data
  }
}