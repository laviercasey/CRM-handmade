<template>
  <div :class="$style.modalOverlay" @click="$emit('close')">
    <div :class="$style.modalContent" @click.stop>
      <h2>Выбрать товары</h2>
      <p>Здесь будет список товаров для выбора...</p>
      <div :class="$style.formActions">
        <button :class="$style.btnPrimary" @click="handleSelect">Выбрать</button>
        <button @click="$emit('close')">Отмена</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Product {
  id: number
  name: string
  price: number
}

const emit = defineEmits<{
  close: []
  'products-selected': [products: Product[]]
}>()

defineProps<{
  preselectedProducts?: Product[]
}>()

function handleSelect(): void {
  emit('products-selected', [])
}
</script>

<style module src="./styles.module.scss" />