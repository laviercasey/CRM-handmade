import api from './api'

class FeedbackService {
  async getFeedbacks(params = {}) {
    const response = await api.get('/feedback', { params })
    return response.data
  }
  
  async createFeedback(feedbackData) {
    const response = await api.post('/feedback', feedbackData)
    return response.data
  }
  
  async submitFaqFeedback(questionId, isHelpful) {
    const response = await api.post('/feedback/faq', {
      question_id: questionId,
      is_helpful: isHelpful
    })
    return response.data
  }
  
  async getPopularFaqQuestions() {
    const response = await api.get('/feedback/faq/popular')
    return response.data
  }

  async suggestFaqQuestion(questionData) {
    const response = await api.post('/feedback/faq/suggest', questionData)
    return response.data
  }

  async getFaqCategories() {
    const response = await api.get('/feedback/faq/categories')
    return response.data
  }
  
  async getFaqByCategory(categoryId) {
    const response = await api.get(`/feedback/faq/categories/${categoryId}`)
    return response.data
  }
  
  async searchFaq(query) {
    const response = await api.get('/feedback/faq/search', {
      params: { q: query }
    })
    return response.data
  }
}

export default new FeedbackService()
