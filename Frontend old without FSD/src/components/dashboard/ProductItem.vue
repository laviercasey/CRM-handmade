<template>
  <div class="product-item">
    <div class="product-image">
      <img 
        :src="productImage" 
        :alt="product.name"
      >
      <div class="image-overlay">
        <button class="overlay-button edit" @click.stop="editProduct">
          <i class="fas fa-edit"></i>
        </button>
        <button class="overlay-button delete" @click.stop="confirmDelete">
          <i class="fas fa-trash"></i>
        </button>
      </div>
    </div>
    
    <div class="product-info">
      <h3 class="product-name">{{ product.name }}</h3>
      <p class="product-price">{{ formatPrice(product.price) }} ₽</p>
      
      <div class="product-description-toggle" @click="toggleDescription">
        <span>Описание</span>
        <i :class="showDescription ? 'fas fa-chevron-up' : 'fas fa-chevron-down'"></i>
      </div>
      
      <div v-if="showDescription" class="product-description">
        {{ product.description }}
      </div>
    </div>
    
    
    <div v-if="showDeleteConfirmation" class="modal-overlay" @click="showDeleteConfirmation = false">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>Удаление товара</h3>
          <button class="close-button" @click="showDeleteConfirmation = false">&times;</button>
        </div>
        <div class="modal-body">
          <p>Вы действительно хотите удалить товар "{{ product.name }}"?</p>
          <p>Это действие нельзя будет отменить.</p>
        </div>
        <div class="modal-footer">
          <button class="btn-secondary" @click="showDeleteConfirmation = false">Отмена</button>
          <button 
            class="btn-danger"
            :disabled="isDeleting"
            @click="deleteProduct"
          >
            {{ isDeleting ? 'Удаление...' : 'Удалить' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ProductItem',
  
  props: {
    product: {
      type: Object,
      required: true
    }
  },
  
  data() {
    return {
      showDescription: false,
      showDeleteConfirmation: false,
      isDeleting: false
    }
  },
  
  computed: {
    productImage() {
      console.log(this.product.img_name)
      return `${import.meta.env.VITE_API_URL}/images/${this.product.img_name}`
    }
  },
  
  methods: {
    formatPrice(price) {
      return new Intl.NumberFormat('ru-RU').format(price)
    },
    
    toggleDescription() {
      this.showDescription = !this.showDescription
    },
    
    editProduct() {
      this.$emit('edit', this.product)
    },
    
    confirmDelete() {
      this.showDeleteConfirmation = true
    },
    
    async deleteProduct() {
      this.isDeleting = true
      
      try {
        await this.$store.dispatch('products/deleteProduct', this.product.id)
        
        this.$notify({
          type: 'showSuccess',
          title: 'Товар удален',
          text: `Товар "${this.product.name}" успешно удален`
        })
        
        this.showDeleteConfirmation = false
      } catch (error) {
        console.error('Ошибка удаления товара:', error)
        
        this.$notify({
          type: 'showError',
          title: 'Ошибка',
          text: 'Не удалось удалить товар'
        })
      } finally {
        this.isDeleting = false
      }
    }
  }
}
</script>

<style scoped>
.product-item {
  background-color: #fff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: transform 0.2s, box-shadow 0.2s;
  position: relative;
}

.product-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.product-image {
  height: 200px;
  overflow: hidden;
  position: relative;
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s;
}

.product-item:hover .product-image img {
  transform: scale(1.05);
}

.image-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15px;
  opacity: 0;
  transition: opacity 0.3s;
}

.product-item:hover .image-overlay {
  opacity: 1;
}

.overlay-button {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s;
}

.overlay-button.edit {
  background-color: #fff;
  color: #6c5ce7;
}

.overlay-button.edit:hover {
  background-color: #6c5ce7;
  color: white;
}

.overlay-button.delete {
  background-color: #fff;
  color: #f44336;
}

.overlay-button.delete:hover {
  background-color: #f44336;
  color: white;
}

.product-info {
  padding: 15px;
}

.product-name {
  margin: 0 0 10px;
  font-size: 18px;
  font-weight: 500;
}

.product-price {
  font-weight: bold;
  color: #6c5ce7;
  margin: 0 0 15px;
}

.product-description-toggle {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  cursor: pointer;
  border-top: 1px solid #eee;
  color: #666;
  font-size: 14px;
}

.product-description {
  margin-top: 10px;
  padding-top: 10px;
  border-top: 1px dashed #eee;
  font-size: 14px;
  line-height: 1.5;
  color: #666;
}

/* Модальное окно подтверждения удаления */
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
  max-width: 400px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  border-bottom: 1px solid #eee;
}

.modal-header h3 {
  margin: 0;
  font-size: 18px;
  color: #f44336;
}

.close-button {
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: #666;
}

.modal-body {
  padding: 20px;
}

.modal-footer {
  padding: 15px 20px;
  border-top: 1px solid #eee;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.btn-secondary, .btn-danger {
  padding: 8px 16px;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.3s;
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
  background-color: #f44336;
  color: white;
  border: none;
}

.btn-danger:hover {
  background-color: #e53935;
}

.btn-danger:disabled {
  background-color: #ffcdd2;
  cursor: not-allowed;
}
</style>
