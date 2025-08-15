<template>
  <div class="product-list">
      <div class="list-header">
        <div class="search-filter">
          <div class="search-input-wrapper">
            <i class="fas fa-search"></i>
            <input 
              type="text" 
              v-model="searchQuery" 
              placeholder="Поиск товаров..."
              class="search-input"
            >
            <button 
              v-if="searchQuery" 
              class="clear-search"
              @click="searchQuery = ''"
            >
              &times;
            </button>
          </div>
        </div>
        
        <div class="sort-filter">
          <div class="sort-label">Сортировка:</div>
          <div class="sort-options">
            <button 
              :class="['sort-option', { active: sortBy === 'name' }]"
              @click="setSortBy('name')"
            >
              По названию
              <i 
                v-if="sortBy === 'name'" 
                :class="['fas', sortOrder === 'asc' ? 'fa-sort-alpha-down' : 'fa-sort-alpha-up']"
              ></i>
            </button>
            <button 
              :class="['sort-option', { active: sortBy === 'price' }]"
              @click="setSortBy('price')"
            >
              По цене
              <i 
                v-if="sortBy === 'price'" 
                :class="['fas', sortOrder === 'asc' ? 'fa-sort-numeric-down' : 'fa-sort-numeric-up']"
              ></i>
            </button>
            <button 
              :class="['sort-option', { active: sortBy === 'date' }]"
              @click="setSortBy('date')"
            >
              По дате
              <i 
                v-if="sortBy === 'date'" 
                :class="['fas', sortOrder === 'asc' ? 'fa-sort-amount-down' : 'fa-sort-amount-up']"
              ></i>
            </button>
          </div>
        </div>
      </div>
      
      <div v-if="loading" class="loading-state">
        <div class="spinner"></div>
        <p>Загрузка товаров...</p>
      </div>
      
      <div v-else-if="filteredProducts.length === 0" class="empty-state">
        <div v-if="searchQuery" class="no-results">
          <i class="fas fa-search"></i>
          <h3>Товары не найдены</h3>
          <p>Попробуйте изменить поисковый запрос или сбросить фильтры</p>
          <button class="btn-secondary" @click="resetFilters">Сбросить фильтры</button>
        </div>
        
        <div v-else class="no-products">
          <i class="fas fa-box-open"></i>
          <h3>У вас пока нет товаров</h3>
          <p>Добавьте свой первый товар, нажав кнопку "+" внизу экрана</p>
        </div>
      </div>
      
      <div v-else class="products-grid">
        <ProductItem 
          v-for="product in filteredProducts" 
          :key="product.id"
          :product="product"
          @edit="editProduct"
        />
      </div>
      
      
      <ProductCreateModal 
        v-if="showProductModal"
        :edit-product="selectedProduct"
        @close="closeProductModal"
        @product-saved="handleProductSaved"
      />
    </div>
