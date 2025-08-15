import calculationService from '@/services/calculation.service'

export default {
  namespaced: true,
  
  state: {
    financialData: {
      income: 0,
      expenses: 0,
      profit: 0
    },
    profitTrend: [],
    materials: [],
    topProducts: [],
    loading: {
      financialData: false,
      profitTrend: false,
      materials: false,
      topProducts: false
    },
    error: null
  },
  
  mutations: {
    SET_FINANCIAL_DATA(state, data) {
      state.financialData = data
    },
    
    SET_PROFIT_TREND(state, data) {
      state.profitTrend = data
    },
    
    SET_MATERIALS(state, materials) {
      state.materials = materials
    },
    
    ADD_MATERIAL(state, material) {
      state.materials.push(material)
    },
    
    UPDATE_MATERIAL(state, updatedMaterial) {
      const index = state.materials.findIndex(m => m.id === updatedMaterial.id)
      if (index !== -1) {
        state.materials.splice(index, 1, updatedMaterial)
      }
    },
    
    REMOVE_MATERIAL(state, materialId) {
      state.materials = state.materials.filter(m => m.id !== materialId)
    },
    
    SET_TOP_PRODUCTS(state, products) {
      state.topProducts = products
    },
    
    SET_LOADING(state, { key, value }) {
      state.loading[key] = value
    },
    
    SET_ERROR(state, error) {
      state.error = error
    }
  },
  
  actions: {
    async fetchFinancialData({ commit }, period = 'month') {
      try {
        commit('SET_LOADING', { key: 'financialData', value: true })
        commit('SET_ERROR', null)
        
        const data = await calculationService.getFinancialStats(period)
        commit('SET_FINANCIAL_DATA', data)
        
        return data
      } catch (error) {
        commit('SET_ERROR', error.message || 'Failed to fetch financial data')
        throw error
      } finally {
        commit('SET_LOADING', { key: 'financialData', value: false })
      }
    },
    
    async fetchProfitTrend({ commit }, period = 'week') {
      try {
        commit('SET_LOADING', { key: 'profitTrend', value: true })
        commit('SET_ERROR', null)
        
        const data = await calculationService.getProfitTrend(period)
        commit('SET_PROFIT_TREND', data)
        
        return data
      } catch (error) {
        commit('SET_ERROR', error.message || 'Failed to fetch profit trend')
        throw error
      } finally {
        commit('SET_LOADING', { key: 'profitTrend', value: false })
      }
    },
    
    async fetchMaterials({ commit }) {
      try {
        commit('SET_LOADING', { key: 'materials', value: true })
        commit('SET_ERROR', null)
        
        const materials = await calculationService.getMaterials()
        commit('SET_MATERIALS', materials)
        
        return materials
      } catch (error) {
        commit('SET_ERROR', error.message || 'Failed to fetch materials')
        throw error
      } finally {
        commit('SET_LOADING', { key: 'materials', value: false })
      }
    },
    
    async createMaterial({ commit }, materialData) {
      try {
        commit('SET_ERROR', null)
        
        const newMaterial = await calculationService.createMaterial(materialData)
        commit('ADD_MATERIAL', newMaterial)
        
        return newMaterial
      } catch (error) {
        commit('SET_ERROR', error.message || 'Failed to create material')
        throw error
      }
    },
    
    async updateMaterial({ commit }, { materialId, materialData }) {
      try {
        commit('SET_ERROR', null)
        
        const updatedMaterial = await calculationService.updateMaterial(materialId, materialData)
        commit('UPDATE_MATERIAL', updatedMaterial)
        
        return updatedMaterial
      } catch (error) {
        commit('SET_ERROR', error.message || 'Failed to update material')
        throw error
      }
    },
    
    async deleteMaterial({ commit }, materialId) {
      try {
        commit('SET_ERROR', null)
        
        await calculationService.deleteMaterial(materialId)
        commit('REMOVE_MATERIAL', materialId)
        
        return { success: true }
      } catch (error) {
        commit('SET_ERROR', error.message || 'Failed to delete material')
        throw error
      }
    },
    
    async fetchTopProducts({ commit }, limit = 5) {
      try {
        commit('SET_LOADING', { key: 'topProducts', value: true })
        commit('SET_ERROR', null)
        
        const products = await calculationService.getTopProducts(limit)
        commit('SET_TOP_PRODUCTS', products)
        
        return products
      } catch (error) {
        commit('SET_ERROR', error.message || 'Failed to fetch top products')
        throw error
      } finally {
        commit('SET_LOADING', { key: 'topProducts', value: false })
      }
    },
    
    async calculateProductPrice({ commit }, calculationData) {
      try {
        commit('SET_ERROR', null)
        
        return await calculationService.calculateProductPrice(calculationData)
      } catch (error) {
        commit('SET_ERROR', error.message || 'Failed to calculate product price')
        throw error
      }
    },
    async saveProductFromCalculation({ commit }, productData) {
      try {
        commit('SET_ERROR', null);
        
        return await calculationService.saveProductFromCalculation(productData);
      } catch (error) {
        commit('SET_ERROR', error.message || 'Failed to save product');
        throw error;
      }
    }


  },
  
  getters: {
    totalIncome: state => state.financialData.income,
    totalExpenses: state => state.financialData.expenses,
    totalProfit: state => state.financialData.profit,
    profitMargin: state => {
      if (state.financialData.income === 0) return 0
      return (state.financialData.profit / state.financialData.income) * 100
    }
  }
}
