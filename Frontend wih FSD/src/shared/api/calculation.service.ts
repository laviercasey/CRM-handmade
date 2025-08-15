import api from './index';

interface MaterialData {
  id: number;
  name: string;
  price: number;
  unit: string;
  [key: string]: any;
}

interface CalculationData {
  materials: Array<{
    id: number;
    quantity: number;
  }>;
  workHours: number;
  hourlyRate: number;
  additionalCosts?: number;
  profitMargin?: number;
}

interface CalculationResult {
  totalPrice: number;
  materialsCost: number;
  laborCost: number;
  additionalCost: number;
  profitAmount: number;
  breakdown: {
    [key: string]: number;
  };
}

interface ProductFromCalculation {
  name: string;
  description?: string;
  img_name?: string;
  calculationData: CalculationData;
}

class CalculationService {
  async getFinancialStats(period: string = 'month') {
    const response = await api.get('/calculations/financial', { params: { period } });
    return response.data;
  }
  
  async getProfitTrend(period: string = 'week') {
    const response = await api.get('/calculations/profit-trend', { params: { period } });
    return response.data;
  }
  
  async getTopProducts(limit: number = 5) {
    const response = await api.get('/calculations/top-products', { params: { limit } });
    return response.data;
  }
  
  async calculateProductPrice(calculationData: CalculationData) {
    const response = await api.post<CalculationResult>('/calculations/product', calculationData);
    return response.data;
  }
  
  async getMaterials() {
    const response = await api.get<MaterialData[]>('/materials');
    return response.data;
  }
  
  async getMaterialById(materialId: number) {
    const response = await api.get<MaterialData>(`/materials/${materialId}`);
    return response.data;
  }
  
  async createMaterial(materialData: Omit<MaterialData, 'id'>) {
    const response = await api.post<MaterialData>('/materials', materialData);
    return response.data;
  }
  
  async updateMaterial(materialId: number, materialData: Partial<MaterialData>) {
    const response = await api.patch<MaterialData>(`/materials/${materialId}`, materialData);
    return response.data;
  }
  
  async deleteMaterial(materialId: number) {
    const response = await api.delete(`/materials/${materialId}`);
    return response.data;
  }
  
  async saveProductFromCalculation(productData: ProductFromCalculation) {
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

export default new CalculationService();