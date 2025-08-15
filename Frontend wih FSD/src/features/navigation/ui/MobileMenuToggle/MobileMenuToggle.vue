<template>
  <header :class="$style.header">
    <Container>
      <div :class="$style.content">
        <!-- Логотип -->
        <div :class="$style.logo">
          <Logo />
        </div>
        
        <!-- Основная навигация (десктоп) -->
        <div :class="$style.desktopNav">
          <MainNavigation :isAuthenticated="isAuthenticated" />
        </div>
        
        <!-- Меню аутентификации (десктоп) -->
        <div :class="$style.desktopAuth">
          <AuthButtons 
            v-if="!isAuthenticated"
            @showLogin="showLoginModal"
            @showRegister="showRegisterModal"
          />
          <UserDropdown 
            v-else
            :user="user"
            @goToProfile="goToProfile"
            @logout="logout"
          />
        </div>
        
        <!-- Кнопка мобильного меню -->
        <div :class="$style.mobileToggle">
          <MobileMenuToggle 
            :isActive="false"
            @toggle="$emit('toggleMobileMenu')"
          />
        </div>
      </div>
    </Container>
  </header>
</template>

<script setup>
import Container from '@/shared/ui/Container/index.vue'
import Logo from '@/shared/ui/Logo/Logo.vue'
import MainNavigation from '@/features/navigation/ui/MainNavigation/MainNavigation.vue'
import MobileMenuToggle from '@/features/navigation/ui/MobileMenuToggle/MobileMenuToggle.vue'
import AuthButtons from '@/features/auth-menu/ui/AuthButtons/AuthButtons.vue'
import UserDropdown from '@/features/auth-menu/ui/UserDropdown/UserDropdown.vue'
import { useAuthMenu } from '@/features/auth-menu/model/use-auth-menu'

defineEmits(['toggleMobileMenu'])

const {
  isAuthenticated,
  user,
  showLoginModal,
  showRegisterModal,
  goToProfile,
  logout
} = useAuthMenu()
</script>

<style module>
.header {
  background-color: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  padding: 15px 0;
  position: sticky;
  top: 0;
  z-index: 100;
}

.content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
}

.logo {
  flex-shrink: 0;
}

.desktopNav {
  flex: 1;
  display: flex;
  justify-content: center;
}

.desktopAuth {
  flex-shrink: 0;
}

.mobileToggle {
  display: none;
}

@media (max-width: 1024px) {
  .desktopNav,
  .desktopAuth {
    display: none;
  }
  
  .mobileToggle {
    display: block;
  }
}
</style>