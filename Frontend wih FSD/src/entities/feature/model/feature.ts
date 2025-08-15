interface Feature {
  id: number
  icon: string
  title: string
  description: string
}

export const features: Feature[] = [
  {
    id: 1,
    icon: 'fas fa-clipboard-list',
    title: 'Управление заказами',
    description: 'Отслеживайте все заказы в одном месте, меняйте их статусы и храните историю взаимодействия с клиентами.'
  },
  {
    id: 2,
    icon: 'fas fa-box',
    title: 'Каталог товаров',
    description: 'Создавайте карточки товаров с фотографиями, описаниями и ценами. Управляйте ассортиментом в удобном интерфейсе.'
  },
  {
    id: 3,
    icon: 'fas fa-calculator',
    title: 'Калькулятор стоимости',
    description: 'Рассчитывайте себестоимость и итоговую цену изделий с учетом материалов, времени работы и наценки.'
  },
  {
    id: 4,
    icon: 'fas fa-chart-bar',
    title: 'Статистика и аналитика',
    description: 'Анализируйте свои продажи, отслеживайте популярные товары и оценивайте эффективность работы.'
  }
]