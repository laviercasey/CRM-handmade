export function isNotEmpty(value) {
    return !!value && value.trim() !== '';
  }

  export function minLength(value, minLength) {
    if (!value) return false;
    return value.length >= minLength;
  }
  
  export function maxLength(value, maxLength) {
    if (!value) return true; 
    return value.length <= maxLength;
  }

  export function isNumber(value) {
    if (value === null || value === undefined || value === '') return false;
    return !isNaN(Number(value));
  }

  export function isPositiveNumber(value) {
    return isNumber(value) && Number(value) > 0;
  }

  export function isNonNegativeNumber(value) {
    return isNumber(value) && Number(value) >= 0;
  }

  export function isInRange(value, min, max) {
    if (!isNumber(value)) return false;
    const num = Number(value);
    return num >= min && num <= max;
  }
  
  export function isValidEmail(value) {
    if (!value) return false;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
  }

  export function isValidTelegramUsername(value) {
    if (!value) return false;

    const username = value.startsWith('@') ? value.substring(1) : value;

    const telegramRegex = /^[a-zA-Z0-9_]{5,32}$/;
    return telegramRegex.test(username);
  }

  export function isValidPhoneNumber(value) {
    if (!value) return false;

    const cleanedValue = value.replace(/\D/g, '');

    return cleanedValue.length >= 10 && cleanedValue.length <= 15;
  }

  export function isStrongPassword(value) {
    if (!value) return false;

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    return passwordRegex.test(value);
  }
  
  export function passwordStrength(value) {
    if (!value) return 0;
    
    let score = 0;

    if (value.length >= 8) score += 20;
    if (value.length >= 12) score += 10;

    if (/[a-z]/.test(value)) score += 10;
    if (/[A-Z]/.test(value)) score += 20;
    if (/\d/.test(value)) score += 20;
    if (/[^a-zA-Z0-9]/.test(value)) score += 20;
    
    const uniqueChars = new Set(value).size;
    score += Math.min(uniqueChars, 10);
    
    return Math.min(score, 100);
  }

  export function valuesMatch(value1, value2) {
    return value1 === value2;
  }
  
  export function isValidUrl(value) {
    if (!value) return false;
    
    try {
      new URL(value);
      return true;
    } catch (e) {
      return false;
    }
  }

  export function isValidProductName(value) {
    return isNotEmpty(value) && minLength(value, 3) && maxLength(value, 100);
  }

  export function isValidPrice(value) {
    return isPositiveNumber(value);
  }
  
  export function isValidProductDescription(value) {
    return maxLength(value, 1000);
  }

  export function isImageFile(file) {
    if (!file) return false;
    return file.type.startsWith('image/');
  }
  
  export function isValidFileSize(file, maxSizeInBytes) {
    if (!file) return false;
    return file.size <= maxSizeInBytes;
  }
  
  export function validateRegistrationForm(formData) {
    const errors = {};
    
    if (!isNotEmpty(formData.username)) {
      errors.username = 'Логин обязателен';
    } else if (!minLength(formData.username, 3)) {
      errors.username = 'Логин должен содержать минимум 3 символа';
    } else if (!maxLength(formData.username, 50)) {
      errors.username = 'Логин не должен превышать 50 символов';
    }
    
    if (!isNotEmpty(formData.email)) {
      errors.email = 'Email обязателен';
    } else if (!isValidEmail(formData.email)) {
      errors.email = 'Введите корректный email';
    }
    
    if (!isNotEmpty(formData.password)) {
      errors.password = 'Пароль обязателен';
    } else if (!minLength(formData.password, 8)) {
      errors.password = 'Пароль должен содержать минимум 8 символов';
    } else if (!isStrongPassword(formData.password)) {
      errors.password = 'Пароль должен содержать заглавные и строчные буквы, а также цифры';
    }
    
    if (!valuesMatch(formData.password, formData.confirmPassword)) {
      errors.confirmPassword = 'Пароли не совпадают';
    }
    
    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }

  export function validateProductForm(formData) {
    const errors = {};
    
    if (!isValidProductName(formData.name)) {
      errors.name = 'Название товара должно содержать от 3 до 100 символов';
    }
    
    if (!isValidPrice(formData.price)) {
      errors.price = 'Цена должна быть положительным числом';
    }
    
    if (!isValidProductDescription(formData.description)) {
      errors.description = 'Описание не должно превышать 1000 символов';
    }
    
    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }

  export function validateRequestForm(formData) {
    const errors = {};
    
    if (!isNotEmpty(formData.service_name)) {
      errors.service_name = 'Название услуги обязательно';
    }
    
    if (!isValidPrice(formData.price)) {
      errors.price = 'Цена должна быть положительным числом';
    }
    
    if (!isNotEmpty(formData.contact_tg)) {
      errors.contact_tg = 'Telegram контакт обязателен';
    } else if (!isValidTelegramUsername(formData.contact_tg)) {
      errors.contact_tg = 'Введите корректный Telegram username';
    }
    
    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }
  