import { useStore } from 'vuex';
import FeedbackService from '@/shared/api/feedback.service';

interface FeedbackParams {
  itemId: number;
  isHelpful: boolean;
}

interface NotificationData {
  title: string;
  message: string;
}

export function useFaqSection() {
  const store = useStore();

  async function handleFeedback({ itemId, isHelpful }: FeedbackParams): Promise<void> {
    try {
      await FeedbackService.submitFaqFeedback(itemId, isHelpful);
      
      if (store.dispatch) {
        store.dispatch('notifications/showSuccess', {
          title: 'Спасибо за отзыв',
          message: 'Ваш отзыв поможет нам улучшить ответы на вопросы'
        } as NotificationData);
      }
    } catch (error) {
      console.error('Error handling feedback:', error);
      
      if (store.dispatch) {
        store.dispatch('notifications/showError', {
          title: 'Ошибка',
          message: 'Не удалось отправить отзыв. Попробуйте позже.'
        } as NotificationData);
      }
    }
  }

  return {
    handleFeedback
  };
}