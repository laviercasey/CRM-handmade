<template>
  <div class="request-form-page">
    <div class="container">
      <div v-if="loading" class="loading-state">
        <div class="spinner"></div>
        <p>Загрузка формы...</p>
      </div>
      
      <div v-else-if="error" class="error-state">
        <div class="error-icon">
          <i class="fas fa-exclamation-circle"></i>
        </div>
        <h2>Ошибка загрузки формы</h2>
        <p>{{ error }}</p>
        <button class="btn-primary" @click="fetchFormData">Попробовать снова</button>
      </div>
      
      <div v-else class="form-container">
        <div class="artisan-info">
          <div class="artisan-header">
            <h1>{{ formData.username }}</h1>
            <p class="artisan-name">{{ formData.first_name }} {{ formData.second_name }}</p>
          </div>
          
          <div class="artisan-description">
            <p>{{ formData.description || 'Описание отсутствует' }}</p>
          </div>
        </div>
        
        <form @submit.prevent="submitRequest" class="request-form">
          <h2>Оформление заказа</h2>
          
          <div class="form-group">
            <label for="name">Ваше имя</label>
            <input 
              type="text" 
              id="name" 
              v-model="requestForm.name"
              placeholder="Как к вам обращаться"
              required
            >
          </div>
          
          <div class="form-group">
            <label>Выберите товар</label>
            <div 
              class="product-selector"
              @click="showProductSelector = true"
            >
              <div v-if="selectedProducts.length === 0" class="no-products">
                <i class="fas fa-shopping-cart"></i>
                <span>Нажмите, чтобы выбрать товар</span>
              </div>
              
              <div v-else class="selected-products">
                <div 
                  v-for="product in selectedProducts" 
                  :key="product.id"
                  class="selected-product"
                >
                  <div class="product-image">
                    <img 
                      :src="getProductImage(product.img_name)" 
                      :alt="product.name"
                      @error="handleImageError"
                    >
                  </div>
                  <div class="product-details">
                    <div class="product-name">{{ product.name }}</div>
                    <div class="product-price">{{ formatPrice(product.price) }} ₽</div>
                  </div>
                  <button 
                    type="button"
                    class="remove-product"
                    @click.stop="removeProduct(product.id)"
                  >
                    &times;
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          <div class="form-group">
            <label for="description">Пожелания или комментарии</label>
            <textarea 
              id="description" 
              v-model="requestForm.description"
              placeholder="Опишите ваши пожелания, детали заказа или задайте вопросы"
              rows="4"
            ></textarea>
          </div>
          
          <div class="form-group">
            <label>Контактные данные</label>
            <div class="contact-tabs">
              <button 
                type="button"
                :class="['contact-tab', { active: activeContactTab === 'telegram' }]"
                @click="activeContactTab = 'telegram'"
              >
                <i class="fab fa-telegram"></i> Telegram
              </button>
              <button 
                type="button"
                :class="['contact-tab', { active: activeContactTab === 'email' }]"
                @click="activeContactTab = 'email'"
              >
                <i class="fas fa-envelope"></i> Email
              </button>
              <button 
                type="button"
                :class="['contact-tab', { active: activeContactTab === 'instagram' }]"
                @click="activeContactTab = 'instagram'"
              >
                <i class="fab fa-instagram"></i> Instagram
              </button>
            </div>
            
            <div class="contact-input">
              <input 
                v-if="activeContactTab === 'telegram'"
                type="text" 
                v-model="requestForm.contact_tg"
                placeholder="Ваш username в Telegram (например, @username)"
                required
              >
              <input 
                v-else-if="activeContactTab === 'email'"
                type="email" 
                v-model="requestForm.contact_email"
                placeholder="Ваш email адрес"
                required
              >
              <input 
                v-else-if="activeContactTab === 'instagram'"
                type="text" 
                v-model="requestForm.contact_instagram"
                placeholder="Ваш username в Instagram (без @)"
                required
              >
            </div>
          </div>
          
          <div v-if="formError" class="form-error">
            {{ formError }}
          </div>
          
          <div class="form-total">
            <div class="total-label">Итого:</div>
            <div class="total-price">{{ calculateTotal() }} ₽</div>
          </div>
          
          <div class="form-actions">
            <button 
              type="submit" 
              class="btn-primary"
              :disabled="isSubmitting || selectedProducts.length === 0"
            >
              {{ isSubmitting ? 'Отправка...' : 'Отправить заявку' }}
            </button>
          </div>
        </form>
      </div>
    </div>
    
    <ProductSelectModal 
      v-if="showProductSelector"
      :preselected-products="selectedProducts"
      @close="showProductSelector = false"
      @products-selected="handleProductsSelected"
    />
    
    <div v-if="showSuccessModal" class="modal-overlay" @click="closeSuccessModal">
      <div class="modal-content success-modal" @click.stop>
        <div class="success-icon">
          <i class="fas fa-check-circle"></i>
        </div>
        <h2>Заявка успешно отправлена!</h2>
        <p>Мастер свяжется с вами в ближайшее время для уточнения деталей.</p>
        <button class="btn-primary" @click="closeSuccessModal">Закрыть</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import ProductSelectModal from '@/components/modals/ProductSelectModal.vue'
