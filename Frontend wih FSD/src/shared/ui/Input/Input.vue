<template>
  <input 
    :value="modelValue"
    @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    :type="type"
    :placeholder="placeholder"
    :required="required"
    :disabled="disabled"
    :class="[$style.input, { [$style.error]: hasError, [$style.disabled]: disabled }]"
  />
</template>

<script setup lang="ts">
interface InputProps {
  modelValue?: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  hasError?: boolean;
}

const props = withDefaults(defineProps<InputProps>(), {
  modelValue: '',
  type: 'text',
  placeholder: '',
  required: false,
  disabled: false,
  hasError: false
});

defineEmits<{
  (e: 'update:modelValue', value: string): void;
}>();
</script>

<style module lang="scss">
@use './styles.module.scss';
</style>