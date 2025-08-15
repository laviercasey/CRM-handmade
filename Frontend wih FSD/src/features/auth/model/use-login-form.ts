import { ref, reactive, computed } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import { validateLoginForm } from '@/shared/lib/auth-validation';
import { createLoginForm, isLoginFormFilled, prepareLoginData, clearLoginForm, LoginForm } from '@/entities/auth/model/login-form';

interface ValidationErrors {
  [key: string]: string;
}

export function useLoginForm() {
  const store = useStore();
  const router = useRouter();
  
  const formData = reactive<LoginForm>(createLoginForm());
  const errors = ref<ValidationErrors>({});
  const isLoading = ref<boolean>(false);
  const submitError = ref<string>('');
  
  const canSubmit = computed((): boolean => {
    return isLoginFormFilled(formData) && !isLoading.value && !hasErrors.value;
  });
  
  const hasErrors = computed((): boolean => {
    return Object.keys(errors.value).length > 0;
  });
  
  function validateField(fieldName: string): void {
    const validation = validateLoginForm(formData);
    
    if (validation.errors[fieldName]) {
      errors.value[fieldName] = validation.errors[fieldName];
    } else {
      delete errors.value[fieldName];
    }
  }
  
  function validateForm(): boolean {
    const validation = validateLoginForm(formData);
    errors.value = validation.errors;
    return validation.isValid;
  }
  
  function clearErrors(): void {
    errors.value = {};
    submitError.value = '';
  }
  
  function resetForm(): void {
    clearLoginForm(formData);
    clearErrors();
  }
  
  async function submitForm(): Promise<void> {
    if (isLoading.value) return;
    
    if (!validateForm()) {
      return;
    }
    
    isLoading.value = true;
    clearErrors();
    
    try {
      const loginData = prepareLoginData(formData);
      await store.dispatch('auth/login', loginData);
      
      router.push('/dashboard');
      
      if (store.dispatch) {
        store.dispatch('notifications/showSuccess', {
          title: 'Вход выполнен',
          message: 'Добро пожаловать!'
        });
      }
      
    } catch (error: any) {
      console.error('Login error:', error);
      
      if (error.response?.data?.detail) {
        submitError.value = error.response.data.detail;
      } else if (error.response?.data?.message) {
        submitError.value = error.response.data.message;
      } else if (error.message) {
        submitError.value = error.message;
      } else {
        submitError.value = 'Не удалось выполнить вход. Проверьте введенные данные.';
      }
      
      if (store.dispatch) {
        store.dispatch('notifications/showError', {
          title: 'Ошибка входа',
          message: submitError.value
        });
      }
    } finally {
      isLoading.value = false;
    }
  }
  
  return {
    formData,
    errors,
    isLoading,
    submitError,
    canSubmit,
    hasErrors,
    validateField,
    validateForm,
    clearErrors,
    resetForm,
    submitForm
  };
}