import productService from '@/services/product.service'

export default {
  namespaced: true,
  
  state: {
    products: [],
    loading: false,
    error: null,
    selectedProduct: null
  },
  
  mutations: {
    SET_PRODUCTS(state, products) {
      state.products = products
    },
    
    SET_LOADING(state, loading) {
      state.loading = loading
    },
    
    SET_ERROR(state, error) {
      state.error = error
    },
    
    SET_SELECTED_PRODUCT(state, product) {
      state.selectedProduct = product
    },
    
    ADD_PRODUCT(state, product) {
      state.products.unshift(product)
    },
    
    UPDATE_PRODUCT(state, updatedProduct) {
      const index = state.products.findIndex(p => p.id === updatedProduct.id)
      if (index !== -1) {
        state.products.splice(index, 1, updatedProduct)
      }
    },
    
    REMOVE_PRODUCT(state, productId) {
      state.products = state.products.filter(p => p.id !== productId)
    }
  },
  
  actions: {
    async loadProducts({ commit, rootGetters }) {
      try {
        commit('SET_LOADING', true)
        commit('SET_ERROR', null)
        
        const userId = rootGetters['auth/user']?.id
        if (!userId) {
          throw new Error('User not authenticated')
        }
        
        const products = await productService.getProducts(userId)
        commit('SET_PRODUCTS', products)
        
        return products
      } catch (error) {
        commit('SET_ERROR', error.message || 'Failed to load products')
        throw error
      } finally {
        commit('SET_LOADING', false)
      }
    },
    
    async getProductById({ commit }, productId) {
      try {
        commit('SET_LOADING', true)
        commit('SET_ERROR', null)
        
        const product = await productService.getProductById(productId)
        commit('SET_SELECTED_PRODUCT', product)
        
        return product
      } catch (error) {
        commit('SET_ERROR', error.message || 'Failed to get product')
        throw error
      } finally {
        commit('SET_LOADING', false)
      }
    },
    
    async createProduct({ commit }, productData) {
      try {
        commit('SET_LOADING', true)
        commit('SET_ERROR', null)
        
        if (productData.imageFile) {
          const uploadResponse = await productService.uploadProductImage(productData.imageFile)
          productData.img_name = uploadResponse.filename
          delete productData.imageFile
        }
        
        const newProduct = await productService.createProduct(productData)
        commit('ADD_PRODUCT', newProduct)
        
        return newProduct
      } catch (error) {
        commit('SET_ERROR', error.message || 'Failed to create product')
        throw error
      } finally {
        commit('SET_LOADING', false)
      }
    },
    
    async updateProduct({ commit }, productData) {
      try {
        commit('SET_LOADING', true)
        commit('SET_ERROR', null)
        
        // Если есть файл изображения, сначала загружаем его
        if (productData.imageFile) {
          const uploadResponse = await productService.uploadProductImage(productData.imageFile)
          productData.img_name = uploadResponse.filename
          delete productData.imageFile // Удаляем файл из данных перед отправкой
        }
        
        const updatedProduct = await productService.updateProduct(productData)
        commit('UPDATE_PRODUCT', updatedProduct)
        
        return updatedProduct
      } catch (error) {
        commit('SET_ERROR', error.message || 'Failed to update product')
        throw error
      } finally {
        commit('SET_LOADING', false)
      }
    },
    
    async deleteProduct({ commit }, productId) {
      try {
        commit('SET_LOADING', true)
        commit('SET_ERROR', null)
        
        await productService.deleteProduct(productId)
        commit('REMOVE_PRODUCT', productId)
        
        return { success: true }
      } catch (error) {
        commit('SET_ERROR', error.message || 'Failed to delete product')
        throw error
      } finally {
        commit('SET_LOADING', false)
      }
    },
    
    selectProduct({ commit }, product) {
      commit('SET_SELECTED_PRODUCT', product)
    },
    
    clearSelectedProduct({ commit }) {
      commit('SET_SELECTED_PRODUCT', null)
    }
  },
  
  getters: {
    allProducts: state => state.products,
    isLoading: state => state.loading,
    error: state => state.error,
    selectedProduct: state => state.selectedProduct,
    
    // Сортировка и фильтрация
    sortedProducts: (state, getters, rootState) => {
      const { searchQuery, sortBy, sortOrder } = rootState.dashboard.filters.products
      
      // Фильтрация по поисковому запросу
      let filteredProducts = state.products
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        filteredProducts = filteredProducts.filter(product => 
          product.name.toLowerCase().includes(query) || 
          (product.description && product.description.toLowerCase().includes(query))
        )
      }
      
      // Сортировка
      return [...filteredProducts].sort((a, b) => {
        let comparison = 0
        
        if (sortBy === 'name') {
          comparison = a.name.localeCompare(b.name)
        } else if (sortBy === 'price') {
          comparison = a.price - b.price
        } else if (sortBy === 'date') {
          comparison = new Date(a.created_at) - new Date(b.created_at)
        }
        
        return sortOrder === 'asc' ? comparison : -comparison
      })
    },
    
    // Вычисляем общую стоимость всех товаров
    totalProductsValue: state => {
      return state.products.reduce((total, product) => total + product.price, 0)
    },
    
    // Получаем количество товаров
    productsCount: state => state.products.length
  }
}
