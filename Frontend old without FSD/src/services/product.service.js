import api from './api'

class ProductService {
  async getProducts(userId = null) {
    const params = userId ? { user_id: userId } : {}
    const response = await api.get('/product', { params })
    return response.data
  }
  
  async getProductById(productId) {
    const response = await api.get(`/product/${productId}`)
    return response.data
  }
  
  async createProduct(productData) {
    const response = await api.post('/product', productData)
    return response.data
  }
  
  async updateProduct(productData) {
    const response = await api.patch(`/product`, productData)
    return response.data
  }
  
  async deleteProduct(productId) {
    const response = await api.delete(`/product/${productId}`)
    return response.data
  }
  
  async uploadProductImage(file) {
    const formData = new FormData()
    formData.append('image', file)
    
    const response = await api.post('/upload/product', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    
    return response.data
  }
  
  async getMaterials() {
    const response = await api.get('/materials')
    return response.data
  }
  
  async createMaterial(materialData) {
    const response = await api.post('/materials', materialData)
    return response.data
  }
  
  async updateMaterial(materialId, materialData) {
    const response = await api.patch(`/materials/${materialId}`, materialData)
    return response.data
  }
  
  async deleteMaterial(materialId) {
    const response = await api.delete(`/materials/${materialId}`)
    return response.data
  }
  
  async calculateProductPrice(calculationData) {
    const response = await api.post('/calculations/product', calculationData)
    return response.data
  }
  
  async getFinancialData(period = 'month') {
    const response = await api.get('/calculations/financial', { params: { period } })
    return response.data
  }
}

export default new ProductService()
