<template>
    <div class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h2>{{ isEditing ? 'Редактирование товара' : 'Новый товар' }}</h2>
          <button class="close-button" @click="closeModal">&times;</button>
        </div>
        
        <div class="modal-body">
          <form @submit.prevent="saveProduct">
            <div class="form-group">
              <label for="product-name">Название товара</label>
              <input 
                type="text" 
                id="product-name" 
                v-model="productForm.name"
                placeholder="Введите название товара"
                required
              >
            </div>
            
            <div class="form-group">
              <label for="product-price">Цена (₽)</label>
              <input 
                type="number" 
                id="product-price" 
                v-model.number="productForm.price"
                placeholder="Введите цену"
                min="0"
                step="0.01"
                required
              >
            </div>
            
            <div class="form-group">
              <label for="product-description">Описание</label>
              <textarea 
                id="product-description" 
                v-model="productForm.description"
                placeholder="Опишите ваш товар"
                rows="4"
                required
              ></textarea>
            </div>
            
            <div class="form-group">
              <label>Изображение</label>
              <div class="image-upload-container">
                <div 
                  class="image-preview"
                  :class="{ 'has-image': imagePreview }"
                  @click="triggerFileInput"
                >
                  <img 
                    v-if="imagePreview" 
                    :src="imagePreview" 
                    alt="Предпросмотр"
                  >
                  <div v-else class="upload-placeholder">
                    <i class="fas fa-cloud-upload-alt"></i>
                    <span>Нажмите, чтобы загрузить изображение</span>
                  </div>
                </div>
                
                <input 
                  type="file"
                  ref="fileInput"
                  @change="handleFileChange"
                  accept="image/*"
                  style="display: none"
                >
                
                <div v-if="imagePreview" class="image-actions">
                  <button 
                    type="button"
                    class="btn-secondary"
                    @click="triggerFileInput"
                  >
                    Изменить
                  </button>
                  <button 
                    type="button"
                    class="btn-danger"
                    @click="removeImage"
                  >
                    Удалить
                  </button>
                </div>
              </div>
              
              <div v-if="imageError" class="error-message">
                {{ imageError }}
              </div>
            </div>
            
            <div v-if="formError" class="error-message">
              {{ formError }}
            </div>
            
            <div class="form-actions">
              <button type="button" class="btn-secondary" @click="closeModal">Отмена</button>
              <button 
                type="submit" 
                class="btn-primary"
                :disabled="isSubmitting"
              >
                {{ isSubmitting ? 'Сохранение...' : (isEditing ? 'Сохранить изменения' : 'Создать товар') }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, reactive, computed, onBeforeUnmount } from 'vue'
  import { useStore } from 'vuex'
  
  const props = defineProps({
    editProduct: {
      type: Object,
      default: null
    }
  })
  
  const emit = defineEmits(['close', 'product-saved'])
  const store = useStore()
  
  const productForm = reactive({
    name: '',
    price: '',
    description: '',
    img_name: 'default-product.jpg'
  })
  const imageFile = ref(null)
  const imagePreview = ref(null)
  const imageError = ref(null)
  const formError = ref(null)
  const isSubmitting = ref(false)
  const fileInput = ref(null)
  
  const isEditing = computed(() => !!props.editProduct)
  
  const API_URL = import.meta.env.VITE_API_URL

  if (isEditing.value) {
    Object.assign(productForm, { ...props.editProduct })
    
    if (productForm.img_name) {
      imagePreview.value = `${API_URL}/images/${productForm.img_name}`
    }
  }
  
  function closeModal() {
    emit('close')
  }
  
  function triggerFileInput() {
    fileInput.value.click()
  } 
  
  function handleFileChange(event) {
    const file = event.target.files[0]
    
    if (!file) return
    
    if (!file.type.match('image.*')) {
      imageError.value = 'Пожалуйста, выберите изображение'
      return
    }
    
    if (file.size > 5 * 1024 * 1024) {
      imageError.value = 'Размер изображения не должен превышать 5 МБ'
      return
    }
    
    imageError.value = null
    imageFile.value = file
    
    imagePreview.value = URL.createObjectURL(file)
  }
  
  function removeImage() {
    imageFile.value = null
    imagePreview.value = null
    productForm.img_name = ''
    
    if (fileInput.value) {
      fileInput.value.value = ''
    }
  }
  
  async function saveProduct() {
    if (!productForm.name.trim()) {
      formError.value = 'Название товара обязательно'
      return
    }
    
    if (!productForm.price || productForm.price <= 0) {
      formError.value = 'Укажите корректную цену'
      return
    }
    
    if (!productForm.description.trim()) {
      formError.value = 'Описание товара обязательно'
      return
    }
    
    formError.value = null
    isSubmitting.value = true
    
    try {
      if (imageFile.value) {
        const formData = new FormData()
        formData.append('file', imageFile.value)
        
        const response = await fetch(`${API_URL}/upload`, {
          method: 'POST',
          body: formData,
          headers: {
            'Authorization': `Bearer ${store.getters['auth/accessToken']}`
          }
        })
        
        if (!response.ok) {
          throw new Error('Не удалось загрузить изображение')
        }
        
        const data = await response.json()
        productForm.img_name = data.filename
      }
      
      if (isEditing.value) {
        await store.dispatch('products/updateProduct', productForm)
      } else {
        await store.dispatch('products/createProduct', productForm)
      }
      
      emit('product-saved')
      closeModal()
    } catch (error) {
      console.error('Ошибка сохранения товара:', error)
      formError.value = 'Не удалось сохранить товар. Пожалуйста, попробуйте снова.'
    } finally {
      isSubmitting.value = false
    }
  }
  
  onBeforeUnmount(() => {
    if (imagePreview.value && !imagePreview.value.startsWith('http')) {
      URL.revokeObjectURL(imagePreview.value)
    }
  })
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
    display: flex;
    flex-direction: column;
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
    overflow-y: auto;
    flex: 1;
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
  
  .image-upload-container {
    margin-top: 10px;
  }
  
  .image-preview {
    width: 100%;
    height: 200px;
    border: 2px dashed #ddd;
    border-radius: 4px;
    overflow: hidden;
    cursor: pointer;
    transition: border-color 0.3s;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .image-preview:hover {
    border-color: #6c5ce7;
  }
  
  .image-preview.has-image {
    border: none;
  }
  
  .image-preview img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
  
  .upload-placeholder {
    display: flex;
    flex-direction: column;
    align-items: center;
    color: #999;
  }
  
  .upload-placeholder i {
    font-size: 48px;
    margin-bottom: 10px;
  }
  
  .image-actions {
    display: flex;
    gap: 10px;
    margin-top: 10px;
  }
  
  .error-message {
    color: #f44336;
    margin-top: 5px;
    font-size: 14px;
  }
  
  .form-actions {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    margin-top: 30px;
  }
  
  .btn-primary, .btn-secondary, .btn-danger {
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
  
  .btn-danger {
    background-color: #f5f5f5;
    color: #f44336;
    border: 1px solid #f44336;
  }
  
  .btn-danger:hover {
    background-color: #ffebee;
  }
  </style>
  