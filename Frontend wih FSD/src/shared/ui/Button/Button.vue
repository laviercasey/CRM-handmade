<template>
  <button 
    :class="[
      $style.button,
      $style[variant],
      $style[size]
    ]"
    @click="$emit('click')"
  >
    <slot />
  </button>
</template>

<script setup lang="ts">
type ButtonVariant = 'primary' | 'secondary';
type ButtonSize = 'small' | 'medium' | 'large';

interface ButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

const props = withDefaults(defineProps<ButtonProps>(), {
  variant: 'primary',
  size: 'medium'
});

defineEmits<{
  (e: 'click'): void;
}>();
</script>

<style module lang="scss">
@use './styles.module.scss';
</style>