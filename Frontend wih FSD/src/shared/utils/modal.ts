interface ModalOptions {
  type?: 'info' | 'confirm' | 'warning' | 'error';
  confirmText?: string;
  cancelText?: string;
  showCancel?: boolean;
  onConfirm?: () => void;
  onCancel?: () => void;
}

type LegalDocumentType = 'terms' | 'privacy' | 'cookies';

export function showModal(title: string, content: string, options: ModalOptions = {}): void {
  const { 
    type = 'info',
    confirmText = 'OK',
    cancelText = 'Отмена',
    showCancel = false,
    onConfirm = null,
    onCancel = null
  } = options;

  if (showCancel) {
    const result = confirm(`${title}\n\n${content}`);
    if (result && onConfirm) {
      onConfirm();
    } else if (!result && onCancel) {
      onCancel();
    }
  } else {
    alert(`${title}\n\n${content}`);
    if (onConfirm) {
      onConfirm();
    }
  }
}

export function showInfoModal(title: string, message: string, onConfirm: (() => void) | null = null): void {
  showModal(title, message, {
    type: 'info',
    onConfirm
  });
}

export function showConfirmModal(
  title: string, 
  message: string, 
  onConfirm: (() => void) | null = null, 
  onCancel: (() => void) | null = null
): void {
  showModal(title, message, {
    type: 'confirm',
    showCancel: true,
    onConfirm,
    onCancel
  });
}

export function showFeatureStub(feature: string): void {
  showInfoModal(
    'Функция в разработке',
    `${feature} будет доступна в следующей версии приложения.`
  );
}

export function showLegalModal(type: LegalDocumentType): void {
  const titles: Record<LegalDocumentType, string> = {
    terms: 'Условия использования',
    privacy: 'Политика конфиденциальности',
    cookies: 'Использование cookies'
  };
  
  const title = titles[type] || 'Юридическая информация';
  showFeatureStub(title);
}