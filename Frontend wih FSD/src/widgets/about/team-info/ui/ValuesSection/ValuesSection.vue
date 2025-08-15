<template>
  <div :class="$style.values">
    <h3 :class="$style.title">Наши ценности</h3>
    <ValuesList />
  </div>
</template>

<script setup lang="ts">
import ValuesList from '@/entities/company-value/ui/ValuesList/'
</script>

<style module src="./styles.module.scss" />