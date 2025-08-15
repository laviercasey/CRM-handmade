interface SocialLink {
  id: string
  name: string
  icon: string
  url: string
  color: string
}

interface ContactLink {
  id: string
  name: string
  icon: string
  url: string
  text: string
  type: string
}

export const socialLinks: SocialLink[] = [
  {
    id: 'vk',
    name: 'ВКонтакте',
    icon: 'fab fa-vk',
    url: 'https://vk.com/tvoycrm',
    color: '#4C75A3'
  },
  {
    id: 'telegram',
    name: 'Telegram',
    icon: 'fab fa-telegram',
    url: 'https://t.me/tvoycrm',
    color: '#0088CC'
  },
  {
    id: 'instagram',
    name: 'Instagram',
    icon: 'fab fa-instagram',
    url: 'https://instagram.com/tvoycrm',
    color: '#E4405F'
  },
  {
    id: 'youtube',
    name: 'YouTube',
    icon: 'fab fa-youtube',
    url: 'https://youtube.com/@tvoycrm',
    color: '#FF0000'
  }
]

export const contactLinks: ContactLink[] = [
  {
    id: 'email',
    name: 'Email',
    icon: 'fas fa-envelope',
    url: 'mailto:info@tvoycrm.ru',
    text: 'info@tvoycrm.ru',
    type: 'email'
  },
  {
    id: 'telegram-contact',
    name: 'Telegram',
    icon: 'fab fa-telegram',
    url: 'https://t.me/tvoycrm',
    text: '@tvoycrm',
    type: 'social'
  },
  {
    id: 'phone',
    name: 'Телефон',
    icon: 'fas fa-phone',
    url: 'tel:+79001234567',
    text: '+7 (900) 123-45-67',
    type: 'phone'
  }
]