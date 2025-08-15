<template>
  <div :class="$style.feedback">
    <div :class="$style.question">Был ли этот ответ полезным?</div>
    <div :class="$style.buttons">
      <button 
        :class="$style.button"
        @click="$emit('feedback', true)"
      >
        <i class="far fa-thumbs-up"></i> Да
      </button>
      <button 
        :class="$style.button"
        @click="$emit('feedback', false)"
      >
        <i class="far fa-thumbs-down"></i> Нет
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
defineEmits<{
  feedback: [isHelpful: boolean]
}>()
</script>

<style module src="./styles.module.scss" />