<template>
  <div :class="$style.steps">
    <StepCard 
      v-for="(step, index) in steps" 
      :key="step.id"
      :step="step"
      :is-last="index === steps.length - 1"
    />
  </div>
</template>

<script setup lang="ts">
import StepCard from '../StepCard/'
import { steps } from '../../model/step'
</script>

<style module src="./styles.module.scss" />