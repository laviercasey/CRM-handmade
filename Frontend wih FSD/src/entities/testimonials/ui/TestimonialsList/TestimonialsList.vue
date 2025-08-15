<template>
  <div :class="$style.slider">
    <TestimonialCard 
      v-for="testimonial in testimonials" 
      :key="testimonial.id"
      :testimonial="testimonial"
    />
  </div>
</template>

<script setup>
import TestimonialCard from '../TestimonialCard/'
import { testimonials } from '../../model/testimonials'
</script>

<style module>
.slider {
  display: flex;
  flex-wrap: wrap;
  gap: 30px;
  justify-content: center;
}

@media (max-width: 768px) {
  .slider {
    flex-direction: column;
    align-items: center;
  }
}
</style>