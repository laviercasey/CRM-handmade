<template>
  <div :class="[$style.step, { [$style.notLast]: !isLast }]">
    <div :class="$style.number">{{ step.number }}</div>
    <div :class="$style.content">
      <h3 :class="$style.title">{{ step.title }}</h3>
      <p :class="$style.description">{{ step.description }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Step {
  id: number
  number: number
  title: string
  description: string
}

defineProps<{
  step: Step
  isLast?: boolean
}>()
</script>

<style module src="./styles.module.scss" />