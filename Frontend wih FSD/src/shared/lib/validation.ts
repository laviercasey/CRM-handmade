export function isEmpty(value: any): boolean {
  if (value === null || value === undefined) return true;
  if (typeof value === 'string') return value.trim().length === 0;
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === 'object') return Object.keys(value).length === 0;
  return false;
}

export function isMinLength(value: string, minLength: number): boolean {
  if (typeof value !== 'string') return false;
  return value.trim().length >= minLength;
}

export function isMaxLength(value: string, maxLength: number): boolean {
  if (typeof value !== 'string') return false;
  return value.trim().length <= maxLength;
}

export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validateRequiredField(value: any, fieldName: string = 'Поле'): string | null {
  if (isEmpty(value)) {
    return `${fieldName} обязательно для заполнения`;
  }
  return null;
}

export function validateFieldLength(
  value: string, 
  min: number = 0, 
  max: number = Infinity, 
  fieldName: string = 'Поле'
): string | null {
  if (isEmpty(value)) return null;
  
  const length = value.trim().length;
  
  if (length < min) {
    return `${fieldName} должно содержать минимум ${min} символов`;
  }
  
  if (length > max) {
    return `${fieldName} должно содержать максимум ${max} символов`;
  }
  
  return null;
}

export function validateEmailField(email: string): string | null {
  if (isEmpty(email)) return null;
  
  if (!isValidEmail(email)) {
    return 'Введите корректный email адрес';
  }
  
  return null;
}