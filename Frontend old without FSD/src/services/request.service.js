import api from './api'

class RequestService {
  async getRequests(params = {}) {
    const response = await api.get('/requests', { params })
    return response.data
  }
  
  async getRequestById(requestId) {
    const response = await api.get(`/requests/${requestId}`)
    return response.data
  }
  
  async createRequest(requestData) {
    const response = await api.post('/requests', requestData)
    return response.data
  }
  
  async updateRequestStatus(requestId, status) {
    const response = await api.patch(`/requests/${requestId}`, { status })
    return response.data
  }
  
  async submitFormRequest(username, requestData) {
    const response = await api.post(`/requests/forms/${username}`, requestData)
    return response.data
  }
}

export default new RequestService()
