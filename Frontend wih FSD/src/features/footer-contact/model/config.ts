interface Contact {
  type: string
  label: string
  value: string
  icon: string
  primary?: boolean
  url?: string
}

interface WorkingHours {
  enabled: boolean
  schedule: string
  timezone: string
}

interface AdditionalInfo {
  supportEmail: string
  salesEmail: string
  address: string
}

interface ContactConfig {
  title: string
  contacts: Contact[]
  workingHours: WorkingHours
  additionalInfo: AdditionalInfo
}

export const contactConfig: ContactConfig = {
  title: 'Связаться с нами',
  
  contacts: [
    {
      type: 'email',
      label: 'Email',
      value: 'info@tvoycrm.ru',
      icon: 'fas fa-envelope',
      primary: true
    },
    {
      type: 'telegram',
      label: 'Telegram',
      value: '@tvoycrm',
      icon: 'fab fa-telegram',
      url: 'https://t.me/tvoycrm'
    },
    {
      type: 'phone',
      label: 'Телефон',
      value: '+7 (900) 123-45-67',
      icon: 'fas fa-phone',
      url: 'tel:+79001234567'
    }
  ],
  
  workingHours: {
    enabled: false,
    schedule: 'Пн-Пт: 9:00-18:00 МСК',
    timezone: 'Europe/Moscow'
  },
  
  additionalInfo: {
    supportEmail: 'support@tvoycrm.ru',
    salesEmail: 'sales@tvoycrm.ru',
    address: 'Россия, Москва'
  }
}