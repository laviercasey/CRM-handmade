interface AnimationConfig {
  duration: number;
  easing: string;
}

interface AccessibilityConfig {
  autoFocus: boolean;
  trapFocus: boolean;
  restoreFocus: boolean;
}

interface LoginModalConfig {
  title: string;
  size: 'small' | 'medium' | 'large' | 'fullscreen';
  closable: boolean;
  closeOnOverlayClick: boolean;
  closeOnEscape: boolean;
  showHeader: boolean;
  showActions: boolean;
  animation: AnimationConfig;
  accessibility: AccessibilityConfig;
}

export const loginModalConfig: LoginModalConfig = {
  title: 'Вход в систему',
  size: 'small',
  closable: true,
  
  closeOnOverlayClick: true,
  closeOnEscape: true,
  
  showHeader: true,
  showActions: true,
  
  animation: {
    duration: 300,
    easing: 'ease'
  },
  
  accessibility: {
    autoFocus: true,
    trapFocus: true,
    restoreFocus: true
  }
};