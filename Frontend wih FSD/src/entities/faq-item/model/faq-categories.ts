interface FaqCategory {
  id: string
  name: string
  icon: string
}

export const faqCategories: FaqCategory[] = [
  { id: 'all', name: 'Все вопросы', icon: 'fas fa-border-all' },
  { id: 'general', name: 'Общие вопросы', icon: 'fas fa-info-circle' },
  { id: 'account', name: 'Аккаунт', icon: 'fas fa-user' },
  { id: 'orders', name: 'Заказы', icon: 'fas fa-clipboard-list' },
  { id: 'products', name: 'Товары', icon: 'fas fa-box' }
]