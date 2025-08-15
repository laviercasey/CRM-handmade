<template>
  <div :class="$style.card">
    <div :class="$style.icon">
      <i :class="feature.icon"></i>
    </div>
    <h3 :class="$style.title">{{ feature.title }}</h3>
    <p :class="$style.description">{{ feature.description }}</p>
  </div>
</template>

<script setup lang="ts">
interface Feature {
  id: number
  icon: string
  title: string
  description: string
}

defineProps<{
  feature: Feature
}>()
</script>

<style module src="./styles.module.scss" />