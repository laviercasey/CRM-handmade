<template>
    <div class="modal-overlay" @click="closeModal">
      <div class="modal-content product-select-modal" @click.stop>
        <div class="modal-header">
          <h2>Выбор товара</h2>
          <button class="close-button" @click="closeModal">&times;</button>
        </div>
        
        <div class="modal-body">
          <div class="search-container">
            <input 
              type="text" 
              v-model="searchQuery" 
              placeholder="Поиск товара..."
              class="search-input"
            >
          </div>
          
          <div v-if="loading" class="loading-indicator">
            <div class="spinner"></div>
            <p>Загрузка товаров...</p>
          </div>
          
          <div v-else-if="filteredProducts.length === 0" class="empty-state">
            <p>Товары не найдены</p>
            <button class="btn-secondary" @click="$emit('create-product')">
              Создать новый товар
            </button>
          </div>
          
          <div v-else class="products-grid">
            <div 
              v-for="product in filteredProducts" 
              :key="product.id"
              :class="['product-card', { selected: isSelected(product.id) }]"
              @click="toggleProductSelection(product)"
            >
              <div class="product-image">
                <img 
                  :src="getProductImage(product.img_name)" 
                  :alt="product.name"
                  @error="handleImageError"
                >
              </div>
              <div class="product-info">
                <h3 class="product-name">{{ product.name }}</h3>
                <p class="product-price">{{ formatPrice(product.price) }} ₽</p>
              </div>
              <div class="selection-indicator">
                <i class="fas fa-check"></i>
              </div>
            </div>
          </div>
        </div>
        
        <div class="modal-footer">
          <button class="btn-secondary" @click="closeModal">Отмена</button>
          <button 
            class="btn-primary" 
            :disabled="selectedProducts.length === 0"
            @click="confirmSelection"
          >
            Выбрать ({{ selectedProducts.length }})
          </button>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed, onMounted } from 'vue'
  import { useStore } from 'vuex'
  
  const props = defineProps({
    preselectedProducts: {
      type: Array,
      default: () => []
    }
  })
  
  const emit = defineEmits(['close', 'products-selected', 'create-product'])
  const store = useStore()
  
  const searchQuery = ref('')
  const selectedProducts = ref([...props.preselectedProducts])
  const loading = ref(true)
  
  const products = computed(() => store.state.products.products)
  
  const filteredProducts = computed(() => {
    if (!searchQuery.value) {
      return products.value
    }
    
    const query = searchQuery.value.toLowerCase()
    return products.value.filter(product => 
      product.name.toLowerCase().includes(query) || 
      product.description.toLowerCase().includes(query)
    )
  })
  
  onMounted(() => {
    loadProducts()
  })
  
  async function loadProducts() {
    try {
      loading.value = true
      await store.dispatch('products/loadProducts')
    } catch (error) {
      console.error('Ошибка загрузки товаров:', error)
    } finally {
      loading.value = false
    }
  }
  
  function closeModal() {
    emit('close')
  }
  
  function isSelected(productId) {
    return selectedProducts.value.some(p => p.id === productId)
  }
  
  function toggleProductSelection(product) {
    if (isSelected(product.id)) {
      selectedProducts.value = selectedProducts.value.filter(p => p.id !== product.id)
    } else {
      selectedProducts.value.push(product)
    }
  }
  
  function confirmSelection() {
    emit('products-selected', selectedProducts.value)
    closeModal()
  }
  
  function formatPrice(price) {
    return new Intl.NumberFormat('ru-RU').format(price)
  }
  
  function getProductImage(imageName) {
    if (!imageName) {
      return '../assets/placeholder-image.png'
    }
    
    return `${import.meta.env.VITE_API_URL}/images/${imageName}` 
  }
  
  function handleImageError(e) {
    e.target.src = '@/assets/placeholder-image.png'
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
    max-width: 800px;
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
  
  .search-container {
    margin-bottom: 20px;
  }
  
  .search-input {
    width: 100%;
    padding: 12px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 16px;
  }
  
  .products-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 20px;
  }
  
  .product-card {
    border: 1px solid #eee;
    border-radius: 8px;
    overflow: hidden;
    cursor: pointer;
    transition: transform 0.2s, box-shadow 0.2s;
    position: relative;
  }
  
  .product-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  }
  
  .product-card.selected {
    border-color: #6c5ce7;
    box-shadow: 0 0 0 2px #6c5ce7;
  }
  
  .product-image {
    height: 150px;
    overflow: hidden;
  }
  
  .product-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  .product-info {
    padding: 15px;
  }
  
  .product-name {
    margin: 0 0 10px;
    font-size: 16px;
    font-weight: 500;
  }
  
  .product-price {
    margin: 0;
    font-weight: bold;
    color: #6c5ce7;
  }
  
  .selection-indicator {
    position: absolute;
    top: 10px;
    right: 10px;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background-color: #6c5ce7;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transition: opacity 0.2s;
  }
  
  .product-card.selected .selection-indicator {
    opacity: 1;
  }
  
  .modal-footer {
    padding: 15px 20px;
    border-top: 1px solid #eee;
    display: flex;
    justify-content: flex-end;
    gap: 10px;
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
  
  .loading-indicator, .empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 40px 0;
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
  </style>
  