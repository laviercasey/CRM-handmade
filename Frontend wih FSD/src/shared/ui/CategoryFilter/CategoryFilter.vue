<template>
  <div :class="$style.categories">
    <button 
      v-for="category in categories" 
      :key="category.id"
      :class="[$style.button, { [$style.active]: activeCategory === category.id }]"
      :disabled="disabled"
      @click="$emit('update:activeCategory', category.id)"
    >
      <i :class="category.icon"></i>
      {{ category.name }}
    </button>
  </div>
</template>

<script setup lang="ts">
interface Category {
  id: string;
  name: string;
  icon: string;
}

interface CategoryFilterProps {
  categories: Category[];
  activeCategory: string;
  disabled?: boolean;
}

const props = withDefaults(defineProps<CategoryFilterProps>(), {
  disabled: false
});

defineEmits<{
  (e: 'update:activeCategory', categoryId: string): void;
}>();
</script>

<style module lang="scss">
@use './styles.module.scss';
</style>  