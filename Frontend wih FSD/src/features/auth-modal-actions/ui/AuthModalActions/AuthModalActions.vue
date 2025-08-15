<template>
  <div :class="$style.actions">
    <ForgotPasswordLink @click="handleForgotPassword" />
    
    <button 
      :class="$style.textButton"
      @click="handleShowRegister"
    >
      Регистрация
    </button>
  </div>
</template>

<script setup lang="ts">
import ForgotPasswordLink from '@/features/forgot-password/ui/ForgotPasswordLink';
import { useAuthModalActions } from '../model/use-auth-modal-actions';

const { handleForgotPassword, handleShowRegister } = useAuthModalActions();
</script>

<style module lang="scss">
@use './styles.module.scss';
</style>