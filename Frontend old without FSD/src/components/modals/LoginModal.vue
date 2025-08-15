<template>
    <div class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h2>Вход в систему</h2>
          <button class="close-button" @click="closeModal">&times;</button>
        </div>
        
        <div class="modal-body">
          <form @submit.prevent="handleLogin">
            <div class="form-group">
              <label for="username">Логин</label>
              <input 
                type="text" 
                id="username" 
                v-model="loginForm.username"
                placeholder="Введите ваш логин"
                required
              >
            </div>
            
            <div class="form-group">
              <label for="password">Пароль</label>
              <input 
                type="password" 
                id="password" 
                v-model="loginForm.password"
                placeholder="Введите ваш пароль"
                required
              >
            </div>
            
            <div class="error-message" v-if="error">
              {{ error }}
            </div>
            
            <div class="form-actions">
              <button type="submit" class="btn-primary" :disabled="isLoading">
                {{ isLoading ? 'Вход...' : 'Войти' }}
              </button>
            </div>
          </form>
          
          <div class="additional-actions">
            <button class="text-button" @click="showForgotPassword">
              Забыли пароль?
            </button>
            <button class="text-button" @click="showRegister">
              Регистрация
            </button>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, reactive } from 'vue'
  import { useStore } from 'vuex'
  import { useRouter } from 'vue-router'
  
  const store = useStore()
  const router = useRouter()
  
  const loginForm = reactive({
    username: '',
    password: ''
  })
  const isLoading = ref(false)
  const error = ref(null)
  
  function closeModal() {
    store.commit('auth/SET_SHOW_LOGIN_MODAL', false)
  }
  
  function showRegister() {
    store.commit('auth/SET_SHOW_LOGIN_MODAL', false)
    store.commit('auth/SET_SHOW_REGISTER_MODAL', true)
  }
  
  function showForgotPassword() {
    alert('Функция восстановления пароля будет доступна в следующей версии')
  }
  
  async function handleLogin() {
    isLoading.value = true
    error.value = null
    
    try {
      await store.dispatch('auth/login', loginForm)
      router.push('/dashboard')
    } catch (err) {
      console.error('Ошибка входа:', err)
      
      if (err.response && err.response.data) {
        error.value = err.response.data.detail || 'Ошибка входа в систему'
      } else {
        error.value = 'Не удалось выполнить вход'
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
    max-width: 450px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  }
  
  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px;
    border-bottom: 1px solid #eee;
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
  
  .error-message {
    color: #dc3545;
    margin-bottom: 15px;
    font-size: 14px;
  }
  
  .form-actions {
    margin-top: 20px;
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
    display: flex;
    justify-content: space-between;
  }
  
  .text-button {
    background: none;
    border: none;
    color: #6c5ce7;
    cursor: pointer;
    padding: 0;
    font-size: 14px;
  }
  
  .text-button:hover {
    text-decoration: underline;
  }
  </style>
  