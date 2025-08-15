<template>
  <div :class="$style.requestFormPage">
    <div :class="$style.container">
      <div v-if="loading" :class="$style.loadingState">
        <div :class="$style.spinner"></div>
        <p>Загрузка формы...</p>
      </div>
      
      <div v-else-if="error" :class="$style.errorState">
        <div :class="$style.errorIcon">
          <i class="fas fa-exclamation-circle"></i>
        </div>
        <h2>Ошибка загрузки формы</h2>
        <p>{{ error }}</p>
        <button :class="$style.btnPrimary" @click="fetchFormData">Попробовать снова</button>
      </div>
      
      <div v-else :class="$style.formContainer">
        <div :class="$style.artisanInfo">
          <div :class="$style.artisanHeader">
            <h1>{{ formData.username }}</h1>
            <p :class="$style.artisanName">{{ formData.first_name }} {{ formData.second_name }}</p>
          </div>
          
          <div :class="$style.artisanDescription">
            <p>{{ formData.description || 'Описание отсутствует' }}</p>
          </div>
        </div>
        
        <form @submit.prevent="submitRequest" :class="$style.requestForm">
          <h2>Оформление заказа</h2>
          
          <div :class="$style.formGroup">
            <label for="name">Ваше имя</label>
            <input 
              type="text" 
              id="name" 
              v-model="requestForm.name"
              placeholder="Как к вам обращаться"
              required
            >
          </div>
          
          <div :class="$style.formGroup">
            <label>Выберите товар</label>
            <div 
              :class="$style.productSelector"
              @click="showProductSelector = true"
            >
              <div v-if="selectedProducts.length === 0" :class="$style.noProducts">
                <i class="fas fa-shopping-cart"></i>
                <span>Нажмите, чтобы выбрать товар</span>
              </div>
              
              <div v-else :class="$style.selectedProducts">
                <div 
                  v-for="product in selectedProducts" 
                  :key="product.id"
                  :class="$style.selectedProduct"
                >
                  <div :class="$style.productImage">
                    <img 
                      :src="getProductImage(product.img_name)" 
                      :alt="product.name"
                      @error="handleImageError"
                    >
                  </div>
                  <div :class="$style.productDetails">
                    <div :class="$style.productName">{{ product.name }}</div>
                    <div :class="$style.productPrice">{{ formatPrice(product.price) }} ₽</div>
                  </div>
                  <button 
                    type="button"
                    :class="$style.removeProduct"
                    @click.stop="removeProduct(product.id)"
                  >
                    &times;
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          <div :class="$style.formGroup">
            <label for="description">Пожелания или комментарии</label>
            <textarea 
              id="description" 
              v-model="requestForm.description"
              placeholder="Опишите ваши пожелания, детали заказа или задайте вопросы"
              rows="4"
            ></textarea>
          </div>
          
          <div :class="$style.formGroup">
            <label>Контактные данные</label>
            <div :class="$style.contactTabs">
              <button 
                type="button"
                :class="[$style.contactTab, { [$style.active]: activeContactTab === 'telegram' }]"
                @click="activeContactTab = 'telegram'"
              >
                <i class="fab fa-telegram"></i> Telegram
              </button>
              <button 
                type="button"
                :class="[$style.contactTab, { [$style.active]: activeContactTab === 'email' }]"
                @click="activeContactTab = 'email'"
              >
                <i class="fas fa-envelope"></i> Email
              </button>
              <button 
                type="button"
                :class="[$style.contactTab, { [$style.active]: activeContactTab === 'instagram' }]"
                @click="activeContactTab = 'instagram'"
              >
                <i class="fab fa-instagram"></i> Instagram
              </button>
            </div>
            
            <div :class="$style.contactInput">
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
          
          <div v-if="formError" :class="$style.formError">
            {{ formError }}
          </div>
          
          <div :class="$style.formTotal">
            <div :class="$style.totalLabel">Итого:</div>
            <div :class="$style.totalPrice">{{ calculateTotal() }} ₽</div>
          </div>
          
          <div :class="$style.formActions">
            <button 
              type="submit" 
              :class="$style.btnPrimary"
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
    
    <div v-if="showSuccessModal" :class="$style.modalOverlay" @click="closeSuccessModal">
      <div :class="[$style.modalContent, $style.successModal]" @click.stop>
        <div :class="$style.successIcon">
          <i class="fas fa-check-circle"></i>
        </div>
        <h2>Заявка успешно отправлена!</h2>
        <p>Мастер свяжется с вами в ближайшее время для уточнения деталей.</p>
        <button :class="$style.btnPrimary" @click="closeSuccessModal">Закрыть</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import ProductSelectModal from '@/features/products/ui/product-select-modal/'
import requestService from '@/shared/api/request.service'
import productService from '@/shared/api/product.service'

interface Product {
  id: number
  name: string
  price: number
  img_name?: string
}

interface FormData {
  username: string
  first_name: string
  second_name: string
  description?: string
  user_id: number
}

interface RequestForm {
  name: string
  description: string
  contact_tg: string
  contact_email: string
  contact_instagram: string
}

const route = useRoute()

const loading = ref<boolean>(true)
const error = ref<string | null>(null)
const formData = ref<FormData>({} as FormData)
const products = ref<Product[]>([])
const selectedProducts = ref<Product[]>([])
const showProductSelector = ref<boolean>(false)
const activeContactTab = ref<string>('telegram')
const formError = ref<string | null>(null)
const isSubmitting = ref<boolean>(false)
const showSuccessModal = ref<boolean>(false)

const requestForm = reactive<RequestForm>({
  name: '',
  description: '',
  contact_tg: '',
  contact_email: '',
  contact_instagram: ''
})

const username = computed<string>(() => route.params.username as string)

async function fetchFormData(): Promise<void> {
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

function handleProductsSelected(products: Product[]): void {
  selectedProducts.value = products
  showProductSelector.value = false
}

function removeProduct(productId: number): void {
  selectedProducts.value = selectedProducts.value.filter(p => p.id !== productId)
}

function calculateTotal(): string {
  const total = selectedProducts.value.reduce((sum, product) => sum + product.price, 0)
  return new Intl.NumberFormat('ru-RU').format(total)
}

function formatPrice(price: number): string {
  return new Intl.NumberFormat('ru-RU').format(price)
}

function getProductImage(imageName?: string): string {
  if (!imageName) {
    return '@/assets/placeholder-image.png'
  }
  
  return `${import.meta.env.VITE_API_URL}/images/${imageName}`
}

function handleImageError(e: Event): void {
  const target = e.target as HTMLImageElement
  target.src = '@/assets/placeholder-image.png'
}

function getAdditionalContacts(): string {
  const contacts = []
  
  if (activeContactTab.value === 'email' && requestForm.contact_email) {
    contacts.push(`Email: ${requestForm.contact_email}`)
  } else if (activeContactTab.value === 'instagram' && requestForm.contact_instagram) {
    contacts.push(`Instagram: @${requestForm.contact_instagram}`)
  }
  
  return contacts.join('\n')
}

async function submitRequest(): Promise<void> {
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

function resetForm(): void {
  selectedProducts.value = []
  Object.assign(requestForm, {
    name: '',
    description: '',
    contact_tg: '',
    contact_email: '',
    contact_instagram: ''
  })
}

function closeSuccessModal(): void {
  showSuccessModal.value = false
}

onMounted(() => {
  fetchFormData()
})
</script>

<style module src="./styles.module.scss" />