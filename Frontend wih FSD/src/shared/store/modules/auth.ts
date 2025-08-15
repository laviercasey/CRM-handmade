import authService from '../../api/auth.service';

interface User {
  id?: number;
  username?: string;
  email?: string;
  first_name?: string;
  last_name?: string;
  [key: string]: any;
}

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  user: User | null;
  showLoginModal: boolean;
  showRegisterModal: boolean;
}

interface Credentials {
  username: string;
  password: string;
}

interface PasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword?: string;
}

export default {
  namespaced: true,
  
  state: (): AuthState => ({
    accessToken: localStorage.getItem('accessToken') || null,
    refreshToken: localStorage.getItem('refreshToken') || null,
    user: JSON.parse(localStorage.getItem('user') || 'null'),
    showLoginModal: false,
    showRegisterModal: false,
  }),
  
  getters: {
    isAuthenticated: (state: AuthState): boolean => !!state.accessToken,
    accessToken: (state: AuthState): string | null => state.accessToken,
    refreshToken: (state: AuthState): string | null => state.refreshToken,
    user: (state: AuthState): User | null => state.user,
    showLoginModal: (state: AuthState): boolean => state.showLoginModal,
    showRegisterModal: (state: AuthState): boolean => state.showRegisterModal
  },
  
  mutations: {
    SET_ACCESS_TOKEN(state: AuthState, token: string): void {
      state.accessToken = token;
      localStorage.setItem('accessToken', token);
    },
    SET_REFRESH_TOKEN(state: AuthState, token: string): void {
      state.refreshToken = token;
      localStorage.setItem('refreshToken', token);
    },
    SET_USER(state: AuthState, user: User): void {
      state.user = user;
      localStorage.setItem('user', JSON.stringify(user));
    },
    SET_SHOW_LOGIN_MODAL(state: AuthState, show: boolean): void {
      state.showLoginModal = show;
    },
    SET_SHOW_REGISTER_MODAL(state: AuthState, value: boolean): void {
      state.showRegisterModal = value;
      console.log('SET_SHOW_REGISTER_MODAL:', value);
      if (!value) {
        setTimeout(() => {
          const overlay = document.querySelector('.modal-overlay');
          if (overlay) (overlay as HTMLElement).style.display = 'none';
        }, 0);
      }
    },
    CLEAR_AUTH(state: AuthState): void {
      state.accessToken = null;
      state.refreshToken = null;
      state.user = null;
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
    }
  },
  
  actions: {
    async changePassword({ commit }: { commit: Function }, passwordData: PasswordData): Promise<any> {
      try {
        const response = await authService.changePassword(passwordData);
        return Promise.resolve(response);
      } catch (error) {
        return Promise.reject(error);
      }
    },

    async login({ commit }: { commit: Function }, credentials: Credentials): Promise<any> {
      try {
        const response = await authService.login(credentials);
        commit('SET_ACCESS_TOKEN', response.access_token);
        commit('SET_REFRESH_TOKEN', response.refresh_token);
        
        const userResponse = await authService.getCurrentUser();
        commit('SET_USER', userResponse);
        
        commit('SET_SHOW_LOGIN_MODAL', false);
        return Promise.resolve(response);
      } catch (error) {
        return Promise.reject(error);
      }
    },
    
    async register({ commit }: { commit: Function }, userData: User): Promise<any> {
      try {
        const response = await authService.register(userData);
        commit('SET_SHOW_REGISTER_MODAL', false);
        return Promise.resolve(response);
      } catch (error) {
        return Promise.reject(error);
      }
    },
    
    logout({ commit }: { commit: Function }): void {
      commit('CLEAR_AUTH');
    },
    
    async updateProfile({ commit }: { commit: Function }, userData: User): Promise<any> {
      try {
        const response = await authService.updateUser(userData);
        commit('SET_USER', response);
        return Promise.resolve(response);
      } catch (error) {
        return Promise.reject(error);
      }
    }
  }
};