<template>
  <div :class="$style.value">
    <div :class="$style.icon">
      <i :class="value.icon"></i>
    </div>
    <h4 :class="$style.title">{{ value.title }}</h4>
    <p :class="$style.description">{{ value.description }}</p>
  </div>
</template>

<script setup lang="ts">
interface CompanyValue {
  id: number
  icon: string
  title: string
  description: string
}

defineProps<{
  value: CompanyValue
}>()
</script>

<style module src="./styles.module.scss" />