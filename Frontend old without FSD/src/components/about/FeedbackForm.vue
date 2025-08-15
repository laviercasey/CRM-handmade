<template>
  <section class="feedback-section">
    <div class="container">
      <h2>Обратная связь</h2>
      <p>Помогите нам стать лучше! Оставьте свой отзыв о проекте.</p>
      
      <form @submit.prevent="submitFeedback" class="feedback-form">
        <div class="form-group" v-if="!isAuthenticated">
          <label for="name">Ваше имя</label>
          <input 
            type="text" 
            id="name" 
            v-model="feedbackForm.name" 
            placeholder="Представьтесь, пожалуйста"
            required
          >
        </div>
        
        <div class="form-group">
          <label for="message">Сообщение</label>
          <textarea 
            id="message" 
            v-model="feedbackForm.message" 
            placeholder="Ваш отзыв или пожелания"
            rows="4"
            required
          ></textarea>
        </div>
        
        <div class="form-actions">
          <button type="submit" class="btn-primary" :disabled="submitting">
            {{ submitting ? 'Отправка...' : 'Отправить отзыв' }}
          </button>
        </div>
      </form>
      
      <div v-if="showSuccess" class="success-message">
        Спасибо за ваш отзыв! Он поможет нам сделать проект лучше.
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useStore } from 'vuex'

const store = useStore()

const feedbackForm = reactive({
  name: '',
  message: ''
})

const submitting = ref(false)
const showSuccess = ref(false)

const isAuthenticated = computed(() => store.getters['auth/isAuthenticated'])

async function submitFeedback() {
  submitting.value = true
  
  try {
    await store.dispatch('feedback/createFeedback', {
      message: feedbackForm.message
    })
    
    feedbackForm.message = ''
    showSuccess.value = true
    
    setTimeout(() => {
      showSuccess.value = false
    }, 5000)
  } catch (error) {
    console.error('Ошибка при отправке отзыва:', error)
  } finally {
    submitting.value = false
  }
}
</script>

  <style scoped>
  .feedback-section {
    padding: 60px 0;
    background-color: #f9f7f4;
  }
  
  .feedback-form {
    max-width: 600px;
    margin: 30px auto;
  }
  
  .form-group {
    margin-bottom: 20px;
  }
  
  label {
    display: block;
    margin-bottom: 8px;
    font-weight: 500;
  }
  
  input, textarea {
    width: 100%;
    padding: 12px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 16px;
  }
  
  .btn-primary {
    background-color: #6c5ce7;
    color: white;
    border: none;
    padding: 12px 24px;
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
  
  .success-message {
    background-color: #d4edda;
    color: #155724;
    padding: 15px;
    border-radius: 4px;
    text-align: center;
    margin-top: 20px;
  }
  </style>
  