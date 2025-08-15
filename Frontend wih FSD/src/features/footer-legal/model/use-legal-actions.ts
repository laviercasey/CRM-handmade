import { showLegalModal } from '@/shared/utils/modal'

interface LegalActionsComposable {
  handleLegalAction: (action: string) => void
}

export function useLegalActions(): LegalActionsComposable {
  function handleLegalAction(action: string): void {
    switch (action) {
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
        console.warn(`Unknown legal action: ${action}`)
    }
  }
  
  return {
    handleLegalAction
  }
}