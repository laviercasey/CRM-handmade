import statisticsService from '@/services/statistics.service'

export default {
  namespaced: true,
  
  state: {
    overview: {
      totalRequests: 0,
      totalProducts: 0,
      totalRevenue: 0,
      requestsChange: 0,
      productsChange: 0,
      revenueChange: 0
    },
    statusCounts: {
      pending: 0,
      accepted: 0,
      rejected: 0,
      done: 0
    },
    activityByDay: [],
    topProducts: [],
    loading: {
      overview: false,
      statusCounts: false,
      activityByDay: false,
      topProducts: false
    },
    error: null
  },
  
  mutations: {
    SET_OVERVIEW(state, data) {
      state.overview = data
    },
    
    SET_STATUS_COUNTS(state, data) {
      state.statusCounts = data
    },
    
    SET_ACTIVITY_BY_DAY(state, data) {
      state.activityByDay = data
    },
    
    SET_TOP_PRODUCTS(state, data) {
      state.topProducts = data
    },
    
    SET_LOADING(state, { key, value }) {
      state.loading[key] = value
    },
    
    SET_ERROR(state, error) {
      state.error = error
    }
  },
  
  actions: {
    async fetchOverviewStats({ commit }) {
      try {
        commit('SET_LOADING', { key: 'overview', value: true })
        commit('SET_ERROR', null)
        
        const data = await statisticsService.getOverviewStats()
        commit('SET_OVERVIEW', data)
        
        return data
      } catch (error) {
        commit('SET_ERROR', error.message || 'Failed to fetch overview stats')
        throw error
      } finally {
        commit('SET_LOADING', { key: 'overview', value: false })
      }
    },
    
    async fetchRequestsByStatus({ commit }) {
      try {
        commit('SET_LOADING', { key: 'statusCounts', value: true })
        commit('SET_ERROR', null)
        
        const data = await statisticsService.getRequestsByStatus()
        commit('SET_STATUS_COUNTS', data)
        
        return data
      } catch (error) {
        commit('SET_ERROR', error.message || 'Failed to fetch requests by status')
        throw error
      } finally {
        commit('SET_LOADING', { key: 'statusCounts', value: false })
      }
    },
    
    async fetchActivityByDay({ commit }, period = 'week') {
      try {
        commit('SET_LOADING', { key: 'activityByDay', value: true })
        commit('SET_ERROR', null)
        
        const data = await statisticsService.getActivityByDay(period)
        commit('SET_ACTIVITY_BY_DAY', data)
        
        return data
      } catch (error) {
        commit('SET_ERROR', error.message || 'Failed to fetch activity by day')
        throw error
      } finally {
        commit('SET_LOADING', { key: 'activityByDay', value: false })
      }
    },
    
    async fetchTopProducts({ commit }, limit = 5) {
      try {
        commit('SET_LOADING', { key: 'topProducts', value: true })
        commit('SET_ERROR', null)
        
        const data = await statisticsService.getTopProducts(limit)
        commit('SET_TOP_PRODUCTS', data)
        
        return data
      } catch (error) {
        commit('SET_ERROR', error.message || 'Failed to fetch top products')
        throw error
      } finally {
        commit('SET_LOADING', { key: 'topProducts', value: false })
      }
    },
    
    async generateReport({ commit }, { format = 'pdf' } = {}) {
        try {
        commit('SET_ERROR', null)
        
        const reportBlob = await statisticsService.generateReport({ format })
        
        const url = window.URL.createObjectURL(reportBlob)
        const link = document.createElement('a')
        link.href = url
        
        const fileExtension = format === 'pdf' ? 'pdf' : format === 'csv' ? 'csv' : 'xlsx'
        link.setAttribute('download', `report-${new Date().toISOString().slice(0, 10)}.${fileExtension}`)
        
        document.body.appendChild(link)
        link.click()
        
        window.URL.revokeObjectURL(url)
        document.body.removeChild(link)
        
        return { success: true }
        } catch (error) {
        commit('SET_ERROR', error.message || 'Failed to generate report')
        throw error
        }
    }
  
  },
  
  getters: {
    totalRequests: state => state.overview.totalRequests,
    totalProducts: state => state.overview.totalProducts,
    totalRevenue: state => state.overview.totalRevenue,
    requestsChange: state => state.overview.requestsChange,
    productsChange: state => state.overview.productsChange,
    revenueChange: state => state.overview.revenueChange,
    statusCounts: state => state.statusCounts,
    activityByDay: state => state.activityByDay,
    topProducts: state => state.topProducts,
    maxDayActivity: state => {
      if (!state.activityByDay.length) return 0
      return Math.max(...state.activityByDay.map(day => day.count))
    },
    isLoadingOverview: state => state.loading.overview,
    isLoadingStatusCounts: state => state.loading.statusCounts,
    isLoadingActivityByDay: state => state.loading.activityByDay,
    isLoadingTopProducts: state => state.loading.topProducts,
    error: state => state.error
        
    
  }
}
