import requestService from '@/services/request.service'

export default {
  namespaced: true,
  
  state: {
    requests: [],
    loading: false,
    error: null
  },
  
  getters: {
    pendingRequests: state => state.requests.filter(r => r.status === 'pending'),
    acceptedRequests: state => state.requests.filter(r => r.status === 'accepted'),
    rejectedRequests: state => state.requests.filter(r => r.status === 'rejected'),
    doneRequests: state => state.request.filter(r => r.status === 'done')
  },
  
  mutations: {
    SET_REQUESTS(state, requests) {
      state.requests = requests
    },
    
    SET_LOADING(state, loading) {
      state.loading = loading
    },
    
    SET_ERROR(state, error) {
      state.error = error
    },
    
    ADD_REQUEST(state, request) {
      state.requests.unshift(request)
    },
    
    UPDATE_REQUEST(state, updatedRequest) {
      const index = state.requests.findIndex(r => r.id === updatedRequest.id)
      if (index !== -1) {
        state.requests.splice(index, 1, updatedRequest)
      }
    }
  },
  
  actions: {
    async fetchRequests({ commit }, params = {}) {
      try {
        commit('SET_LOADING', true)
        const requests = await requestService.getRequests(params)
        commit('SET_REQUESTS', requests)
        return requests
      } catch (error) {
        commit('SET_ERROR', error.message || 'Failed to fetch requests')
        throw error
      } finally {
        commit('SET_LOADING', false)
      }
    },
    
    async fetchRequestById({ commit }, requestId) {
      try {
        commit('SET_LOADING', true)
        return await requestService.getRequestById(requestId)
      } catch (error) {
        commit('SET_ERROR', error.message || 'Failed to fetch request')
        throw error
      } finally {
        commit('SET_LOADING', false)
      }
    },
    
    async createRequest({ commit }, requestData) {
      try {
        commit('SET_LOADING', true)
        const newRequest = await requestService.createRequest(requestData)
        commit('ADD_REQUEST', newRequest)
        return newRequest
      } catch (error) {
        commit('SET_ERROR', error.message || 'Failed to create request')
        throw error
      } finally {
        commit('SET_LOADING', false)
      }
    },
    
    async updateRequest({ commit }, { requestId, status }) {
      try {
        commit('SET_LOADING', true)
        const updatedRequest = await requestService.updateRequestStatus(requestId, status)
        commit('UPDATE_REQUEST', updatedRequest)
        return updatedRequest
      } catch (error) {
        commit('SET_ERROR', error.message || 'Failed to update request')
        throw error
      } finally {
        commit('SET_LOADING', false)
      }
    },
    
    async submitFormRequest({ commit }, { username, requestData }) {
      try {
        commit('SET_LOADING', true)
        return await requestService.submitFormRequest(username, requestData)
      } catch (error) {
        commit('SET_ERROR', error.message || 'Failed to submit form request')
        throw error
      } finally {
        commit('SET_LOADING', false)
      }
    }
  }
}
