<template>
  <section :class="$style.section">
    <Container>
      <h2 :class="$style.title">Отзывы наших пользователей</h2>
      <TestimonialsList />
    </Container>
  </section>
</template>

<script setup lang="ts">
import Container from '@/shared/ui/Container/index.vue';
import TestimonialsList from '@/entities/testimonials/ui/TestimonialsList/TestimonialsList.vue';
</script>

<style module lang="scss">
@use './styles.module.scss';
</style>