<template>
  <section :class="[$style.section, $style[variant]]">
    <slot />
  </section>
</template>

<script setup lang="ts">
type SectionVariant = 'default' | 'light' | 'dark' | 'primary';

interface SectionProps {
  variant?: SectionVariant;
}

const props = withDefaults(defineProps<SectionProps>(), {
  variant: 'default'
});
</script>

<style module lang="scss">
@use './styles.module.scss';
</style>