import requestService from '@/services/request.service'
import productService from '@/services/product.service'

const route = useRoute()

const loading = ref(true)
const error = ref(null)
const formData = ref({})
const products = ref([])
const selectedProducts = ref([])
const showProductSelector = ref(false)
const activeContactTab = ref('telegram')
const formError = ref(null)
const isSubmitting = ref(false)
const showSuccessModal = ref(false)

const requestForm = reactive({
  name: '',
  description: '',
  contact_tg: '',
  contact_email: '',
  contact_instagram: ''
})

const username = computed(() => route.params.username)

async function fetchFormData() {
  try {
    loading.value = true
    error.value = null
    
    const response = await fetch(`${import.meta.env.VITE_API_URL}/requests/forms/${username.value}`)
    if (!response.ok) {
      throw new Error('Форма не найдена')
    }
    
    formData.value = await response.json()
    
    const productsResponse = await productService.getProducts(formData.value.user_id)
    products.value = productsResponse
  } catch (err) {
    console.error('Ошибка загрузки формы:', err)
    error.value = 'Не удалось загрузить форму. Пожалуйста, проверьте адрес или попробуйте позже.'
  } finally {
    loading.value = false
  }
}

function handleProductsSelected(products) {
  selectedProducts.value = products
  showProductSelector.value = false
}

function removeProduct(productId) {
  selectedProducts.value = selectedProducts.value.filter(p => p.id !== productId)
}

function calculateTotal() {
  const total = selectedProducts.value.reduce((sum, product) => sum + product.price, 0)
  return new Intl.NumberFormat('ru-RU').format(total)
}

function formatPrice(price) {
  return new Intl.NumberFormat('ru-RU').format(price)
}

function getProductImage(imageName) {
  if (!imageName) {
    return '@/assets/placeholder-image.png'
  }
  
  return `${import.meta.env.VITE_API_URL}/images/${imageName}`
}

function handleImageError(e) {
  e.target.src = '@/assets/placeholder-image.png'
}

function getAdditionalContacts() {
  const contacts = []
  
  if (activeContactTab.value === 'email' && requestForm.contact_email) {
    contacts.push(`Email: ${requestForm.contact_email}`)
  } else if (activeContactTab.value === 'instagram' && requestForm.contact_instagram) {
    contacts.push(`Instagram: @${requestForm.contact_instagram}`)
  }
  
  return contacts.join('\n')
}

async function submitRequest() {
  if (selectedProducts.value.length === 0) {
    formError.value = 'Пожалуйста, выберите хотя бы один товар'
    return
  }
  
  formError.value = null
  isSubmitting.value = true
  
  try {
    const requestData = {
      service_name: selectedProducts.value.map(p => p.name).join(', '),
      price: selectedProducts.value.reduce((sum, product) => sum + product.price, 0),
      description: requestForm.description,
      contact_tg: activeContactTab.value === 'telegram' ? requestForm.contact_tg : '',
      additional_contacts: getAdditionalContacts()
    }

    await requestService.submitFormRequest(username.value, requestData)

    showSuccessModal.value = true

    resetForm()
  } catch (err) {
    console.error('Ошибка отправки заявки:', err)
    formError.value = 'Не удалось отправить заявку. Пожалуйста, попробуйте позже.'
  } finally {
    isSubmitting.value = false
  }
}

