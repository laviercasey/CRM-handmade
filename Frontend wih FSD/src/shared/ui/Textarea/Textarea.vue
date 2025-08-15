<template>
  <textarea 
    :value="modelValue"
    @input="$emit('update:modelValue', ($event.target as HTMLTextAreaElement).value)"
    :placeholder="placeholder"
    :required="required"
    :disabled="disabled"
    :rows="rows"
    :class="[$style.textarea, { [$style.error]: hasError, [$style.disabled]: disabled }]"
  ></textarea>
</template>

<script setup lang="ts">
interface TextAreaProps {
  modelValue: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  hasError?: boolean;
  rows?: number;
}

const props = withDefaults(defineProps<TextAreaProps>(), {
  modelValue: '',
  placeholder: '',
  required: false,
  disabled: false,
  hasError: false,
  rows: 4
});

defineEmits<{
  (e: 'update:modelValue', value: string): void
}>();
</script>

<style module lang="scss">
@use './styles.module.scss';
</style>