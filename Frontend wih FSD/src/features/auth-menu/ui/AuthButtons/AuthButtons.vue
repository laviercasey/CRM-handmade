<template>
  <div :class="$style.authButtons">
    <Button 
      variant="outline"
      size="small"
      @click="$emit('showLogin')"
      :class="$style.loginButton"
    >
      Войти
    </Button>
    <Button 
      variant="primary"
      size="small"
      @click="$emit('showRegister')"
      :class="$style.registerButton"
    >
      Регистрация
    </Button>
  </div>
</template>

<script setup lang="ts">
import Button from '@/shared/ui/Button/';

defineEmits<{
  (e: 'showLogin'): void;
  (e: 'showRegister'): void;
}>();
</script>

<style module lang="scss">
@use './styles.module.scss';
</style>