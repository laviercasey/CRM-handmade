let nextId = 1

export default {
  namespaced: true,
  
  state: {
    notifications: []
  },
  
  mutations: {
    ADD_NOTIFICATION(state, notification) {
      state.notifications.push({
        id: nextId++,
        ...notification
      })
    },
    
    REMOVE_NOTIFICATION(state, id) {
      state.notifications = state.notifications.filter(n => n.id !== id)
    }
  },
  
  actions: {
    addNotification({ commit }, notification) {
      commit('ADD_NOTIFICATION', notification)
      
      if (notification.timeout !== false) {
        const timeout = notification.timeout || 3000
        
        setTimeout(() => {
          commit('REMOVE_NOTIFICATION', nextId - 1)
        }, timeout)
      }
    },
    
    removeNotification({ commit }, id) {
      commit('REMOVE_NOTIFICATION', id)
    },
    
    showSuccess({ dispatch }, { title, message, timeout }) {
      dispatch('addNotification', {
        type: 'success',
        title: title || 'Успешно',
        message,
        timeout
      })
    },
    
    showError({ dispatch }, { title, message, timeout }) {
      dispatch('addNotification', {
        type: 'error',
        title: title || 'Ошибка',
        message,
        timeout
      })
    },
    
    showWarning({ dispatch }, { title, message, timeout }) {
      dispatch('addNotification', {
        type: 'warning',
        title: title || 'Предупреждение',
        message,
        timeout
      })
    },
    
    showInfo({ dispatch }, { title, message, timeout }) {
      dispatch('addNotification', {
        type: 'info',
        title: title || 'Информация',
        message,
        timeout
      })
    }
  }
}
