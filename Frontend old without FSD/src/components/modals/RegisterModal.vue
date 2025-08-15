<template>
    <div class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h2>Регистрация</h2>
          <button class="close-button" @click="closeModal" type="button">&times;</button>
        </div>
        
        <div class="modal-body">
          <form @submit.prevent="handleRegister">
            <div class="form-group">
              <label for="username">Логин</label>
              <input 
                type="text" 
                id="username" 
                v-model="registerForm.username"
                placeholder="Придумайте логин"
                required
                minlength="3"
                maxlength="50"
              >
              <div class="field-hint">От 3 до 50 символов, будет виден другим пользователям</div>
            </div>
            
            <div class="form-row">
              <div class="form-group">
                <label for="first_name">Имя</label>
                <input 
                  type="text" 
                  id="first_name" 
                  v-model="registerForm.first_name"
                  placeholder="Ваше имя"
                  required
                >
              </div>
              
              <div class="form-group">
                <label for="second_name">Фамилия</label>
                <input 
                  type="text" 
                  id="second_name" 
                  v-model="registerForm.second_name"
                  placeholder="Ваша фамилия"
                  required
                >
              </div>
            </div>
            
            <div class="form-group">
              <label for="email">Email</label>
              <input 
                type="email" 
                id="email" 
                v-model="registerForm.email"
                placeholder="Введите ваш email"
                required
              >
            </div>
            
            <div class="form-group">
              <label for="password">Пароль</label>
              <div class="password-input">
                <input 
                  :type="showPassword ? 'text' : 'password'" 
                  id="password" 
                  v-model="registerForm.password"
                  placeholder="Придумайте пароль"
                  required
                  minlength="8"
                >
                <button 
                  type="button"
                  class="toggle-password"
                  @click="showPassword = !showPassword"
                >
                  <i :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
                </button>
              </div>
              <div class="field-hint">Минимум 8 символов, включая буквы и цифры</div>
            </div>
            
            <div class="form-group">
              <label for="confirm_password">Подтверждение пароля</label>
              <input 
                :type="showPassword ? 'text' : 'password'" 
                id="confirm_password" 
                v-model="confirmPassword"
                placeholder="Повторите пароль"
                required
              >
            </div>
            
            
            <div class="form-group checkbox-group">
              <label class="checkbox-label">
                <input type="checkbox" v-model="agreeTerms" required>
                <span class="checkbox-text">
                  Я согласен с <a href="#" @click.prevent="showTerms">условиями использования</a> и <a href="#" @click.prevent="showPrivacy">политикой конфиденциальности</a>
                </span>
              </label>
            </div>
            
            <div v-if="error" class="error-message">
              {{ error }}
            </div>
            
            <div class="form-actions">
              <button type="submit" class="btn-primary" :disabled="isLoading || !formValid">
                {{ isLoading ? 'Регистрация...' : 'Зарегистрироваться' }}
              </button>
            </div>
          </form>
          
          <div class="additional-actions">
            <p>Уже есть аккаунт? <button class="text-button" @click="showLogin">Войти</button></p>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, reactive, computed } from 'vue'
  import { useStore } from 'vuex'
  
  const store = useStore()
  
  const registerForm = reactive({
    username: '',
    first_name: '',
    second_name: '',
    email: '',
    password: '',
    description: ''
  })
  const confirmPassword = ref('')
  const agreeTerms = ref(false)
  const showPassword = ref(false)
  const isLoading = ref(false)
  const error = ref(null)
  
  const formValid = computed(() => {
    return registerForm.password && 
           registerForm.password === confirmPassword.value &&
           registerForm.password.length >= 8 &&
           agreeTerms.value
  })
  
  function closeModal() {
    store.commit('auth/SET_SHOW_REGISTER_MODAL', false)
  }
  
  function showLogin() {
    store.commit('auth/SET_SHOW_REGISTER_MODAL', false)
    store.commit('auth/SET_SHOW_LOGIN_MODAL', true)
  }
  
  function showTerms() {
    alert('Условия использования будут доступны в следующей версии')
  }
  
  function showPrivacy() {
    alert('Политика конфиденциальности будет доступна в следующей версии')
  }
  
  async function handleRegister() {
    if (!formValid.value) {
      if (registerForm.password !== confirmPassword.value) {
        error.value = 'Пароли не совпадают'
      } else if (registerForm.password.length < 8) {
        error.value = 'Пароль должен содержать не менее 8 символов'
      } else if (!agreeTerms.value) {
        error.value = 'Необходимо согласиться с условиями использования'
      }
      return
    }
    
    error.value = null
    isLoading.value = true
    
    try {
      await store.dispatch('auth/register', registerForm)
      
      store.dispatch('notifications/showSuccess', {
        title: 'Регистрация успешна',
        text: 'Теперь вы можете войти в свой аккаунт'
      })
      
      closeModal()
      store.commit('auth/SET_SHOW_LOGIN_MODAL', true)
    } catch (error) {
      console.error('Ошибка регистрации:', error)
      
      if (error.response && error.response.data) {
        if (error.response.status === 400 && error.response.data.detail === 'Email already registered') {
          error.value = 'Этот email уже зарегистрирован'
        } else if (error.response.status === 400 && error.response.data.detail === 'Username already taken') {
          error.value = 'Этот логин уже занят'
        } else {
          error.value = error.response.data.detail || 'Ошибка регистрации'
        }
      } else {
        error.value = 'Не удалось выполнить регистрацию, проверьте подключение к интернету'
      }
    } finally {
      isLoading.value = false
    }
  }
  </script>
    
  <style scoped>
  .modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000; 
  }

  
  .modal-content {
    background-color: white;
    border-radius: 8px;
    width: 90%;
    max-width: 500px;
    max-height: 90vh;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
    overflow-y: auto;
    z-index: 1001; 
    position: relative; 
  }
  
  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px;
    border-bottom: 1px solid #eee;
    position: sticky;
    top: 0;
    background-color: white;
    z-index: 1;
  }
  
  .modal-header h2 {
    margin: 0;
    font-size: 1.5rem;
  }
  
  .close-button {
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    color: #666;
  }
  
  .modal-body {
    padding: 20px;
  }
  
  .form-group {
    margin-bottom: 20px;
  }
  
  .form-row {
    display: flex;
    gap: 20px;
    margin-bottom: 20px;
  }
  
  .form-row .form-group {
    flex: 1;
    margin-bottom: 0;
  }
  
  label {
    display: block;
    margin-bottom: 8px;
    font-weight: 500;
  }
  
  input {
    width: 100%;
    padding: 12px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 16px;
  }
  
  .field-hint {
    margin-top: 5px;
    font-size: 12px;
    color: #666;
  }
  
  .password-input {
    position: relative;
  }
  
  .toggle-password {
    position: absolute;
    right: 12px;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    color: #666;
    cursor: pointer;
  }
  
  .checkbox-group {
    margin-top: 30px;
  }
  
  .checkbox-label {
    display: flex;
    align-items: flex-start;
    cursor: pointer;
  }
  
  .checkbox-label input {
    width: auto;
    margin-right: 10px;
    margin-top: 3px;
  }
  
  .checkbox-text {
    font-weight: normal;
  }
  
  .checkbox-text a {
    color: #6c5ce7;
    text-decoration: none;
  }
  
  .checkbox-text a:hover {
    text-decoration: underline;
  }
  
  .error-message {
    color: #f44336;
    margin-bottom: 15px;
    font-size: 14px;
  }
  
  .form-actions {
    margin-top: 30px;
  }
  
  .btn-primary {
    width: 100%;
    background-color: #6c5ce7;
    color: white;
    border: none;
    padding: 12px;
    border-radius: 4px;
    font-size: 16px;
    cursor: pointer;
    transition: background-color 0.3s;
  }
  
  .btn-primary:hover {
    background-color: #5649c0;
  }
  
  .btn-primary:disabled {
    background-color: #a29bde;
    cursor: not-allowed;
  }
  
  .additional-actions {
    margin-top: 20px;
    text-align: center;
  }
  
  .text-button {
    background: none;
    border: none;
    color: #6c5ce7;
    cursor: pointer;
    padding: 0;
    font-size: inherit;
  }
  
  .text-button:hover {
    text-decoration: underline;
  }
  
  @media (max-width: 768px) {
    .form-row {
      flex-direction: column;
      gap: 0;
    }
    
    .form-row .form-group {
      margin-bottom: 20px;
    }
  }
  </style>
  