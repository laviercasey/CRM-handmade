<template>
  <section :class="$style.section" id="how-it-works">
    <Container>
      <h2 :class="$style.title">Как это работает</h2>
      <StepsList />
    </Container>
  </section>
</template>

<script setup lang="ts">
import Container from '@/shared/ui/Container/';
import StepsList from '@/entities/step/ui/StepList/';
</script>

<style module lang="scss">
@use './styles.module.scss';
</style>