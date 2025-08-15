interface Step {
  id: number
  number: number
  title: string
  description: string
}

export const steps: Step[] = [
  {
    id: 1,
    number: 1,
    title: 'Регистрация',
    description: 'Создайте аккаунт за несколько минут и получите доступ ко всем функциям платформы.'
  },
  {
    id: 2,
    number: 2,
    title: 'Добавление товаров',
    description: 'Создайте карточки своих изделий с фотографиями, описаниями и ценами.'
  },
  {
    id: 3,
    number: 3,
    title: 'Получение заказов',
    description: 'Поделитесь своей формой заказа с клиентами или добавляйте заказы самостоятельно.'
  },
  {
    id: 4,
    number: 4,
    title: 'Управление и аналитика',
    description: 'Отслеживайте статусы заказов, анализируйте продажи и развивайте свой бизнес.'
  }
]