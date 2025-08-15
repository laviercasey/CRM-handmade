<template>
    <header class="app-header">
      <div class="container">
        <div class="header-logo">
          <router-link to="/">ТвойCRM</router-link>
        </div>
        
        <nav class="header-nav desktop-nav">
          <router-link to="/" class="nav-link">О проекте</router-link>
          <router-link v-if="isAuthenticated" to="/dashboard" class="nav-link">Личный кабинет</router-link>
        </nav>
        
        <div class="header-auth desktop-auth">
          <template v-if="isAuthenticated">
            <div class="user-dropdown">
              <button class="dropdown-toggle">
                <img class="user-avatar"
                  v-if="imagePreview" 
                  :src="imagePreview" 
                  alt="Аватар"
                >
                <span v-else class="user-avatar">{{ userInitials }}</span>
                <span class="user-name">{{ userName }}</span>
                <i class="fas fa-chevron-down"></i>
              </button>
              
              <div class="dropdown-menu">
                <router-link to="/dashboard" class="dropdown-item">
                  <i class="fas fa-tachometer-alt"></i> Панель управления
                </router-link>
                <button 
                  class="dropdown-item"
                  @click="goToProfile"
                >
                  <i class="fas fa-user-cog"></i> Настройки профиля
                </button>
                <button 
                  class="dropdown-item"
                  @click="logout"
                >
                  <i class="fas fa-sign-out-alt"></i> Выйти
                </button>
              </div>
            </div>
          </template>
          
          <template v-else>
            <button class="btn-login" @click="showLoginModal">Войти</button>
            <button class="btn-register" @click="showRegisterModal">Регистрация</button>
          </template>
        </div>
        
        <button class="mobile-menu-toggle" @click="$emit('toggle-mobile-menu')">
          <i class="fas fa-bars"></i>
        </button>
      </div>
    </header>
  </template>
  
  <script setup>
import { ref, computed, watchEffect } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

const store = useStore()
const router = useRouter()

const isAuthenticated = computed(() => store.getters['auth/isAuthenticated'])
const user = computed(() => store.getters['auth/user'])
const imagePreview = ref(null);
const userName = computed(() => {
  return user.value ? user.value.first_name : 'Пользователь'
})

const userInitials = computed(() => {
  if (!user.value) return '?'
  
  const firstInitial = user.value.first_name ? user.value.first_name.charAt(0) : ''
  const secondInitial = user.value.second_name ? user.value.second_name.charAt(0) : ''
  
  return `${firstInitial}${secondInitial}`
})

function showLoginModal() {
  store.commit('auth/SET_SHOW_LOGIN_MODAL', true)
}

function showRegisterModal() {
  store.commit('auth/SET_SHOW_REGISTER_MODAL', true)
}

function goToProfile() {
  router.push('/dashboard')
  store.commit('dashboard/SET_ACTIVE_TAB', 'profile')
}

function logout() {
  store.dispatch('auth/logout')
  router.push('/')
}

watchEffect(() => {
  if (user.value){
    if (user.value.avatar) {
        imagePreview.value = `${import.meta.env.VITE_API_URL}/uploads/avatars/${user.value.avatar}`;
      }}
})
defineEmits(['toggle-mobile-menu'])
</script>

  <style scoped>
  .app-header {
    background-color: #fff;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    padding: 15px 0;
    position: sticky;
    top: 0;
    z-index: 100;
  }
  
  .container {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  
  .header-logo a {
    font-size: 24px;
    font-weight: bold;
    color: #6c5ce7;
  }
  
  .header-nav {
    display: flex;
    gap: 20px;
  }
  
  .nav-link {
    color: #333;
    transition: color 0.3s;
  }
  
  .nav-link:hover, .nav-link.router-link-active {
    color: #6c5ce7;
  }
  
  .header-auth {
    display: flex;
    gap: 15px;
    align-items: center;
  }
  
  .btn-login, .btn-register {
    padding: 8px 16px;
    border-radius: 4px;
    font-size: 14px;
    cursor: pointer;
    transition: all 0.3s;
  }
  
  .btn-login {
    background-color: transparent;
    border: 1px solid #6c5ce7;
    color: #6c5ce7;
  }
  
  .btn-login:hover {
    background-color: #f5f3ff;
  }
  
  .btn-register {
    background-color: #6c5ce7;
    border: none;
    color: white;
  }
  
  .btn-register:hover {
    background-color: #5649c0;
  }
  
  .user-dropdown {
    position: relative;
  }
  
  .dropdown-toggle {
    display: flex;
    align-items: center;
    gap: 10px;
    background: none;
    border: none;
    cursor: pointer;
    padding: 8px;
    border-radius: 4px;
    transition: background-color 0.3s;
  }
  
  .dropdown-toggle:hover {
    background-color: rgba(0, 0, 0, 0.05);
  }
  
  .user-avatar {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background-color: #6c5ce7;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    font-weight: bold;
  }
  
  .dropdown-menu {
    position: absolute;
    right: 0;
    top: 100%;
    width: 200px;
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    padding: 8px 0;
    z-index: 100;
    display: none;
  }
  
  .user-dropdown:hover .dropdown-menu {
    display: block;
  }
  
  .dropdown-item {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 16px;
    color: #333;
    text-decoration: none;
    transition: background-color 0.3s;
    cursor: pointer;
    border: none;
    background: none;
    width: 100%;
    text-align: left;
  }
  
  .dropdown-item:hover {
    background-color: #f5f5f5;
  }
  
  .dropdown-item i {
    width: 16px;
  }
  
  .mobile-menu-toggle {
    display: none;
    background: none;
    border: none;
    font-size: 24px;
    color: #333;
  }
  
  @media (max-width: 1024px) {
    .desktop-nav, .desktop-auth {
      display: none;
    }
    
    .mobile-menu-toggle {
      display: block;
    }
  }
  </style>
    