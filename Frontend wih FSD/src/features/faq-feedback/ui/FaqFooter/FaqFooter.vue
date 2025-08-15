<template>
  <div :class="$style.footer">
    <p :class="$style.text">Не нашли ответ на свой вопрос?</p>
    <Button variant="primary" @click="scrollToFeedback">
      Задать вопрос
    </Button>
  </div>
</template>

<script setup lang="ts">
import Button from '@/shared/ui/Button/';
import { scrollToElement } from '@/shared/utils/dom';

function scrollToFeedback(): void {
  const feedbackElement = document.querySelector('.feedback-section');
  if (feedbackElement) {
    feedbackElement.scrollIntoView({ behavior: 'smooth' });
  } else {
    scrollToElement('feedback');
  }
}
</script>

<style module lang="scss">
@use './styles.module.scss';
</style>