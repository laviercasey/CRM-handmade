import { useStore } from 'vuex';
import { showFeatureStub } from '@/shared/lib/utils/modal';

export function useAuthModalActions() {
  const store = useStore();
  
  function handleForgotPassword(): void {
    showFeatureStub('Восстановление пароля');
  }
  
  function handleShowRegister(): void {
    store.commit('auth/SET_SHOW_LOGIN_MODAL', false);
    store.commit('auth/SET_SHOW_REGISTER_MODAL', true);
  }
  
  function handleShowLogin(): void {
    store.commit('auth/SET_SHOW_REGISTER_MODAL', false);
    store.commit('auth/SET_SHOW_LOGIN_MODAL', true);
  }
  
  function closeAllModals(): void {
    store.commit('auth/SET_SHOW_LOGIN_MODAL', false);
    store.commit('auth/SET_SHOW_REGISTER_MODAL', false);
  }
  
  return {
    handleForgotPassword,
    handleShowRegister,
    handleShowLogin,
    closeAllModals
  };
}