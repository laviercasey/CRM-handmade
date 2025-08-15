<template>
  <div :class="$style.grid">
    <ValueCard 
      v-for="value in companyValues" 
      :key="value.id"
      :value="value"
    />
  </div>
</template>

<script setup lang="ts">
import ValueCard from '../ValueCard/'
import { companyValues } from '../../model/company-values'
</script>

<style module src="./styles.module.scss" />