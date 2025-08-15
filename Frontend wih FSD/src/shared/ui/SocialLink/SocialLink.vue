<template>
  <a 
    :href="href" 
    :class="$style.link"
    target="_blank"
    rel="noopener noreferrer"
  >
    <i :class="icon"></i>
  </a>
</template>

<script setup>
defineProps({
  href: {
    type: String,
    required: true
  },
  icon: {
    type: String,
    required: true
  }
})
</script>

<style module lang="scss">
@use './styles.module.scss';
</style>