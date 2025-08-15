<template>
  <div class="dashboard">
    <Sidebar :active-tab="activeTab" @change-tab="changeTab" />
    
    <div class="dashboard-content">
      <h1>{{ pageTitle }}</h1>
      
      <RequestList v-if="activeTab === 'requests'" />
      
      <ProductList v-if="activeTab === 'products'" />
      
      <Statistics v-if="activeTab === 'statistics'" />
      
      <ProfileSettings v-if="activeTab === 'profile'" />
      
      <Calculations v-if="activeTab === 'calculations'" />
    </div>
    
    <button 
      v-if="['requests', 'products'].includes(activeTab)" 
      class="add-button"
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

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useStore } from 'vuex'
import Sidebar from '@/components/common/Sidebar.vue'
import RequestList from '@/components/dashboard/RequestList.vue'
import ProductList from '@/components/dashboard/ProductList.vue'
import Statistics from '@/components/dashboard/Statistics.vue'
import ProfileSettings from '@/components/dashboard/ProfileSettings.vue'
import ProductCreateModal from '@/components/modals/ProductCreateModal.vue'
import RequestFormModal from '@/components/modals/RequestFormModal.vue'
import Calculations from '@/components/dashboard/Calculations.vue'

const store = useStore()
const showProductModal = ref(false)
const showRequestModal = ref(false)

const activeTab = computed(() => store.state.dashboard.activeTab)

const pageTitle = computed(() => {
  const titles = {
    'requests': 'Заявки',
    'products': 'Товары',
    'statistics': 'Статистика',
    'calculations': 'Расчеты',
    'profile': 'Настройки профиля'
  }
  return titles[activeTab.value] || 'Личный кабинет'
})

function changeTab(tab) {
  store.commit('dashboard/SET_ACTIVE_TAB', tab)
}

function showAddModal() {
  if (activeTab.value === 'products') {
    showProductModal.value = true
  } else if (activeTab.value === 'requests') {
    showRequestModal.value = true
  }
}

async function loadData() {
  try {
    await store.dispatch('requests/fetchRequests')
    
    await store.dispatch('products/loadProducts')
  } catch (error) {
    console.error('Ошибка загрузки данных:', error)
  }
}

function handleProductCreated() {
  showProductModal.value = false
  store.dispatch('products/loadProducts')
}

function handleRequestCreated() {
  showRequestModal.value = false
  store.dispatch('requests/loadRequests')
}

onMounted(() => {
  loadData()
})
</script>

<style scoped>
.dashboard {
  display: flex;
  min-height: calc(100vh - 60px);
  position: relative;
}

.dashboard-content {
  flex: 1;
  padding: 30px;
  background-color: #f9f9f9;
}

.add-button {
  position: fixed;
  bottom: 30px;
  right: 30px;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: #6c5ce7;
  color: white;
  font-size: 24px;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  transition: transform 0.3s, background-color 0.3s;
}

.add-button:hover {
  transform: scale(1.1);
  background-color: #5649c0;
}

.coming-soon {
  text-align: center;
  padding: 60px 0;
  color: #666;
}

h1 {
  margin-bottom: 30px;
  font-size: 28px;
  color: #333;
}
</style>
