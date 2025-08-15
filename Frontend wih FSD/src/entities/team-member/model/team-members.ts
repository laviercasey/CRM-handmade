interface SocialLink {
  href: string
  icon: string
}

interface TeamMember {
  id: number
  name: string
  role: string
  photo: string
  description: string
  social: SocialLink[]
}

interface Founder extends TeamMember {
  id: string
  quote: string
}

export const founder: Founder = {
  id: 'founder',
  name: 'Анастасия Смирнова',
  role: 'Основатель и CEO',
  photo: '@/assets/founder.jpg',
  description: 'Будучи хендмейдером с многолетним опытом, Анастасия столкнулась с проблемой управления заказами и решила создать удобный инструмент, который поможет творческим людям сосредоточиться на своем ремесле, а не на административных задачах.',
  social: [
    { href: '#', icon: 'fab fa-linkedin' },
    { href: '#', icon: 'fab fa-telegram' },
    { href: '#', icon: 'fab fa-instagram' }
  ],
  quote: 'Я верю, что творческие люди должны тратить время на то, что они любят — создавать прекрасное, а не бороться с таблицами и записями заказов.'
}

export const teamMembers: TeamMember[] = [
  {
    id: 1,
    name: 'Александр Петров',
    role: 'Ведущий разработчик',
    photo: '@/assets/developer.jpg',
    description: 'Опытный разработчик с фокусом на создании интуитивно понятных и производительных веб-приложений.',
    social: [
      { href: '#', icon: 'fab fa-github' },
      { href: '#', icon: 'fab fa-linkedin' }
    ]
  },
  {
    id: 2,
    name: 'Елена Иванова',
    role: 'UI/UX дизайнер',
    photo: '@/assets/designer.jpg',
    description: 'Создает элегантные и функциональные интерфейсы, фокусируясь на потребностях пользователей и удобстве использования.',
    social: [
      { href: '#', icon: 'fab fa-behance' },
      { href: '#', icon: 'fab fa-dribbble' }
    ]
  },
  {
    id: 3,
    name: 'Михаил Соколов',
    role: 'Маркетолог',
    photo: '@/assets/marketing.jpg',
    description: 'Помогает творческим людям узнать о ТвойCRM и развивает сообщество пользователей платформы.',
    social: [
      { href: '#', icon: 'fab fa-twitter' },
      { href: '#', icon: 'fab fa-linkedin' }
    ]
  },
  {
    id: 4,
    name: 'Ольга Новикова',
    role: 'Служба поддержки',
    photo: '@/assets/support.jpg',
    description: 'Всегда готова помочь пользователям разобраться с функциями платформы и решить любые возникающие вопросы.',
    social: [
      { href: '#', icon: 'fab fa-telegram' },
      { href: '#', icon: 'fas fa-envelope' }
    ]
  }
]