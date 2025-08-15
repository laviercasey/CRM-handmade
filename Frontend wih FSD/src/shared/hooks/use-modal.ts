import { ref, watch, nextTick, Ref } from 'vue';

export function useModal(initialShow: boolean = false) {
  const isVisible: Ref<boolean> = ref(initialShow);
  const isAnimating: Ref<boolean> = ref(false);
  
  function show(): void {
    if (isVisible.value) return;
    
    isVisible.value = true;
    isAnimating.value = true;
    
    nextTick(() => {
      setTimeout(() => {
        isAnimating.value = false;
      }, 300);
    });
  }
  
  function hide(): void {
    if (!isVisible.value) return;
    
    isAnimating.value = true;
    
    setTimeout(() => {
      isVisible.value = false;
      isAnimating.value = false;
    }, 300);
  }
  
  function toggle(): void {
    if (isVisible.value) {
      hide();
    } else {
      show();
    }
  }
  
  function handleEscape(event: KeyboardEvent): void {
    if (event.key === 'Escape' && isVisible.value) {
      hide();
    }
  }
  
  function handleOverlayClick(event: MouseEvent, closeOnOverlayClick: boolean = true): void {
    if (closeOnOverlayClick && event.target === event.currentTarget) {
      hide();
    }
  }
  
  watch(isVisible, (newValue: boolean) => {
    if (newValue) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  });
  
  return {
    isVisible,
    isAnimating,
    show,
    hide,
    toggle,
    handleEscape,
    handleOverlayClick
  };
}