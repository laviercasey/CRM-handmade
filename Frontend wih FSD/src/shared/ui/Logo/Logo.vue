<template>
  <router-link 
    :to="to" 
    :class="[$style.logo, $style[size]]"
  >
    {{ text }}
  </router-link>
</template>

<script setup lang="ts">
type LogoSize = 'small' | 'medium' | 'large';

interface LogoProps {
  to?: string;
  text?: string;
  size?: LogoSize;
}

const props = withDefaults(defineProps<LogoProps>(), {
  to: '/',
  text: 'ТвойCRM',
  size: 'medium'
});
</script>

<style module lang="scss">
@use './styles.module.scss';
</style>