interface StylesConfig {
  backgroundColor: string;
  padding: string;
}

interface DisplayConfig {
  showTitle: boolean;
  showSubtitle: boolean;
  showForm: boolean;
}

interface OptionsConfig {
  autoFocus: boolean;
  showResetButton: boolean;
  enableNotifications: boolean;
}

interface FeedbackSectionConfig {
  title: string;
  subtitle: string;
  sectionId: string;
  styles: StylesConfig;
  display: DisplayConfig;
  options: OptionsConfig;
}

export const feedbackSectionConfig: FeedbackSectionConfig = {
  title: 'Обратная связь',
  subtitle: 'Помогите нам стать лучше! Оставьте свой отзыв о проекте.',
  sectionId: 'feedback-section',
  
  styles: {
    backgroundColor: '#f9f7f4',
    padding: '60px 0'
  },
  
  display: {
    showTitle: true,
    showSubtitle: true,
    showForm: true
  },
  
  options: {
    autoFocus: false,
    showResetButton: true,
    enableNotifications: true
  }
};