import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { showLegalModal } from '@/shared/utils/modal'

interface FooterLink {
  id: string
  text: string
  to: string
  action?: string
}

interface FooterNavigationComposable {
  handleLinkAction: (action: string, link: FooterLink) => void
}

export function useFooterNavigation(): FooterNavigationComposable {
  const store = useStore()
  const router = useRouter()
  
  function handleLinkAction(action: string, link: FooterLink): void {
    switch (action) {
      case 'showCalculator':
        handleCalculatorClick()
        break
      case 'showTerms':
        showLegalModal('terms')
        break
      case 'showPrivacy':
        showLegalModal('privacy')
        break
      case 'showCookies':
        showLegalModal('cookies')
        break
      default:
        console.warn(`Unknown action: ${action}`)
    }
  }
  
  function handleCalculatorClick(): void {
    if (store.getters['auth/isAuthenticated']) {
      router.push('/dashboard')
      if (store.hasModule && store.hasModule('dashboard')) {
        store.commit('dashboard/SET_ACTIVE_TAB', 'calculations')
      }
    } else {
      store.commit('auth/SET_SHOW_LOGIN_MODAL', true)
    }
  }
  
  return {
    handleLinkAction
  }
}