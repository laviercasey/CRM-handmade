interface ProductsState {
}

export default {
  namespaced: true,
  state: (): ProductsState => ({}),
  mutations: {},
  actions: {
    loadProducts(): Promise<any[]> { 
      return Promise.resolve([]);
    }
  }
};