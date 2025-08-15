<template>
  <div :class="$style.wrapper">
    <div :class="$style.inputWrapper">
      <i class="fas fa-search" :class="$style.searchIcon"></i>
      <input 
        :value="modelValue"
        @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
        @keyup.enter="$emit('search')"
        type="text" 
        :placeholder="placeholder"
        :class="$style.input"
        :disabled="disabled"
      >
      <button 
        v-if="modelValue && !disabled" 
        :class="$style.clearButton"
        @click="$emit('update:modelValue', '')"
        type="button"
      >
        &times;
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
interface SearchInputProps {
  modelValue?: string;
  placeholder?: string;
  disabled?: boolean;
}

const props = withDefaults(defineProps<SearchInputProps>(), {
  modelValue: '',
  placeholder: 'Поиск...',
  disabled: false
});

defineEmits<{
  (e: 'update:modelValue', value: string): void;
  (e: 'search'): void;
}>();
</script>

<style module lang="scss">
@use './styles.module.scss';
</style>