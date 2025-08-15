<template>
  <div id="app" :class="{ 'mobile-menu-open': isMobileMenuOpen }">
    <AppHeader @toggle-mobile-menu="toggleMobileMenu" />
    
    <div class="mobile-menu" v-if="isMobileMenuOpen">
      <div class="mobile-menu-header">
        <div class="mobile-menu-title">Меню</div>
        <button class="mobile-menu-close" @click="isMobileMenuOpen = false">
          &times;
        </button>
      </div>
      <nav class="mobile-nav">
        <router-link to="/" class="mobile-nav-link" @click="isMobileMenuOpen = false">
          <i class="fas fa-info-circle"></i> О проекте
        </router-link>
        <router-link v-if="isAuthenticated" to="/dashboard" class="mobile-nav-link" @click="isMobileMenuOpen = false">
          <i class="fas fa-tachometer-alt"></i> Личный кабинет
        </router-link>
        <div v-if="isAuthenticated" class="mobile-dashboard-links">
          <router-link to="/dashboard" class="mobile-nav-link" @click="setActiveTab('requests')">
            <i class="fas fa-clipboard-list"></i> Заявки
          </router-link>
          <router-link to="/dashboard" class="mobile-nav-link" @click="setActiveTab('products')">
            <i class="fas fa-box"></i> Товары
          </router-link>
          <router-link to="/dashboard" class="mobile-nav-link" @click="setActiveTab('statistics')">
            <i class="fas fa-chart-bar"></i> Статистика
          </router-link>
          <router-link to="/dashboard" class="mobile-nav-link" @click="setActiveTab('calculations')">
            <i class="fas fa-calculator"></i> Расчеты
          </router-link>
          <router-link to="/dashboard" class="mobile-nav-link" @click="setActiveTab('profile')">
            <i class="fas fa-user-cog"></i> Профиль
          </router-link>
        </div>
        <template v-if="!isAuthenticated">
          <button class="mobile-nav-button" @click="showLogin">
            <i class="fas fa-sign-in-alt"></i> Войти
          </button>
          <button class="mobile-nav-button" @click="showRegister">
            <i class="fas fa-user-plus"></i> Регистрация
          </button>
        </template>
        <button v-else class="mobile-nav-button" @click="logoutUser">
          <i class="fas fa-sign-out-alt"></i> Выйти
        </button>
      </nav>
    </div>
    
    <main class="main-content">
      <router-view />
    </main>
    
    <AppFooter />
    
    <LoginModal v-if="showLoginModal" />
    <RegisterModal v-if="showRegisterModal" />
    
    <NotificationSystem />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import AppHeader from '@/components/common/AppHeader.vue'
import AppFooter from '@/components/common/AppFooter.vue'
import LoginModal from '@/components/modals/LoginModal.vue'
import RegisterModal from '@/components/modals/RegisterModal.vue'
import NotificationSystem from '@/components/common/NotificationSystem.vue'

const store = useStore()
const router = useRouter()
const isMobileMenuOpen = ref(false)

const isAuthenticated = computed(() => store.getters['auth/isAuthenticated'])
const showLoginModal = computed(() => store.getters['auth/showLoginModal'])
const showRegisterModal = computed(() => store.getters['auth/showRegisterModal'])

function toggleMobileMenu() {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
  
  document.body.style.overflow = isMobileMenuOpen.value ? 'hidden' : ''
}

function showLogin() {
  isMobileMenuOpen.value = false
  store.commit('auth/SET_SHOW_LOGIN_MODAL', true)
}

function showRegister() {
  isMobileMenuOpen.value = false
  store.commit('auth/SET_SHOW_REGISTER_MODAL', true)
}

function setActiveTab(tab) {
  store.commit('dashboard/SET_ACTIVE_TAB', tab)
  isMobileMenuOpen.value = false
}

async function logoutUser() {
  await store.dispatch('auth/logout')
  isMobileMenuOpen.value = false
  router.push('/')
}

onMounted(() => {
  console.log('Initial auth state:', {
    showLoginModal: showLoginModal.value,
    showRegisterModal: showRegisterModal.value,
    isAuthenticated: isAuthenticated.value
  })
})
</script>

<style>
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: 'Roboto', Arial, sans-serif;
  font-size: 16px;
  line-height: 1.6;
  color: #333;
  background-color: #f9f9f9;
}

a {
  text-decoration: none;
  color: inherit;
}

button {
  cursor: pointer;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.mobile-menu {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: white;
  z-index: 1000;
  padding: 20px;
  overflow-y: auto;
  display: none;
}

.mobile-menu-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.mobile-menu-title {
  font-size: 20px;
  font-weight: 500;
}

.mobile-menu-close {
  background: none;
  border: none;
  font-size: 24px;
  color: #666;
}

.mobile-nav {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.mobile-nav-link, .mobile-nav-button {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 15px;
  border-radius: 8px;
  transition: background-color 0.3s;
}

.mobile-nav-link {
  color: #333;
}

.mobile-nav-link:hover, .mobile-nav-link.router-link-active {
  background-color: #f5f5f5;
}

.mobile-nav-button {
  background-color: #6c5ce7;
  color: white;
  border: none;
  font-size: 16px;
}

.mobile-nav-button:hover {
  background-color: #5649c0;
}

.mobile-dashboard-links {
  margin-left: 15px;
  border-left: 2px solid #eee;
  padding-left: 15px;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.main-content {
  min-height: calc(100vh - 120px);
}

@media (max-width: 1024px) {
  .mobile-menu {
    display: block;
  }
  
  #app.mobile-menu-open .main-content,
  #app.mobile-menu-open .app-footer {
    display: none;
  }
}
</style>
