import axios from 'axios'
import store from '../store'
import router from '../router'
    
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api/v1',
  headers: {
    'Content-Type': 'application/json'
  }
})

api.interceptors.request.use(
  config => {
    const token = store.getters['auth/accessToken']
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    return config
  },
  error => {
    store.dispatch('notifications/showError', {
      title: 'Ошибка запроса',
      message: 'Не удалось выполнить запрос к серверу'
    })
    return Promise.reject(error)
  }
)

api.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config
    
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      
      try {
        const refreshToken = store.getters['auth/refreshToken']
        if (!refreshToken) {
          throw new Error('No refresh token available')
        }
        
        const response = await axios.post(`${api.defaults.baseURL}/auth/refresh`, { 
          refresh_token: refreshToken 
        })
        
        const { access_token } = response.data
        store.commit('auth/SET_ACCESS_TOKEN', access_token)
        
        originalRequest.headers['Authorization'] = `Bearer ${access_token}`
        return api(originalRequest)
      } catch (refreshError) {
        store.dispatch('auth/logout')
        router.push('/')
        
        store.dispatch('notifications/showError', {
          title: 'Сессия истекла',
          message: 'Пожалуйста, войдите снова'
        })
        
        return Promise.reject(refreshError)
      }
    }
    
    if (error.response) {
      const status = error.response.status
      let errorMessage = 'Произошла ошибка при обработке запроса'
      
      if (status === 400) {
        errorMessage = error.response.data.detail || 'Некорректный запрос'
      } else if (status === 403) {
        errorMessage = 'У вас нет доступа к этому ресурсу'
      } else if (status === 404) {
        errorMessage = 'Запрашиваемый ресурс не найден'
      } else if (status === 500) {
        errorMessage = 'Внутренняя ошибка сервера'
      }
      
      if (status !== 401) {
        store.dispatch('notifications/showError', {
          title: `Ошибка ${status}`,
          message: errorMessage
        })
      }
    } else if (error.request) {
      store.dispatch('notifications/showError', {
        title: 'Ошибка соединения',
        message: 'Сервер не отвечает. Проверьте подключение к интернету.'
      })
    } else {
      store.dispatch('notifications/showError', {
        title: 'Ошибка запроса',
        message: error.message
      })
    }
    
    return Promise.reject(error)
  }
)

export default api
