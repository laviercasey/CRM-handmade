export const LINK_TYPES = {
  ROUTER: 'router',
  EXTERNAL: 'external',
  ACTION: 'action',
  EMAIL: 'email',
  PHONE: 'phone'
} as const

export type LinkType = typeof LINK_TYPES[keyof typeof LINK_TYPES]

export const LINK_VARIANTS = {
  DEFAULT: 'default',
  CONTACT: 'contact',
  SOCIAL: 'social',
  LEGAL: 'legal'
} as const

export type LinkVariant = typeof LINK_VARIANTS[keyof typeof LINK_VARIANTS]

export const LINK_STATES = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  DISABLED: 'disabled',
  LOADING: 'loading'
} as const

export type LinkState = typeof LINK_STATES[keyof typeof LINK_STATES]