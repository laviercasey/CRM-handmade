import api from './index';

interface ProductData {
  id?: number;
  name: string;
  description?: string;
  price?: number;
  img_name?: string;
  [key: string]: any;
}

interface MaterialData {
  id?: number;
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
  [key: string]: any;
}

interface FinancialData {
  revenue: number;
  expenses: number;
  profit: number;
  [key: string]: any;
}

class ProductService {
  async getProducts(userId: number | null = null) {
    const params = userId ? { user_id: userId } : {};
    const response = await api.get('/product', { params });
    return response.data;
  }
  
  async getProductById(productId: number) {
    const response = await api.get(`/product/${productId}`);
    return response.data;
  }
  
  async createProduct(productData: ProductData) {
    const response = await api.post('/product', productData);
    return response.data;
  }
  
  async updateProduct(productData: ProductData) {
    const response = await api.patch(`/product`, productData);
    return response.data;
  }
  
  async deleteProduct(productId: number) {
    const response = await api.delete(`/product/${productId}`);
    return response.data;
  }
  
  async uploadProductImage(file: File) {
    const formData = new FormData();
    formData.append('image', file);
    
    const response = await api.post('/upload/product', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    
    return response.data;
  }
  
  async getMaterials() {
    const response = await api.get('/materials');
    return response.data;
  }
  
  async createMaterial(materialData: MaterialData) {
    const response = await api.post('/materials', materialData);
    return response.data;
  }
  
  async updateMaterial(materialId: number, materialData: MaterialData) {
    const response = await api.patch(`/materials/${materialId}`, materialData);
    return response.data;
  }
  
  async deleteMaterial(materialId: number) {
    const response = await api.delete(`/materials/${materialId}`);
    return response.data;
  }
  
  async calculateProductPrice(calculationData: CalculationData) {
    const response = await api.post('/calculations/product', calculationData);
    return response.data;
  }
  
  async getFinancialData(period: string = 'month') {
    const response = await api.get('/calculations/financial', { params: { period } });
    return response.data;
  }
}

export default new ProductService();