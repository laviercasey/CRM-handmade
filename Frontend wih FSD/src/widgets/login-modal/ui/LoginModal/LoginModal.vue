<template>
  <ModalOverlay 
    :show="isVisible"
    :closeOnOverlayClick="config.closeOnOverlayClick"
    :closeOnEscape="config.closeOnEscape"
    @close="handleClose"
  >
    <Modal
      :title="config.title"
      :size="config.size"
      :closable="config.closable"
      :showHeader="config.showHeader"
      @close="handleClose"
    >
      <LoginForm />
      
      <AuthModalActions v-if="config.showActions" />
    </Modal>
  </ModalOverlay>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useStore } from 'vuex';
import ModalOverlay from '@/shared/ui/ModalOverlay/';
import Modal from '@/shared/ui/Modal/';
import LoginForm from '@/features/auth/ui/login-modal/';
import AuthModalActions from '@/features/auth-modal-actions/ui/AuthModalActions/';
import { loginModalConfig } from '../../model/config';

const store = useStore();
const config = loginModalConfig;

const isVisible = computed((): boolean => 
  store.getters['auth/showLoginModal']
);

function handleClose(): void {
  store.commit('auth/SET_SHOW_LOGIN_MODAL', false);
}
</script>

<style module lang="scss">
@use './styles.module.scss';
</style>