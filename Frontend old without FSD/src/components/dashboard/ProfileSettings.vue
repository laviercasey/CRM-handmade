<template>
    <div class="profile-settings">
      <h2>Настройки профиля</h2>
      
      <div v-if="loading" class="loading-state">
        <div class="spinner"></div>
        <p>Загрузка данных...</p>
      </div>
      
      <div v-else class="settings-content">
        <div class="profile-image-container">
          <div 
            class="profile-image"
            @click="triggerFileInput"
          >
            <img 
              v-if="imagePreview" 
              :src="imagePreview" 
              alt="Аватар"
            >
            <div v-else class="profile-initials">
              {{ userInitials }}
            </div>
            
            <div class="image-overlay">
              <i class="fas fa-camera"></i>
            </div>
          </div>
          
          <input 
            type="file"
            ref="fileInput"
            @change="handleFileChange"
            accept="image/*"
            style="display: none"
          >
          <button class="image-delete-button" @click="deleteAvatar">Удалить аватар</button>
        </div>
        
        <form @submit.prevent="saveProfile" class="profile-form">
          <div class="form-row">
            <div class="form-group">
              <label for="username">Логин</label>
              <input 
                type="text" 
                id="username" 
                v-model="profileForm.username"
                readonly
                disabled
              >
              <div class="field-note">Логин нельзя изменить</div>
            </div>
            
            <div class="form-group">
              <label for="email">Email</label>
              <input 
                type="email" 
                id="email" 
                v-model="profileForm.email"
                required
              >
            </div>
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label for="first_name">Имя</label>
              <input 
                type="text" 
                id="first_name" 
                v-model="profileForm.first_name"
                required
              >
            </div>
            
            <div class="form-group">
              <label for="second_name">Фамилия</label>
              <input 
                type="text" 
                id="second_name" 
                v-model="profileForm.second_name"
                required
              >
            </div>
          </div>
          
          <div class="form-group">
            <label for="description">О себе</label>
            <textarea 
              id="description" 
              v-model="profileForm.description"
              placeholder="Расскажите о себе и своих работах"
              rows="4"
            ></textarea>
            <div class="field-note">
              Это описание будет отображаться на странице формы заказа для ваших клиентов
            </div>
          </div>
          
          <div class="form-actions">
            <button 
              type="submit" 
              class="btn-primary"
              :disabled="isSubmitting"
            >
              {{ isSubmitting ? 'Сохранение...' : 'Сохранить изменения' }}
            </button>
          </div>
        </form>
        
        <div class="settings-section">
          <h3>Сменить пароль</h3>
          <form @submit.prevent="changePassword" class="password-form">
            <div class="form-group">
              <label for="current_password">Текущий пароль</label>
              <input 
                type="password" 
                id="current_password" 
                v-model="passwordForm.currentPassword"
                required
              >
            </div>
            
            <div class="form-row">
              <div class="form-group">
                <label for="new_password">Новый пароль</label>
                <input 
                  type="password" 
                  id="new_password" 
                  v-model="passwordForm.newPassword"
                  required
                  minlength="8"
                >
              </div>
              
              <div class="form-group">
                <label for="confirm_password">Подтверждение пароля</label>
                <input 
                  type="password" 
                  id="confirm_password" 
                  v-model="passwordForm.confirmPassword"
                  required
                >
              </div>
            </div>
            
            <div v-if="passwordError" class="error-message">
              {{ passwordError }}
            </div>
            
            <div class="form-actions">
              <button 
                type="submit" 
                class="btn-secondary"
                :disabled="isChangingPassword"
              >
                {{ isChangingPassword ? 'Изменение...' : 'Изменить пароль' }}
              </button>
            </div>
          </form>
        </div>
        
        <div class="settings-section danger-zone">
          <h3>Опасная зона</h3>
          <p>Будьте осторожны с действиями в этом разделе — они могут привести к необратимым последствиям.</p>
          
          <div class="danger-actions">
            <button 
              class="btn-danger"
              @click="showDeleteConfirmation = true"
            >
              Удалить аккаунт
            </button>
          </div>
        </div>
      </div>
      
      
      <div v-if="showDeleteConfirmation" class="modal-overlay" @click="showDeleteConfirmation = false">
        <div class="modal-content delete-confirmation" @click.stop>
          <div class="modal-header">
            <h2>Удаление аккаунта</h2>
            <button class="close-button" @click="showDeleteConfirmation = false">&times;</button>
          </div>
          
          <div class="modal-body">
            <div class="warning-icon">
              <i class="fas fa-exclamation-triangle"></i>
            </div>
            <p>Вы уверены, что хотите удалить свой аккаунт? Это действие <strong>необратимо</strong>.</p>
            <p>Вся ваша информация, включая товары и заявки, будет <strong>удалена навсегда</strong>.</p>
            
            <div class="confirmation-input">
              <label for="delete_confirmation">Для подтверждения введите "удалить мой аккаунт"</label>
              <input 
                type="text" 
                id="delete_confirmation" 
                v-model="deleteConfirmationText"
                placeholder="удалить мой аккаунт"
              >
            </div>
          </div>
          
          <div class="modal-footer">
            <button 
              class="btn-secondary"
              @click="showDeleteConfirmation = false"
            >
              Отмена
            </button>
            <button 
              class="btn-danger"
              :disabled="deleteConfirmationText !== 'удалить мой аккаунт' || isDeleting"
              @click="deleteAccount"
            >
              {{ isDeleting ? 'Удаление...' : 'Удалить аккаунт' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, reactive, computed, onBeforeUnmount } from 'vue';
  import { useStore } from 'vuex';
  import { useRouter } from 'vue-router';
  
  const store = useStore();
  const router = useRouter();
  
  const loading = ref(true);
  const profileForm = reactive({
    username: '',
    email: '',
    first_name: '',
    second_name: '',
    description: '',
    avatar: ''
  });
  
  const passwordForm = reactive({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const imageFile = ref(null);
  const imagePreview = ref(null);
  const isSubmitting = ref(false);
  const isChangingPassword = ref(false);
  const passwordError = ref(null);
  const showDeleteConfirmation = ref(false);
  const deleteConfirmationText = ref('');
  const isDeleting = ref(false);
  const fileInput = ref(null);
  
  const user = computed(() => store.getters['auth/user']);
  
  const userInitials = computed(() => {
    if (!profileForm.first_name && !profileForm.second_name) {
      return '?';
    }
    
    const firstInitial = profileForm.first_name ? profileForm.first_name.charAt(0) : '';
    const secondInitial = profileForm.second_name ? profileForm.second_name.charAt(0) : '';
    
    return `${firstInitial}${secondInitial}`;
  });
  
  function loadUserData() {
    loading.value = true;
    
      try {
      if (user.value) {
        profileForm.username = user.value.username;
        profileForm.email = user.value.email;
        profileForm.first_name = user.value.first_name;
        profileForm.second_name = user.value.second_name;
        profileForm.description = user.value.description || '';
        
        if (user.value.avatar) {
        imagePreview.value = `${import.meta.env.VITE_API_URL}/uploads/avatars/${user.value.avatar}`;
      }
      }
    } catch (error) {
      console.error('Ошибка загрузки данных пользователя:', error);
    } finally {
      loading.value = false;
    }
  }
  
  function triggerFileInput() {
    fileInput.value.click();
  }
  
  function handleFileChange(event) {
    const file = event.target.files[0];
    
    if (!file) return;
    
    if (!file.type.match('image.*')) {
      alert('Пожалуйста, выберите изображение');
      return;
    }
    
    if (file.size > 2 * 1024 * 1024) {
      alert('Размер изображения не должен превышать 2 МБ');
      return;
    }
    
    imageFile.value = file;
    
    imagePreview.value = URL.createObjectURL(file);
  }
  
  async function deleteAvatar() {
    imagePreview.value = null
    profileForm.avatar = null
  }
  
  async function saveProfile() {
    isSubmitting.value = true;
    
     try {
      if (imageFile.value) {    
        const formData = new FormData();
        formData.append('file', imageFile.value); 
        
        const response = await fetch(`${import.meta.env.VITE_API_URL}/upload/avatar`, {
          method: 'POST',
             body: formData,
          headers: {
            'Authorization': `Bearer ${store.getters['auth/accessToken']}`
          }
        });
        
        if (!response.ok) {
          throw new Error('Не удалось загрузить изображение');
        }
        
        const data = await response.json();
        imagePreview.value = `${import.meta.env.VITE_API_URL}/uploads/avatars/${data.filename}`;
        profileForm.avatar = data.filename
      }
      
      await store.dispatch('auth/updateProfile', profileForm);
      
      store.dispatch('notifications/showSuccess', {
        title: 'Профиль обновлен',
        text: 'Ваши данные успешно сохранены'
      });
    } catch (error) {
      console.error('Ошибка сохранения профиля:', error);
      
      store.dispatch('notifications/showError', {
        title: 'Ошибка',
        text: 'Не удалось сохранить данные профиля'
      });
    } finally {
      isSubmitting.value = false;
    }
  }

  
  async function changePassword() {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      passwordError.value = 'Пароли не совпадают';
      return;
    }
    
    if (passwordForm.newPassword.length < 8) {
      passwordError.value = 'Пароль должен содержать не менее 8 символов';
      return;
    }
    
    passwordError.value = null;
    isChangingPassword.value = true;
    
    try {
      await store.dispatch('auth/changePassword', {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword
      });
      
      passwordForm.currentPassword = '';
      passwordForm.newPassword = '';
      passwordForm.confirmPassword = '';
      
      store.dispatch('notifications/showSuccess', {
        title: 'Пароль изменен',
        text: 'Ваш пароль успешно изменен'
      });
    } catch (error) {
      console.error('Ошибка изменения пароля:', error);
      
      if (error.response && error.response.status === 401) {
        passwordError.value = 'Неверный текущий пароль';
      } else {
        passwordError.value = 'Не удалось изменить пароль';
      }
    } finally {
      isChangingPassword.value = false;
    }
  }
 
  async function deleteAccount() {
    isDeleting.value = true;
    
    try {
      await store.dispatch('auth/deleteAccount');
      
      store.dispatch('auth/logout');
      router.push('/');
      
      store.dispatch('notifications/showInfo', {
        title: 'Аккаунт удален',
        text: 'Ваш аккаунт был успешно удален'
      });
    } catch (error) {
      console.error('Ошибка удаления аккаунта:', error);
      
      store.dispatch('notifications/showError', {
        title: 'Ошибка',
        text: 'Не удалось удалить аккаунт'
      });
    } finally {
      isDeleting.value = false;
      showDeleteConfirmation.value = false;
    }
  }
  
  onBeforeUnmount(() => {
    if (imagePreview.value && !imagePreview.value.startsWith('http')) {
      URL.revokeObjectURL(imagePreview.value);
    }
  });
  
  loadUserData();
  </script>
    
    /* ProfileSettings.vue */
    <style scoped>
    .profile-settings {
      padding-bottom: 40px;
    }
    
    h2 {
      margin-bottom: 30px;
      font-size: 24px;
      color: #333;
    }
    
    h3 {
      margin-top: 0;
      margin-bottom: 20px;
      font-size: 18px;
      color: #333;
    }
    
    .loading-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 60px 0;
      text-align: center;
    }
    
    .spinner {
      width: 40px;
      height: 40px;
      border: 4px solid rgba(108, 92, 231, 0.2);
      border-radius: 50%;
      border-top-color: #6c5ce7;
      animation: spin 1s linear infinite;
      margin-bottom: 15px;
    }
    
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    
    .settings-content {
      display: flex;
      flex-direction: column;
      gap: 30px;
    }
    
    .profile-image-container {
      display: flex;
      align-items: center;
      flex-direction: column;
      justify-content: center;
      margin-bottom: 20px;
    }
    
    .profile-image {
      width: 120px;
      height: 120px;
      border-radius: 50%;
      overflow: hidden;
      position: relative;
      cursor: pointer;
      background-color: #f5f5f5;
    }
    
    .profile-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    
    .profile-initials {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 36px;
      font-weight: bold;
      color: white;
      background-color: #6c5ce7;
    }
    
    .image-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 24px;
      opacity: 0;
      transition: opacity 0.3s;
    }
    
    .profile-image:hover .image-overlay {
      opacity: 1;
    }
    
    .profile-form, .password-form {
      background-color: #fff;
      border-radius: 8px;
      padding: 30px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    }
    
    .form-row {
      display: flex;
      gap: 20px;
      margin-bottom: 20px;
      flex-wrap: wrap;
    }
    
    .form-row .form-group {
      flex: 1;
      min-width: 250px;
    }
    
    .form-group {
      margin-bottom: 20px;
    }
    
    label {
      display: block;
      margin-bottom: 8px;
      font-weight: 500;
      color: #555;
    }
    
    input, textarea {
      width: 100%;
      padding: 12px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 16px;
    }
    
    input:disabled {
      background-color: #f5f5f5;
      cursor: not-allowed;
    }
    
    textarea {
      resize: vertical;
    }
    
    .field-note {
      margin-top: 5px;
      font-size: 12px;
      color: #666;
    }
    
    .form-actions {
      display: flex;
      justify-content: flex-end;
      flex-wrap: wrap;
      gap: 10px;
    }
    
    .settings-section {
      background-color: #fff;
      border-radius: 8px;
      padding: 30px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    }
    
    .danger-zone {
      background-color: #fff8f8;
      border: 1px solid #ffcdd2;
    }
    
    .danger-zone h3 {
      color: #c62828;
    }
    
    .danger-zone p {
      margin-bottom: 20px;
      color: #666;
    }
    
    .danger-actions {
      display: flex;
      justify-content: flex-end;
    }
    
    .error-message {
      color: #f44336;
      margin-bottom: 15px;
      font-size: 14px;
    }
    
    .btn-primary, .btn-secondary, .btn-danger {
      padding: 10px 20px;
      border-radius: 4px;
      font-size: 16px;
      cursor: pointer;
      transition: background-color 0.3s;
    }
    
    .btn-primary {
      background-color: #6c5ce7;
      color: white;
      border: none;
    }
    
    .btn-primary:hover {
      background-color: #5649c0;
    }
    
    .btn-primary:disabled, .btn-secondary:disabled, .btn-danger:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
    
    .btn-secondary {
      background-color: #f5f5f5;
      color: #333;
      border: 1px solid #ddd;
    }
    
    .btn-secondary:hover {
      background-color: #e9e9e9;
    }
    
    .btn-danger {
      background-color: #f44336;
      color: white;
      border: none;
    }
    
    .btn-danger:hover {
      background-color: #e53935;
    }
    
    /* Модальное окно подтверждения удаления */
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    }
    
    .modal-content {
      background-color: white;
      border-radius: 8px;
      width: 90%;
      max-width: 500px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
    }
    
    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px;
      border-bottom: 1px solid #eee;
    }
    
    .modal-header h2 {
      margin: 0;
      font-size: 1.5rem;
      color: #c62828;
    }
    
    .close-button {
      background: none;
      border: none;
      font-size: 1.5rem;
      cursor: pointer;
      color: #666;
    }
    
    .modal-body {
      padding: 20px;
    }
    
    .warning-icon {
      font-size: 48px;
      color: #f44336;
      text-align: center;
      margin-bottom: 20px;
    }
    
    .confirmation-input {
      margin-top: 20px;
    }
    
    .modal-footer {
      padding: 15px 20px;
      border-top: 1px solid #eee;
      display: flex;
      justify-content: flex-end;
      gap: 10px;
      flex-wrap: wrap;
    }
    
    .image-delete-button {
      display: block;
      padding: 8px 15px;
      margin-top: 10px;
      background-color: #f0f0f0;
      color: #333;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      transition: background-color 0.3s;
    }
    
    .image-delete-button:hover {
      background-color: #e0e0e0;
    }
    
    @media (max-width: 992px) {
      .profile-form, .password-form, .settings-section {
        padding: 20px;
      }
    }
    
    @media (max-width: 768px) {
      .form-row {
        flex-direction: column;
        gap: 0;
      }
      
      .form-row .form-group {
        min-width: 100%;
      }
      
      .form-actions {
        justify-content: center;
      }
      
      .danger-actions {
        justify-content: center;
      }
      
      .modal-footer {
        flex-direction: column;
      }
      
      .modal-footer button {
        width: 100%;
      }
    }
    
    @media (max-width: 576px) {
      h2 {
        font-size: 20px;
        text-align: center;
      }
      
      h3 {
        font-size: 16px;
      }
      
      .profile-form, .password-form, .settings-section {
        padding: 15px;
      }
      
      .profile-image {
        width: 100px;
        height: 100px;
      }
      
      .profile-initials {
        font-size: 30px;
      }
      
      input, textarea {
        padding: 10px;
        font-size: 14px;
      }
      
      .btn-primary, .btn-secondary, .btn-danger {
        padding: 8px 16px;
        font-size: 14px;
        width: 100%;
      }
      
      .modal-content {
        width: 95%;
      }
      
      .modal-header h2 {
        font-size: 18px;
      }
    }
</style>
    