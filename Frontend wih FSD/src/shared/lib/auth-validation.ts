import { validateRequiredField, validateFieldLength, validateEmailField } from './validation';

interface LoginFormData {
  username: string;
  password: string;
}

interface RegisterFormData extends LoginFormData {
  email: string;
  confirmPassword: string;
}

interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

export function validateUsername(username: string): string | null {
  const requiredError = validateRequiredField(username, 'Логин');
  if (requiredError) return requiredError;
  
  const lengthError = validateFieldLength(username, 3, 50, 'Логин');
  if (lengthError) return lengthError;
  
  const usernameRegex = /^[a-zA-Z0-9_.-]+$/;
  if (!usernameRegex.test(username.trim())) {
    return 'Логин может содержать только буквы, цифры, точки, дефисы и подчеркивания';
  }
  
  return null;
}

export function validatePassword(password: string, isStrict: boolean = false): string | null {
  const requiredError = validateRequiredField(password, 'Пароль');
  if (requiredError) return requiredError;
  
  if (isStrict) {
    const lengthError = validateFieldLength(password, 8, 100, 'Пароль');
    if (lengthError) return lengthError;
    
    if (!/[A-Z]/.test(password)) {
      return 'Пароль должен содержать хотя бы одну заглавную букву';
    }
    
    if (!/[a-z]/.test(password)) {
      return 'Пароль должен содержать хотя бы одну строчную букву';
    }
    
    if (!/[0-9]/.test(password)) {
      return 'Пароль должен содержать хотя бы одну цифру';
    }
  } else {
    const lengthError = validateFieldLength(password, 1, 100, 'Пароль');
    if (lengthError) return lengthError;
  }
  
  return null;
}

export function validateAuthEmail(email: string): string | null {
  const requiredError = validateRequiredField(email, 'Email');
  if (requiredError) return requiredError;
  
  return validateEmailField(email);
}

export function validateLoginForm(formData: LoginFormData): ValidationResult {
  const errors: Record<string, string> = {};
  
  const usernameError = validateUsername(formData.username);
  if (usernameError) errors.username = usernameError;
  
  const passwordError = validatePassword(formData.password, false);
  if (passwordError) errors.password = passwordError;
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}

export function validateRegisterForm(formData: RegisterFormData): ValidationResult {
  const errors: Record<string, string> = {};
  
  const usernameError = validateUsername(formData.username);
  if (usernameError) errors.username = usernameError;
  
  const emailError = validateAuthEmail(formData.email);
  if (emailError) errors.email = emailError;
  
  const passwordError = validatePassword(formData.password, true);
  if (passwordError) errors.password = passwordError;
  
  if (formData.confirmPassword !== formData.password) {
    errors.confirmPassword = 'Пароли не совпадают';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}