function resetForm() {
  selectedProducts.value = []
  Object.assign(requestForm, {
    name: '',
    description: '',
    contact_tg: '',
    contact_email: '',
    contact_instagram: ''
  })
}

function closeSuccessModal() {
  showSuccessModal.value = false
}

onMounted(() => {
  fetchFormData()
})
</script>

<style scoped>
.request-form-page {
  background-color: #f9f7f4;
  min-height: 100vh;
  padding: 40px 0;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.loading-state, .error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 100px 0;
  text-align: center;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid rgba(108, 92, 231, 0.2);
  border-radius: 50%;
  border-top-color: #6c5ce7;
  animation: spin 1s linear infinite;
  margin-bottom: 15px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error-icon {
  font-size: 48px;
  color: #f44336;
  margin-bottom: 15px;
}

.form-container {
  display: flex;
  flex-direction: column;
  gap: 30px;
  max-width: 800px;
  margin: 0 auto;
}

.artisan-info {
  background-color: #fff;
  border-radius: 8px;
  padding: 30px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.artisan-header {
  margin-bottom: 20px;
}

.artisan-header h1 {
  margin: 0 0 5px;
  font-size: 24px;
  color: #333;
}

.artisan-name {
  color: #666;
  margin: 0;
}

.artisan-description {
  color: #555;
  line-height: 1.6;
}

.request-form {
  background-color: #fff;
  border-radius: 8px;
  padding: 30px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.request-form h2 {
  margin-top: 0;
  margin-bottom: 30px;
  color: #333;
  font-size: 22px;
}

.form-group {
  margin-bottom: 25px;
}

label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #555;
}

input, textarea {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
}

textarea {
  resize: vertical;
}

.product-selector {
  border: 1px dashed #ddd;
  border-radius: 4px;
  padding: 15px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.product-selector:hover {
  background-color: #f9f9f9;
}

.no-products {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  color: #999;
}

.no-products i {
  font-size: 24px;
  margin-bottom: 10px;
}

.selected-products {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.selected-product {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 10px;
  background-color: #f9f9f9;
  border-radius: 4px;
}

.product-image {
  width: 60px;
  height: 60px;
  border-radius: 4px;
  overflow: hidden;
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.product-details {
  flex: 1;
}

.product-name {
  font-weight: 500;
  margin-bottom: 5px;
}

.product-price {
  color: #6c5ce7;
  font-weight: bold;
}

.remove-product {
  background: none;
  border: none;
  font-size: 18px;
  color: #999;
  cursor: pointer;
}

.contact-tabs {
  display: flex;
  gap: 10px;
  margin-bottom: 15px;
}

.contact-tab {
  flex: 1;
  padding: 10px;
  border: 1px solid #ddd;
  background-color: #f5f5f5;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s;
}

.contact-tab.active {
  background-color: #6c5ce7;
  color: white;
  border-color: #6c5ce7;
}

.form-error {
  color: #f44336;
  margin-bottom: 15px;
  font-size: 14px;
}

.form-total {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 0;
  border-top: 1px solid #eee;
  margin-top: 20px;
  margin-bottom: 20px;
}

.total-label {
  font-weight: 500;
  font-size: 18px;
}

.total-price {
  font-weight: bold;
  font-size: 24px;
  color: #6c5ce7;
}

.form-actions {
  text-align: right;
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
  padding: 30px;
  width: 90%;
  max-width: 450px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  text-align: center;
}

.success-icon {
  font-size: 48px;
  color: #4caf50;
  margin-bottom: 20px;
}

.success-modal h2 {
  margin-top: 0;
  color: #333;
}

.success-modal p {
  margin-bottom: 30px;
  color: #666;
}

@media (max-width: 768px) {
  .request-form-page {
    padding: 20px 0;
  }
  
  .artisan-info, .request-form {
    padding: 20px;
  }
  
  .contact-tabs {
    flex-direction: column;
  }
}
</style>
  