interface NavigationItem {
  path: string
  label: string
  icon: string
  requiresAuth: boolean
  requiresGuest: boolean
}

interface NavigationConfig {
  items: NavigationItem[]
  mobileItems: NavigationItem[]
}

export const navigationConfig: NavigationConfig = {
  items: [
    {
      path: '/',
      label: 'О проекте',
      icon: 'fas fa-home',
      requiresAuth: false,
      requiresGuest: false
    },
    {
      path: '/dashboard',
      label: 'Личный кабинет',
      icon: 'fas fa-tachometer-alt',
      requiresAuth: true,
      requiresGuest: false
    },
    {
      path: '/features',
      label: 'Возможности',
      icon: 'fas fa-star',
      requiresAuth: false,
      requiresGuest: false
    },
    {
      path: '/pricing',
      label: 'Тарифы',
      icon: 'fas fa-tags',
      requiresAuth: false,
      requiresGuest: false
    }
  ],
  
  mobileItems: [
    {
      path: '/help',
      label: 'Помощь',
      icon: 'fas fa-question-circle',
      requiresAuth: false,
      requiresGuest: false
    },
    {
      path: '/contact',
      label: 'Контакты',
      icon: 'fas fa-envelope',
      requiresAuth: false,
      requiresGuest: false
    }
  ]
}