<template>
  <section :id="config.sectionId" :class="$style.section">
    <Container>
      <div :class="$style.header">
        <h2 v-if="config.display.showTitle" :class="$style.title">
          {{ config.title }}
        </h2>
        <p v-if="config.display.showSubtitle" :class="$style.subtitle">
          {{ config.subtitle }}
        </p>
      </div>
      
      <div v-if="config.display.showForm" :class="$style.formWrapper">
        <FeedbackForm />
      </div>
    </Container>
  </section>
</template>

<script setup lang="ts">
import Container from '@/shared/ui/Container/';
import FeedbackForm from '@/features/feedback-form/ui/FeedbackForm/';
import { feedbackSectionConfig } from '../../model/config';

const config = feedbackSectionConfig;
</script>

<style module lang="scss">
@use './styles.module.scss';
</style>