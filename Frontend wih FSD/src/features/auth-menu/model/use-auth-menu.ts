import { computed } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { showRegistrationModal } from '@/shared/utils/dom'

export function useAuthMenu() {
  const store = useStore()
  const router = useRouter()
  
  const isAuthenticated = computed(() => 
    store.getters['auth/isAuthenticated']
  )
  
  const user = computed(() => 
    store.getters['auth/user']
  )
  
  function showLoginModal() {
    store.commit('auth/SET_SHOW_LOGIN_MODAL', true)
  }
  
  function showRegisterModal() {
    showRegistrationModal(store, '/register')
  }
  
  function goToProfile() {
    router.push('/dashboard')
    // Устанавливаем активную вкладку профиля если есть dashboard модуль
    if (store.hasModule && store.hasModule('dashboard')) {
      store.commit('dashboard/SET_ACTIVE_TAB', 'profile')
    }
  }
  
  async function logout() {
    try {
      await store.dispatch('auth/logout')
      router.push('/')
      
      // Показываем уведомление если доступно
      if (store.dispatch) {
        store.dispatch('notifications/showSuccess', {
          title: 'Выход выполнен',
          message: 'Вы успешно вышли из системы'
        })
      }
    } catch (error) {
      console.error('Logout error:', error)
      
      if (store.dispatch) {
        store.dispatch('notifications/showError', {
          title: 'Ошибка',
          message: 'Не удалось выйти из системы'
        })
      }
    }
  }
  
  return {
    isAuthenticated,
    user,
    showLoginModal,
    showRegisterModal,
    goToProfile,
    logout
  }
}