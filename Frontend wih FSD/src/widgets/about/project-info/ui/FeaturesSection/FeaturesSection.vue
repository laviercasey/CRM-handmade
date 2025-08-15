<template>
  <section :class="$style.features">
    <Container>
      <h2 :class="$style.title">Возможности платформы</h2>
      
      <FeaturesList />
    </Container>
  </section>
</template>

<script setup lang="ts">
import Container from '@/shared/ui/Container/';
import FeaturesList from '@/entities/feature/ui/FeatureList/';
</script>

<style module lang="scss">
@use './styles.module.scss';
</style>