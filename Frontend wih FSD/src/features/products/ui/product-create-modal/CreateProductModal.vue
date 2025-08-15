<template>
  <div :class="$style.modalOverlay" @click="$emit('close')">
    <div :class="$style.modalContent" @click.stop>
      <h2>Создать товар</h2>
      <form @submit.prevent="handleSubmit">
        <div :class="$style.formGroup">
          <label>Название:</label>
          <input v-model="name" type="text" required />
        </div>
        <div :class="$style.formGroup">
          <label>Цена:</label>
          <input v-model="price" type="number" required />
        </div>
        <div :class="$style.formActions">
          <button type="submit" :class="$style.btnPrimary">Создать</button>
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

const name = ref<string>('')
const price = ref<string>('')

function handleSubmit(): void {
  console.log('Product created:', { name: name.value, price: price.value })
  emit('created')
}
</script>

<style module src="./styles.module.scss" />