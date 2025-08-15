interface DashboardState {
  activeTab: string;
}

export default {
  namespaced: true,
  
  state: (): DashboardState => ({
    activeTab: 'requests'
  }),
  
  mutations: {
    SET_ACTIVE_TAB(state: DashboardState, tab: string): void {
      state.activeTab = tab;
    }
  },
  
  actions: {},
  
  getters: {
    activeTab: (state: DashboardState): string => state.activeTab
  }
};