interface LoginFormField {
  label: string
  type: string
  placeholder: string
  required: boolean
  autocomplete: string
}

interface LoginFormConfig {
  fields: {
    username: LoginFormField
    password: LoginFormField
  }
  submitButton: {
    text: string
    loadingText: string
  }
  validation: {
    validateOnBlur: boolean
    validateOnChange: boolean
  }
}

interface LoginForm {
  username: string
  password: string
}

interface PreparedLoginData {
  username: string
  password: string
}

/**
 * Конфигурация формы входа
 */
export const LOGIN_FORM_CONFIG: LoginFormConfig = {
  fields: {
    username: {
      label: 'Логин',
      type: 'text',
      placeholder: 'Введите ваш логин',
      required: true,
      autocomplete: 'username'
    },
    password: {
      label: 'Пароль',
      type: 'password',
      placeholder: 'Введите ваш пароль',
      required: true,
      autocomplete: 'current-password'
    }
  },
  
  submitButton: {
    text: 'Войти',
    loadingText: 'Вход...'
  },
  
  validation: {
    validateOnBlur: true,
    validateOnChange: false
  }
}

/**
 * Создает пустую форму входа
 * @returns объект формы входа
 */
export function createLoginForm(): LoginForm {
  return {
    username: '',
    password: ''
  }
}

/**
 * Очищает форму входа
 * @param form - форма для очистки
 */
export function clearLoginForm(form: LoginForm): void {
  form.username = ''
  form.password = ''
}

/**
 * Проверяет, заполнена ли форма входа
 * @param form - форма для проверки
 * @returns true если форма заполнена
 */
export function isLoginFormFilled(form: LoginForm): boolean {
  return Boolean(form.username?.trim() && form.password?.trim())
}

/**
 * Подготавливает данные формы для отправки на сервер
 * @param form - данные формы
 * @returns подготовленные данные
 */
export function prepareLoginData(form: LoginForm): PreparedLoginData {
  return {
    username: form.username.trim(),
    password: form.password
  }
}