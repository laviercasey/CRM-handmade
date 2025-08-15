<template>
  <div :class="$style.dashboard">
    <Sidebar :active-tab="activeTab" @change-tab="changeTab" />
    
    <div :class="$style.dashboardContent">
      <h1>{{ pageTitle }}</h1>
      
      <RequestList v-if="activeTab === 'requests'" />
      
      <ProductList v-if="activeTab === 'products'" />
      
      <Statistics v-if="activeTab === 'statistics'" />
      
      <ProfileSettings v-if="activeTab === 'profile'" />
      
      <Calculations v-if="activeTab === 'calculations'" />
    </div>
    
    <button 
      v-if="['requests', 'products'].includes(activeTab)" 
      :class="$style.addButton"
      @click="showAddModal"
    >
      <span>+</span>
    </button>

    <ProductCreateModal   
      v-if="showProductModal"
      @close="showProductModal = false"
      @created="handleProductCreated"
    />
    
    <RequestFormModal 
      v-if="showRequestModal"
      @close="showRequestModal = false"
      @created="handleRequestCreated"
    />  
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useStore } from 'vuex'
import Sidebar from '@/widgets/sidebar/'
import RequestList from '@/widgets/request-list/'
import ProductList from '@/widgets/product-list/'
import Statistics from '@/widgets/statistics/'
import ProfileSettings from '@/widgets/profile-settings/'
import ProductCreateModal from '@/features/products/ui/product-create-modal/'
import RequestFormModal from '@/features/requests/ui/request-form-modal/'
import Calculations from '@/widgets/calculations/'

const store = useStore()
const showProductModal = ref<boolean>(false)
const showRequestModal = ref<boolean>(false)

const activeTab = computed<string>(() => store.state.dashboard.activeTab)

const pageTitle = computed<string>(() => {
  const titles: Record<string, string> = {
    'requests': 'Заявки',
    'products': 'Товары',
    'statistics': 'Статистика',
    'calculations': 'Расчеты',
    'profile': 'Настройки профиля'
  }
  return titles[activeTab.value] || 'Личный кабинет'
})

function changeTab(tab: string): void {
  store.commit('dashboard/SET_ACTIVE_TAB', tab)
}

function showAddModal(): void {
  if (activeTab.value === 'products') {
    showProductModal.value = true
  } else if (activeTab.value === 'requests') {
    showRequestModal.value = true
  }
}

async function loadData(): Promise<void> {
  try {
    await store.dispatch('requests/fetchRequests')
    await store.dispatch('products/loadProducts')
  } catch (error) {
    console.error('Ошибка загрузки данных:', error)
  }
}

function handleProductCreated(): void {
  showProductModal.value = false
  store.dispatch('products/loadProducts')
}

function handleRequestCreated(): void {
  showRequestModal.value = false
  store.dispatch('requests/loadRequests')
}

onMounted(() => {
  loadData()
})
</script>

<style module src="./styles.module.scss" />