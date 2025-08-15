import FeedbackService from '@/shared/api/feedback.service';

interface QuestionData {
  question: string;
  category_id?: number;
  email?: string;
  [key: string]: any;
}

export class FaqFeedbackService {
  static async submitFeedback(itemId: number, isHelpful: boolean): Promise<any> {
    return await FeedbackService.submitFaqFeedback(itemId, isHelpful);
  }

  static async getPopularQuestions(): Promise<any[]> {
    return await FeedbackService.getPopularFaqQuestions();
  }

  static async suggestQuestion(questionData: QuestionData): Promise<any> {
    return await FeedbackService.suggestFaqQuestion(questionData);
  }
}

export { default as FeedbackService } from '@/shared/api/feedback.service';