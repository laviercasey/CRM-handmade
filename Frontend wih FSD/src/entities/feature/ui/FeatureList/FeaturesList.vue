<template>
  <div :class="$style.grid">
    <FeatureCard 
      v-for="feature in features" 
      :key="feature.id"
      :feature="feature"
    />
  </div>
</template>

<script setup lang="ts">
import FeatureCard from '../FeatureCard/'
import { features } from '../../model/feature'
</script>

<style module src="./styles.module.scss" />