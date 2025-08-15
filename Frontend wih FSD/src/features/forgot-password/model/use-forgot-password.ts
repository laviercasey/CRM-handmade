import { ref, Ref } from 'vue'
import { showFeatureStub, showInfoModal } from '@/shared/lib/utils/modal'

interface ForgotPasswordComposable {
  isLoading: Ref<boolean>
  isModalVisible: Ref<boolean>
  handleForgotPassword: () => void
  showForgotPasswordModal: () => void
  hideForgotPasswordModal: () => void
  sendResetEmail: (email: string) => Promise<void>
}

export function useForgotPassword(): ForgotPasswordComposable {
  const isLoading = ref<boolean>(false)
  const isModalVisible = ref<boolean>(false)
  
  function handleForgotPassword(): void {
    showFeatureStub('Восстановление пароля')
  }
  
  function showForgotPasswordModal(): void {
    isModalVisible.value = true
  }
  
  function hideForgotPasswordModal(): void {
    isModalVisible.value = false
  }
  
  async function sendResetEmail(email: string): Promise<void> {
    if (isLoading.value) return
    
    isLoading.value = true
    
    try {
      showInfoModal(
        'Email отправлен',
        'Инструкции по восстановлению пароля отправлены на ваш email.'
      )
      
      hideForgotPasswordModal()
    } catch (error) {
      console.error('Error sending reset email:', error)
      showInfoModal(
        'Ошибка',
        'Не удалось отправить email. Попробуйте позже.'
      )
    } finally {
      isLoading.value = false
    }
  }
  
  return {
    isLoading,
    isModalVisible,
    handleForgotPassword,
    showForgotPasswordModal,
    hideForgotPasswordModal,
    sendResetEmail
  }
}