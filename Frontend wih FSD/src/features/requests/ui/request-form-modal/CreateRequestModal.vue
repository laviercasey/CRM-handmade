<template>
  <div :class="$style.modalOverlay" @click="$emit('close')">
    <div :class="$style.modalContent" @click.stop>
      <h2>Новая заявка</h2>
      <form @submit.prevent="handleSubmit">
        <div :class="$style.formGroup">
          <label>Услуга:</label>
          <input v-model="service" type="text" required />
        </div>
        <div :class="$style.formGroup">
          <label>Описание:</label>
          <textarea v-model="description" rows="3"></textarea>
        </div>
        <div :class="$style.formActions">
          <button type="submit" :class="$style.btnPrimary">Создать заявку</button>
          <button type="button" @click="$emit('close')">Отмена</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const emit = defineEmits<{
  close: []
  created: []
}>()

const service = ref<string>('')
const description = ref<string>('')

function handleSubmit(): void {
  console.log('Request created:', { service: service.value, description: description.value })
  emit('created')
}
</script>

<style module src="./styles.module.scss" />