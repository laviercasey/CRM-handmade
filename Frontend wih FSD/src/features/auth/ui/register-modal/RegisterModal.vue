<template>
  <div :class="$style.modalOverlay" @click="close">
    <div :class="$style.modalContent" @click.stop>
      <h2>Регистрация</h2>
      <form @submit.prevent="handleSubmit">
        <div :class="$style.formGroup">
          <label>Имя:</label>
          <input v-model="firstName" type="text" required />
        </div>
        <div :class="$style.formGroup">
          <label>Фамилия:</label>
          <input v-model="lastName" type="text" required />
        </div>
        <div :class="$style.formGroup">
          <label>Email:</label>
          <input v-model="email" type="email" required />
        </div>
        <div :class="$style.formGroup">
          <label>Пароль:</label>
          <input v-model="password" type="password" required />
        </div>
        <div :class="$style.formActions">
          <button type="submit" :class="$style.btnPrimary">Зарегистрироваться</button>
          <button type="button" @click="close">Отмена</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useStore } from 'vuex';

interface RegisterData {
  first_name: string;
  second_name: string;
  email: string;
  password: string;
}

const store = useStore();
const firstName = ref<string>('');
const lastName = ref<string>('');
const email = ref<string>('');
const password = ref<string>('');

function close(): void {
  store.commit('auth/SET_SHOW_REGISTER_MODAL', false);
}

async function handleSubmit(): Promise<void> {
  try {
    await store.dispatch('auth/register', {
      first_name: firstName.value,
      second_name: lastName.value,
      email: email.value,
      password: password.value
    } as RegisterData);
  } catch (error) {
    console.error('Registration error:', error);
  }
}
</script>

<style module lang="scss">
@use './styles.module.scss';
</style>