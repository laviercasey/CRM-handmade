import { LINK_TYPES } from './types'

interface FooterLink {
  id: string
  text: string
  to: string
  type: string
  requiresAuth: boolean
  requiresGuest?: boolean
  action?: string
}

interface FooterLinkGroup {
  id: string
  title: string
  links: FooterLink[]
}

export const footerLinkGroups: FooterLinkGroup[] = [
  {
    id: 'about',
    title: 'О проекте',
    links: [
      {
        id: 'about-us',
        text: 'О нас',
        to: '/',
        type: LINK_TYPES.ROUTER,
        requiresAuth: false
      },
      {
        id: 'faq',
        text: 'Часто задаваемые вопросы',
        to: '/#faq',
        type: LINK_TYPES.ROUTER,
        requiresAuth: false
      },
      {
        id: 'feedback',
        text: 'Обратная связь',
        to: '/#feedback',
        type: LINK_TYPES.ROUTER,
        requiresAuth: false
      }
    ]
  },
  {
    id: 'features',
    title: 'Возможности',
    links: [
      {
        id: 'dashboard',
        text: 'Личный кабинет',
        to: '/dashboard',
        type: LINK_TYPES.ROUTER,
        requiresAuth: true
      },
      {
        id: 'profile',
        text: 'Настройки профиля',
        to: '/dashboard/profile',
        type: LINK_TYPES.ROUTER,
        requiresAuth: true
      },
      {
        id: 'calculator',
        text: 'Калькулятор стоимости',
        to: '#calculator',
        type: LINK_TYPES.ACTION,
        action: 'showCalculator',
        requiresAuth: false
      }
    ]
  },
  {
    id: 'documentation',
    title: 'Документация',
    links: [
      {
        id: 'api-docs',
        text: 'API документация',
        to: '/api-docs',
        type: LINK_TYPES.ROUTER,
        requiresAuth: false
      },
      {
        id: 'terms',
        text: 'Условия использования',
        to: '#terms',
        type: LINK_TYPES.ACTION,
        action: 'showTerms',
        requiresAuth: false
      },
      {
        id: 'privacy',
        text: 'Политика конфиденциальности',
        to: '#privacy',
        type: LINK_TYPES.ACTION,
        action: 'showPrivacy',
        requiresAuth: false
      }
    ]
  }
]

export const legalLinks: FooterLink[] = [
  {
    id: 'terms-bottom',
    text: 'Условия',
    to: '#terms',
    type: LINK_TYPES.ACTION,
    action: 'showTerms',
    requiresAuth: false
  },
  {
    id: 'privacy-bottom',
    text: 'Конфиденциальность',
    to: '#privacy',
    type: LINK_TYPES.ACTION,
    action: 'showPrivacy',
    requiresAuth: false
  },
  {
    id: 'cookies',
    text: 'Cookies',
    to: '#cookies',
    type: LINK_TYPES.ACTION,
    action: 'showCookies',
    requiresAuth: false
  }
]