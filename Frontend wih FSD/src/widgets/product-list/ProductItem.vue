<template>
  <div :class="$style.productItem">
    <div :class="$style.productImage">
      <img 
        :src="productImage" 
        :alt="product.name"
      >
      <div :class="$style.imageOverlay">
        <button :class="[$style.overlayButton, $style.edit]" @click.stop="editProduct">
          <i class="fas fa-edit"></i>
        </button>
        <button :class="[$style.overlayButton, $style.delete]" @click.stop="confirmDelete">
          <i class="fas fa-trash"></i>
        </button>
      </div>
    </div>
    
    <div :class="$style.productInfo">
      <h3 :class="$style.productName">{{ product.name }}</h3>
      <p :class="$style.productPrice">{{ formatPrice(product.price) }} ₽</p>
      
      <div :class="$style.productDescriptionToggle" @click="toggleDescription">
        <span>Описание</span>
        <i :class="showDescription ? 'fas fa-chevron-up' : 'fas fa-chevron-down'"></i>
      </div>
      
      <div v-if="showDescription" :class="$style.productDescription">
        {{ product.description }}
      </div>
    </div>
    
    
    <div v-if="showDeleteConfirmation" :class="$style.modalOverlay" @click="showDeleteConfirmation = false">
      <div :class="$style.modalContent" @click.stop>
        <div :class="$style.modalHeader">
          <h3>Удаление товара</h3>
          <button :class="$style.closeButton" @click="showDeleteConfirmation = false">&times;</button>
        </div>
        <div :class="$style.modalBody">
          <p>Вы действительно хотите удалить товар "{{ product.name }}"?</p>
          <p>Это действие нельзя будет отменить.</p>
        </div>
        <div :class="$style.modalFooter">
          <button :class="$style.btnSecondary" @click="showDeleteConfirmation = false">Отмена</button>
          <button 
            :class="$style.btnDanger"
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

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useStore } from 'vuex';

interface Product {
  id: number | string;
  name: string;
  price: number;
  description: string;
  img_name: string;
}

interface ProductItemProps {
  product: Product;
}

interface Notification {
  type: 'showSuccess' | 'showError';
  title: string;
  text: string;
}

const props = defineProps<ProductItemProps>();
const store = useStore();

const showDescription = ref(false);
const showDeleteConfirmation = ref(false);
const isDeleting = ref(false);

const productImage = computed(() => {
  return `${import.meta.env.VITE_API_URL}/images/${props.product.img_name}`;
});

const emit = defineEmits<{
  (e: 'edit', product: Product): void;
}>();

function formatPrice(price: number): string {
  return new Intl.NumberFormat('ru-RU').format(price);
}

function toggleDescription(): void {
  showDescription.value = !showDescription.value;
}

function editProduct(): void {
  emit('edit', props.product);
}

function confirmDelete(): void {
  showDeleteConfirmation.value = true;
}

async function deleteProduct(): Promise<void> {
  isDeleting.value = true;
  
  try {
    await store.dispatch('products/deleteProduct', props.product.id);
    
    // Показываем уведомление об успешном удалении
    notify({
      type: 'showSuccess',
      title: 'Товар удален',
      text: `Товар "${props.product.name}" успешно удален`
    });
    
    showDeleteConfirmation.value = false;
  } catch (error) {
    console.error('Ошибка удаления товара:', error);
    
    notify({
      type: 'showError',
      title: 'Ошибка',
      text: 'Не удалось удалить товар'
    });
  } finally {
    isDeleting.value = false;
  }
}

function notify(notification: Notification): void {
  store.dispatch('notifications/' + notification.type, {
    title: notification.title,
    message: notification.text
  });
}
</script>

<style module lang="scss">
@use './styles.module.scss';
</style>