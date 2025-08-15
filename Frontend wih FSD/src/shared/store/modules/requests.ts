interface RequestsState {
}

export default {
  namespaced: true,
  state: (): RequestsState => ({}),
  mutations: {},
  actions: {
    fetchRequests(): Promise<any[]> { 
      return Promise.resolve([]);
    },
    loadRequests(): Promise<any[]> { 
      return Promise.resolve([]);
    }
  }
};