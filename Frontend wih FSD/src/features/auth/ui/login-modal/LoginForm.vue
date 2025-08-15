<template>
  <form @submit.prevent="handleSubmit" :class="$style.form">
    <FormGroup 
      :label="config.fields.username.label"
      fieldId="login-username"
      :required="config.fields.username.required"
      :error="errors.username"
    >
      <Input
        id="login-username"
        v-model="formData.username"
        :type="config.fields.username.type"
        :placeholder="config.fields.username.placeholder"
        :required="config.fields.username.required"
        :disabled="isLoading"
        :hasError="!!errors.username"
        :autocomplete="config.fields.username.autocomplete"
        @blur="validateField('username')"
      />
    </FormGroup>
    
    <FormGroup 
      :label="config.fields.password.label"
      fieldId="login-password"
      :required="config.fields.password.required"
      :error="errors.password"
    >
      <Input
        id="login-password"
        v-model="formData.password"
        :type="config.fields.password.type"
        :placeholder="config.fields.password.placeholder"
        :required="config.fields.password.required"
        :disabled="isLoading"
        :hasError="!!errors.password"
        :autocomplete="config.fields.password.autocomplete"
        @blur="validateField('password')"
      />
    </FormGroup>
    
    <ErrorMessage 
      :message="submitError"
      :show="!!submitError"
      variant="error"
    />
    
    <div :class="$style.actions">
      <Button 
        type="submit" 
        variant="primary"
        :disabled="isLoading || !canSubmit"
        :class="$style.submitButton"
      >
        {{ isLoading ? config.submitButton.loadingText : config.submitButton.text }}
      </Button>
    </div>
  </form>
</template>

<script setup lang="ts">
import FormGroup from '@/shared/ui/FormGroup/';
import Input from '@/shared/ui/Input/';
import Button from '@/shared/ui/Button/';
import ErrorMessage from '@/shared/ui/ErrorMessage/';
import { useLoginForm } from '../../model/use-login-form';
import { LOGIN_FORM_CONFIG } from '@/entities/auth/model/login-form';

const config = LOGIN_FORM_CONFIG;

const {
  formData,
  errors,
  isLoading,
  submitError,
  canSubmit,
  validateField,
  submitForm
} = useLoginForm();

function handleSubmit(): void {
  submitForm();
}
</script>

<style module lang="scss">
@use './styles.module.scss';
</style>