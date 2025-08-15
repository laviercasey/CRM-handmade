<template>
  <div 
    v-if="show && message"
    :class="[$style.errorMessage, $style[variant]]"
  >
    <i v-if="showIcon" :class="iconClass"></i>
    <span :class="$style.text">{{ message }}</span>
    <button 
      v-if="closable"
      :class="$style.closeButton"
      @click="$emit('close')"
    >
      &times;
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

type AlertVariant = 'error' | 'warning' | 'info';

interface AlertMessageProps {
  message?: string;
  variant?: AlertVariant;
  show?: boolean;
  showIcon?: boolean;
  closable?: boolean;
}

const props = withDefaults(defineProps<AlertMessageProps>(), {
  message: '',
  variant: 'error',
  show: true,
  showIcon: true,
  closable: false
});

defineEmits<{
  (e: 'close'): void;
}>();

const iconClass = computed((): string => {
  const icons = {
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