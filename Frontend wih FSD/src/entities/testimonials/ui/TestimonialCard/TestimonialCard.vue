<template>
  <div :class="$style.testimonial">
    <div :class="$style.content">
      <p :class="$style.quote">{{ testimonial.content }}</p>
    </div>
    <div :class="$style.author">
      <div :class="$style.avatar">
        <img 
          :src="testimonial.author.avatar" 
          :alt="testimonial.author.name"
          @error="handleImageError"
        >
      </div>
      <div :class="$style.info">
        <div :class="$style.name">{{ testimonial.author.name }}</div>
        <div :class="$style.profession">{{ testimonial.author.profession }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { handleImageError } from '@/shared/utils/dom';
import { Testimonial } from '../../model/testimonials';

interface TestimonialCardProps {
  testimonial: Testimonial;
}

defineProps<TestimonialCardProps>();
</script>

<style module lang="scss">
@use './styles.module.scss';
</style>