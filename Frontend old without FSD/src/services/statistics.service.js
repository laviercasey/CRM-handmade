import api from './api'

class StatisticsService {
  async getOverviewStats() {
    const response = await api.get('/statistics/overview')
    return response.data
  }
  
  async getRequestsByStatus() {
    const response = await api.get('/statistics/requests-by-status')
    return response.data
  }
  
  async getActivityByDay(period = 'week') {
    const response = await api.get('/statistics/activity-by-day', { params: { period } })
    return response.data
  }
  
  async getTopProducts(limit = 5) {
    const response = await api.get('/calculations/top-products', { params: { limit } })
    return response.data
  }
  
  async generateReport({ format = 'pdf' } = {}) {
    const response = await api.get('/statistics/report', { 
      params: { format },
      responseType: 'blob'
    })
    return response.data
  }
}

export default new StatisticsService()
