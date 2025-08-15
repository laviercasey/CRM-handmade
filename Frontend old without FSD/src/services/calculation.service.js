import api from './api'

class CalculationService {
  async getFinancialStats(period = 'month') {
    const response = await api.get('/calculations/financial', { params: { period } })
    return response.data
  }
  
  async getProfitTrend(period = 'week') {
    const response = await api.get('/calculations/profit-trend', { params: { period } })
    return response.data
  }
  
  async getTopProducts(limit = 5) {
    const response = await api.get('/calculations/top-products', { params: { limit } })
    return response.data
  }
  
  async calculateProductPrice(calculationData) {
    const response = await api.post('/calculations/product', calculationData)
    return response.data
  }
  
  async getMaterials() {
    const response = await api.get('/materials')
    return response.data
  }
  
  async getMaterialById(materialId) {
    const response = await api.get(`/materials/${materialId}`)
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
  
  async saveProductFromCalculation(productData) {
    const calculationPayload = {
      materials: productData.calculationData.materials,
      workHours: productData.calculationData.workHours,
      hourlyRate: productData.calculationData.hourlyRate,
      additionalCosts: productData.calculationData.additionalCosts,
      profitMargin: productData.calculationData.profitMargin
    };
    
    const calculationResult = await this.calculateProductPrice(calculationPayload);
    
    const productPayload = {
      name: productData.name,
      img_name: productData.img_name || 'default-product.jpg',
      description: productData.description,
      price: calculationResult.totalPrice
    };
    
    const response = await api.post('/product', productPayload);
    return response.data;
  }
}

export default new CalculationService()
