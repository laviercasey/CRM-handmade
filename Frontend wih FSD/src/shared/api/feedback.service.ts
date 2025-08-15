import api from './index';

interface FeedbackData {
  name?: string;
  email?: string;
  message: string;
  rating?: number;
  [key: string]: any;
}

interface FaqQuestion {
  id: number;
  question: string;
  answer: string;
  category_id: number;
  [key: string]: any;
}

interface FaqCategory {
  id: number;
  name: string;
  description?: string;
  [key: string]: any;
}

interface QuestionData {
  question: string;
  category_id?: number;
  email?: string;
}

class FeedbackService {
  async getFeedbacks(params: Record<string, any> = {}) {
    const response = await api.get('/feedback', { params });
    return response.data;
  }
  
  async createFeedback(feedbackData: FeedbackData) {
    const response = await api.post('/feedback', feedbackData);
    return response.data;
  }
  
  async submitFaqFeedback(questionId: number, isHelpful: boolean) {
    const response = await api.post('/feedback/faq', {
      question_id: questionId,
      is_helpful: isHelpful
    });
    return response.data;
  }
  
  async getPopularFaqQuestions() {
    const response = await api.get<FaqQuestion[]>('/feedback/faq/popular');
    return response.data;
  }
  
  async suggestFaqQuestion(questionData: QuestionData) {
    const response = await api.post('/feedback/faq/suggest', questionData);
    return response.data;
  }
  
  async getFaqCategories() {
    const response = await api.get<FaqCategory[]>('/feedback/faq/categories');
    return response.data;
  }
  
  async getFaqByCategory(categoryId: number | string) {
    const response = await api.get<FaqQuestion[]>(`/feedback/faq/categories/${categoryId}`);
    return response.data;
  }
  
  async searchFaq(query: string) {
    const response = await api.get<FaqQuestion[]>('/feedback/faq/search', {
      params: { q: query }
    });
    return response.data;
  }
}

export default new FeedbackService();