    <template>
    <div class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h2>Создание заявки</h2>
          <button class="close-button" @click="closeModal">&times;</button>
        </div>
        
        <div class="modal-body">
          <form @submit.prevent="handleSubmit">
            <div class="form-group">
              <label for="service_name">Название услуги/товара</label>
              <input 
                type="text" 
                id="service_name" 
                v-model="requestForm.service_name"
                placeholder="Введите название услуги или товара"
                required
              >
            </div>
            
            <div class="form-group">
              <label for="price">Цена (₽)</label>
              <input 
                type="number" 
                id="price" 
                v-model.number="requestForm.price"
                placeholder="Введите цену"
                min="0"
                step="1"
                required
              >
            </div>
            
            <div class="form-group">
              <label>Выбор товара</label>
              <div 
                class="product-selector"
                @click="showProductSelector = true"
              >
                <div v-if="selectedProduct" class="selected-product">
                  <div class="product-image">
                    <img 
                      :src="getProductImage(selectedProduct.img_name)" 
                      :alt="selectedProduct.name"
                      @error="handleImageError"
                    >
                  </div>
                  <div class="product-details">
                    <div class="product-name">{{ selectedProduct.name }}</div>
                    <div class="product-price">{{ formatPrice(selectedProduct.price) }}</div>
                  </div>
                  <button 
                    type="button"
                    class="remove-product"
                    @click.stop="selectedProduct = null"
                  >
                    &times;
                  </button>
                </div>
                
                <div v-else class="no-product">
                  <i class="fas fa-box"></i>
                  <span>Нажмите, чтобы выбрать товар из каталога</span>
                </div>
              </div>
            </div>
            
            <div class="form-group">
              <label for="contact_tg">Telegram контакт</label>
              <div class="input-with-icon">
                <span class="input-icon">@</span>
                <input 
                  type="text" 
                  id="contact_tg" 
                  v-model="requestForm.contact_tg"
                  placeholder="username"
                  required
                  pattern="^[a-zA-Z0-9_]{5,32}$"
                >
              </div>
              <div class="field-hint">Введите username без символа @</div>
            </div>
            
            <div class="form-group">
              <label for="description">Описание</label>
              <textarea 
                id="description" 
                v-model="requestForm.description"
                placeholder="Детали заказа, пожелания клиента и другая важная информация"
                rows="4"
              ></textarea>
            </div>
            
            <div v-if="error" class="error-message">
              {{ error }}
            </div>
            
            <div class="form-actions">
              <button type="button" class="btn-secondary" @click="closeModal">Отмена</button>
              <button 
                type="submit" 
                class="btn-primary"
                :disabled="isSubmitting"
              >
                {{ isSubmitting ? 'Создание...' : 'Создать заявку' }}
              </button>
            </div>
          </form>
        </div>
      </div>
      
      
      <ProductSelectModal 
        v-if="showProductSelector"
        @close="showProductSelector = false"
        @products-selected="handleProductSelected"
      />
    </div>
  </template>
  
  <script setup>
  import { ref, reactive, computed } from 'vue'
  import { useStore } from 'vuex'
  import ProductSelectModal from '@/components/modals/ProductSelectModal.vue'
  
  const emit = defineEmits(['close', 'request-created'])
  const store = useStore()
  
  const requestForm = reactive({
    service_name: '',
    price: '',
    contact_tg: '',
    description: ''
  })
  const selectedProduct = ref(null)
  const showProductSelector = ref(false)
  const isSubmitting = ref(false)
  const error = ref(null)
  
  const products = computed(() => store.state.products.products)
  
  function closeModal() {
    emit('close')
  }
  
  function formatPrice(price) {
    return new Intl.NumberFormat('ru-RU').format(price) + ' ₽'
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
  
  function handleProductSelected(products) {
    if (products.length > 0) {
      selectedProduct.value = products[0] 
      
      requestForm.service_name = selectedProduct.value.name
      requestForm.price = selectedProduct.value.price
      requestForm.description = selectedProduct.value.description
    }
    
    showProductSelector.value = false
  }
  
  async function handleSubmit() {
    if (!requestForm.service_name.trim()) {
      error.value = 'Введите название услуги или товара'
      return
    }
    
    if (!requestForm.price || requestForm.price <= 0) {
      error.value = 'Введите корректную цену'
      return
    }
    
    if (!requestForm.contact_tg.trim()) {
      error.value = 'Введите Telegram контакт'
      return
    }
    
    error.value = null
    isSubmitting.value = true
    
    try {
      const formattedContact = requestForm.contact_tg.startsWith('@') 
        ? requestForm.contact_tg 
        : '@' + requestForm.contact_tg
      
      const requestData = {
        ...requestForm,
        contact_tg: formattedContact
      }
      
      await store.dispatch('requests/createRequest', requestData)
      
      store.dispatch('notifications/showSuccess', {
        title: 'Заявка создана',
        text: 'Заявка успешно создана и добавлена в список'
      })
      
      emit('request-created')
      closeModal()
    } catch (error) {
      console.error('Ошибка создания заявки:', error)
      
      error.value = 'Не удалось создать заявку. Пожалуйста, попробуйте снова.'
    } finally {
      isSubmitting.value = false
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
    max-width: 600px;
    max-height: 90vh;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
    overflow-y: auto;
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
  
  textarea {
    resize: vertical;
  }
  
  .field-hint {
    margin-top: 5px;
    font-size: 12px;
    color: #666;
  }
  
  .input-with-icon {
    position: relative;
  }
  
  .input-icon {
    position: absolute;
    left: 12px;
    top: 50%;
    transform: translateY(-50%);
    color: #666;
  }
  
  .input-with-icon input {
    padding-left: 30px;
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
  
  .no-product {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;
    color: #999;
  }
  
  .no-product i {
    font-size: 24px;
    margin-bottom: 10px;
  }
  
  .selected-product {
    display: flex;
    align-items: center;
    gap: 15px;
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
  
  .error-message {
    color: #f44336;
    margin-bottom: 15px;
    font-size: 14px;
  }
  
  .form-actions {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    margin-top: 20px;
  }
  
  .btn-primary, .btn-secondary {
    padding: 10px 20px;
    border-radius: 4px;
    font-size: 16px;
    cursor: pointer;
    transition: background-color 0.3s;
  }
  
  .btn-primary {
    background-color: #6c5ce7;
    color: white;
    border: none;
  }
  
  .btn-primary:hover {
    background-color: #5649c0;
  }
  
  .btn-primary:disabled {
    background-color: #a29bde;
    cursor: not-allowed;
  }
  
  .btn-secondary {
    background-color: #f5f5f5;
    color: #333;
    border: 1px solid #ddd;
  }
  
  .btn-secondary:hover {
    background-color: #e9e9e9;
  }
  </style>
  