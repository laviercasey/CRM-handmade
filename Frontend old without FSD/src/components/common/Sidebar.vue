<template>
    <div class="sidebar">
      <div class="user-info">
        <img class="avatar"
              v-if="imagePreview" 
              :src="imagePreview" 
              alt="Аватар"
            >
            <div v-else class="avatar">
              {{ userInitials }}
            </div>
        <div class="user-name">{{ userName }}</div>
      </div>
      
      <nav class="sidebar-nav">
        <button 
          v-for="item in menuItems" 
          :key="item.id"
          :class="['nav-item', { active: activeTab === item.id }]"
          @click="changeTab(item.id)"
        >
          <i :class="item.icon"></i>
          {{ item.label }}
        </button>
      </nav>
      
      <div class="sidebar-footer">
        <button class="logout-button" @click="logout">
          <i class="fas fa-sign-out-alt"></i>
          Выйти
        </button>
      </div>
    </div>
  </template>
  
  <script setup>
import { ref, computed, watchEffect } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

const props = defineProps({
  activeTab: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['change-tab'])

const store = useStore()
const router = useRouter()
const user = computed(() => store.getters['auth/user'])
const imagePreview = ref(null);
const userName = computed(() => {
  return user.value ? `${user.value.first_name} ${user.value.second_name}` : 'Пользователь'
})

const userInitials = computed(() => {
  if (!user.value.first_name && !user.value.second_name) {
      return '?'; 
    }
  
    const firstInitial = user.value.first_name ? user.value.first_name.charAt(0) : ''
    const secondInitial = user.value.second_name ? user.value.second_name.charAt(0) : ''
    return `${firstInitial}${secondInitial}`
  
})

const menuItems = computed(() => [
  { id: 'requests', label: 'Заявки', icon: 'fas fa-clipboard-list' },
  { id: 'products', label: 'Товары', icon: 'fas fa-box' },
  { id: 'statistics', label: 'Статистика', icon: 'fas fa-chart-bar' },
  { id: 'calculations', label: 'Расчеты', icon: 'fas fa-calculator' },
  { id: 'profile', label: 'Профиль', icon: 'fas fa-user-cog' }
])

function changeTab(tabId) {
  emit('change-tab', tabId)
}

function logout() {
  store.dispatch('auth/logout')
  router.push('/')
}

watchEffect(() => {
  if (user.value.avatar) {
        imagePreview.value = `${import.meta.env.VITE_API_URL}/uploads/avatars/${user.value.avatar}`;
      } 
})
</script>
                  
  <style scoped>
  .sidebar {
    width: 250px;
    background-color: #fff;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;
    height: 100%;
  }
  
  .user-info {
    padding: 20px;
    text-align: center;
    border-bottom: 1px solid #eee;
  }
  
  .avatar {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    background-color: #6c5ce7;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
    margin: 0 auto 10px;
  }
  
  .user-name {
    font-weight: 500;
  }
  
  .sidebar-nav {
    flex: 1;
    padding: 20px 0;
  }
  
  .nav-item {
    display: block;
    width: 100%;
    text-align: left;
    padding: 15px 20px;
    border: none;
    background: none;
    cursor: pointer;
    transition: background-color 0.3s;
    color: #333;
  }
  
  .nav-item:hover {
    background-color: #f5f5f5;
  }
  
  .nav-item.active {
    background-color: #f0f0f0;
    border-left: 3px solid #6c5ce7;
    color: #6c5ce7;
  }
  
  .nav-item i {
    margin-right: 10px;
    width: 20px;
    text-align: center;
  }
  
  .sidebar-footer {
    padding: 20px;
    border-top: 1px solid #eee;
  }
  
  .logout-button {
    display: block;
    width: 100%;
    padding: 10px;
    border: none;
    background-color: #f5f5f5;
    cursor: pointer;
    border-radius: 4px;
    transition: background-color 0.3s;
  }
  
  .logout-button:hover {
    background-color: #e9e9e9;
  }

  @media screen and (width < 1024px) {
    .sidebar {
      display: none;
    }
  }
  </style>
  