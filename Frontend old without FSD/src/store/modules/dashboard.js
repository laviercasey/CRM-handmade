export default {
  namespaced: true,
  
  state: {
    activeTab: 'requests',
    sidebarCollapsed: false,
    filters: {
      requests: {
        status: '',
        searchQuery: '',
        sortOrder: 'newest'
      },
      products: {
        searchQuery: '',
        sortBy: 'name',
        sortOrder: 'asc'
      }
    }
  },
  
  mutations: {
    SET_ACTIVE_TAB(state, tab) {
      state.activeTab = tab;
    },
    
    TOGGLE_SIDEBAR(state) {
      state.sidebarCollapsed = !state.sidebarCollapsed;
    },
    
    SET_SIDEBAR_STATE(state, collapsed) {
      state.sidebarCollapsed = collapsed;
    },
    
    SET_REQUEST_FILTER(state, { key, value }) {
      state.filters.requests[key] = value;
    },
    
    SET_PRODUCT_FILTER(state, { key, value }) {
      state.filters.products[key] = value;
    },
    
    RESET_FILTERS(state, type) {
      if (type === 'requests') {
        state.filters.requests = {
          status: '',
          searchQuery: '',
          sortOrder: 'newest'
        };
      } else if (type === 'products') {
        state.filters.products = {
          searchQuery: '',
          sortBy: 'name',
          sortOrder: 'asc'
        };
      }
    }
  },
  
  actions: {
    setActiveTab({ commit }, tab) {
      commit('SET_ACTIVE_TAB', tab);
    },
    
    toggleSidebar({ commit }) {
      commit('TOGGLE_SIDEBAR');
    },
    
    setSidebarState({ commit }, collapsed) {
      commit('SET_SIDEBAR_STATE', collapsed);
    },
    
    setRequestFilter({ commit }, { key, value }) {
      commit('SET_REQUEST_FILTER', { key, value });
    },
    
    setProductFilter({ commit }, { key, value }) {
      commit('SET_PRODUCT_FILTER', { key, value });
    },
    
    resetFilters({ commit }, type) {
      commit('RESET_FILTERS', type);
    }
  },
  
  getters: {
    activeTab: state => state.activeTab,
    sidebarCollapsed: state => state.sidebarCollapsed,
    requestFilters: state => state.filters.requests,
    productFilters: state => state.filters.products
  }
}
