<template>
  <div v-if="show" :class="[$style.message, $style[variant]]">
    <div :class="$style.icon">
      <i :class="iconClass"></i>
    </div>
    <div :class="$style.content">
      <div v-if="title" :class="$style.title">{{ title }}</div>
      <div :class="$style.text">{{ message }}</div>
    </div>
    <button 
      v-if="closable"
      :class="$style.closeButton"
      @click="$emit('close')"
    >
      <i class="fas fa-times"></i>
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

type MessageVariant = 'success' | 'error' | 'warning' | 'info';

interface MessageProps {
  show?: boolean;
  variant?: MessageVariant;
  title?: string;
  message: string;
  closable?: boolean;
}

const props = withDefaults(defineProps<MessageProps>(), {
  show: false,
  variant: 'success',
  title: '',
  closable: false
});

defineEmits<{
  (e: 'close'): void
}>();

const iconClass = computed(() => {
  const icons = {
    success: 'fas fa-check-circle',
    error: 'fas fa-exclamation-circle',
    warning: 'fas fa-exclamation-triangle',
    info: 'fas fa-info-circle'
  };
  return icons[props.variant];
});
</script>

<style module lang="scss">
@use './styles.module.scss';
</style>