</template>
  
  <script setup>
  import { ref, computed, onMounted, watch } from 'vue';
  import { useStore } from 'vuex';
  import ProductItem from '@/components/dashboard/ProductItem.vue';
  import ProductCreateModal from '@/components/modals/ProductCreateModal.vue';
  
  const store = useStore();
  
  const searchQuery = ref('');
  const sortBy = ref('name');
  const sortOrder = ref('asc');
  const showProductModal = ref(false);
  const selectedProduct = ref(null);
  
  const products = computed(() => store.state.products.products);
  const loading = computed(() => store.state.products.loading);
  
  const filteredProducts = computed(() => {
    if (!searchQuery.value) {
      return sortProducts(products.value);
    }
    
    const query = searchQuery.value.toLowerCase();
    const filtered = products.value.filter(product => 
      product.name.toLowerCase().includes(query) || 
      (product.description && product.description.toLowerCase().includes(query))
    );
    
    return sortProducts(filtered);
  });
  
  onMounted(() => {
    loadProducts();
  });
  
  function loadProducts() {
    store.dispatch('products/loadProducts');
  }
  
  function sortProducts(productsList) {
    return [...productsList].sort((a, b) => {
      let comparison = 0;
      
      if (sortBy.value === 'name') {
        comparison = a.name.localeCompare(b.name);
      } else if (sortBy.value === 'price') {
        comparison = a.price - b.price;
      } else if (sortBy.value === 'date') {
        comparison = new Date(a.created_at || 0) - new Date(b.created_at || 0);
      }
      
      return sortOrder.value === 'asc' ? comparison : -comparison;
    });
  }
  
  function setSortBy(field) {
    if (sortBy.value === field) {
      sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc';
    } else {
      sortBy.value = field;
      sortOrder.value = 'asc';
    }
    
    store.dispatch('dashboard/setProductFilter', { key: 'sortBy', value: sortBy.value });
    store.dispatch('dashboard/setProductFilter', { key: 'sortOrder', value: sortOrder.value });
  }
  
  function resetFilters() {
    searchQuery.value = '';
    sortBy.value = 'name';
    sortOrder.value = 'asc';
    
    store.dispatch('dashboard/resetFilters', 'products');
  }
  
  function editProduct(product) {
    selectedProduct.value = product;
    showProductModal.value = true;
  }
  
  function closeProductModal() {
    showProductModal.value = false;
    selectedProduct.value = null;
  }
  
  function handleProductSaved() {
    showProductModal.value = false;
    selectedProduct.value = null;
    
    loadProducts();
    
    store.dispatch('notifications/showSuccess', {
      title: 'Товар сохранен',
      text: 'Товар успешно сохранен в каталоге'
    });
  }
  
  // Watchers
  watch(searchQuery, (newValue) => {
    store.dispatch('dashboard/setProductFilter', { key: 'searchQuery', value: newValue });
  });
  </script>
    
    /* ProductList.vue */
    <style scoped>
    .product-list {
      padding-bottom: 30px;
    }
    
    .list-header {
      margin-bottom: 20px;
      display: flex;
      flex-wrap: wrap;
      gap: 20px;
      background-color: #fff;
      border-radius: 8px;
      padding: 20px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    }
    
    .search-filter {
      flex: 1;
      min-width: 250px;
    }
    
    .search-input-wrapper {
      position: relative;
    }
    
    .search-input-wrapper i {
      position: absolute;
      left: 15px;
      top: 50%;
      transform: translateY(-50%);
      color: #666;
    }
    
    .search-input {
      width: 100%;
      padding: 12px 40px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 16px;
    }
    
    .clear-search {
      position: absolute;
      right: 15px;
      top: 50%;
      transform: translateY(-50%);
      background: none;
      border: none;
      font-size: 18px;
      color: #666;
      cursor: pointer;
    }
    
    .sort-filter {
      display: flex;
      align-items: center;
      gap: 15px;
      flex-wrap: wrap;
    }
    
    .sort-label {
      color: #666;
      white-space: nowrap;
    }
    
    .sort-options {
      display: flex;
      gap: 10px;
      flex-wrap: wrap;
    }
    
    .sort-option {
      background-color: #f5f5f5;
      border: 1px solid #ddd;
      border-radius: 4px;
      padding: 8px 12px;
      font-size: 14px;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 8px;
      transition: all 0.3s;
      white-space: nowrap;
    }
    
    .sort-option:hover {
      background-color: #e9e9e9;
    }
    
    .sort-option.active {
      background-color: #6c5ce7;
      color: white;
      border-color: #6c5ce7;
    }
    
    .loading-state, .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 60px 0;
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
    
    .no-results i, .no-products i {
      font-size: 48px;
      color: #ddd;
      margin-bottom: 15px;
    }
    
    .no-results h3, .no-products h3 {
      margin-bottom: 10px;
      color: #333;
    }
    
    .no-results p, .no-products p {
      color: #666;
      margin-bottom: 20px;
      padding: 0 20px;
    }
    
    .products-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      gap: 20px;
    }
    
    .btn-secondary {
      background-color: #f5f5f5;
      color: #333;
      border: 1px solid #ddd;
      padding: 10px 20px;
      border-radius: 4px;
      font-size: 14px;
      cursor: pointer;
      transition: background-color 0.3s;
    }
    
    .btn-secondary:hover {
      background-color: #e9e9e9;
    }
    
    @media (max-width: 992px) {
      .products-grid {
        grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
      }
    }
    
    @media (max-width: 768px) {
      .list-header {
        flex-direction: column;
        gap: 15px;
        padding: 15px;
      }
      
      .sort-filter {
        flex-direction: column;
        align-items: flex-start;
        gap: 10px;
        width: 100%;
      }
      
      .sort-options {
        width: 100%;
        overflow-x: auto;
        padding-bottom: 5px;
        flex-wrap: nowrap;
      }
      
      .sort-option {
        white-space: nowrap;
        flex-shrink: 0;
      }
      
      .products-grid {
        grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
        gap: 15px;
      }
    }
    
    @media (max-width: 576px) {
      .products-grid {
        grid-template-columns: 1fr 1fr;
        gap: 10px;
      }
      
      .search-input {
        padding: 10px 40px;
        font-size: 14px;
      }
      
      .no-results h3, .no-products h3 {
        font-size: 18px;
      }
      
      .no-results p, .no-products p {
        font-size: 14px;
      }
    }
    
    @media (max-width: 480px) {
      .products-grid {
        grid-template-columns: 1fr;
      }
      
      .sort-options {
        justify-content: space-between;
      }
      
      .sort-option {
        flex: 1;
        text-align: center;
        padding: 8px 5px;
        font-size: 12px;
        gap: 4px;
      }
    }
  </style>
      