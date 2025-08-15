import authService from '@/services/auth.service'

export default {
  namespaced: true,
  
  state: {
    accessToken: localStorage.getItem('accessToken') || null,
    refreshToken: localStorage.getItem('refreshToken') || null,
    user: JSON.parse(localStorage.getItem('user')) || null,
    showLoginModal: false,
    showRegisterModal: false,
  },
  
  getters: {
    isAuthenticated: state => !!state.accessToken,
    accessToken: state => state.accessToken,
    refreshToken: state => state.refreshToken,
    user: state => state.user,
    showLoginModal: state => state.showLoginModal,
    showRegisterModal: state => state.showRegisterModal
  },
  
  mutations: {
    SET_ACCESS_TOKEN(state, token) {
      state.accessToken = token
      localStorage.setItem('accessToken', token)
    },
    SET_REFRESH_TOKEN(state, token) {
      state.refreshToken = token
      localStorage.setItem('refreshToken', token)
    },
    SET_USER(state, user) {
      state.user = user
      localStorage.setItem('user', JSON.stringify(user))
    },
    SET_SHOW_LOGIN_MODAL(state, show) {
      state.showLoginModal = show
    },
    SET_SHOW_REGISTER_MODAL(state, value) {
      state.showRegisterModal = value
      console.log('SET_SHOW_REGISTER_MODAL:', value)
      if (!value) {
        setTimeout(() => {
          const overlay = document.querySelector('.modal-overlay')
          if (overlay) overlay.style.display = 'none'
        }, 0)
      }
    },
    CLEAR_AUTH(state) {
      state.accessToken = null
      state.refreshToken = null
      state.user = null
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
      localStorage.removeItem('user')
    }
  },
  
  actions: {
    async changePassword({ commit }, passwordData) {
      try {
        const response = await authService.changePassword(passwordData);
        return Promise.resolve(response);
      } catch (error) {
        return Promise.reject(error);
      }
    },

    async login({ commit }, credentials) {
      try {
        const response = await authService.login(credentials)
        commit('SET_ACCESS_TOKEN', response.access_token)
        commit('SET_REFRESH_TOKEN', response.refresh_token)
        
        const userResponse = await authService.getCurrentUser()
        commit('SET_USER', userResponse)
        
        commit('SET_SHOW_LOGIN_MODAL', false)
        return Promise.resolve(response)
      } catch (error) {
        return Promise.reject(error)
      }
    },
    
    async register({ commit }, userData) {
      try {
        const response = await authService.register(userData)
        commit('SET_SHOW_REGISTER_MODAL', false)
        return Promise.resolve(response)
      } catch (error) {
        return Promise.reject(error)
      }
    },
    
    logout({ commit }) {
      commit('CLEAR_AUTH')
    },
    
    async updateProfile({ commit }, userData) {
      try {
        const response = await authService.updateUser(userData)
        commit('SET_USER', response)
        return Promise.resolve(response)
      } catch (error) {
        return Promise.reject(error)
      }
    }
  }
}
