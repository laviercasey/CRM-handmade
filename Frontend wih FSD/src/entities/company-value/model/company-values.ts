interface CompanyValue {
  id: number
  icon: string
  title: string
  description: string
}

export const companyValues: CompanyValue[] = [
  {
    id: 1,
    icon: 'fas fa-users',
    title: 'Сообщество',
    description: 'Мы создаем инструменты, которые помогают творческим людям расти и развиваться вместе.'
  },
  {
    id: 2,
    icon: 'fas fa-lightbulb',
    title: 'Инновации',
    description: 'Мы постоянно ищем новые способы улучшить наш продукт и сделать его более полезным.'
  },
  {
    id: 3,
    icon: 'fas fa-heart',
    title: 'Забота',
    description: 'Мы искренне заботимся о наших пользователях и стремимся сделать их опыт максимально комфортным.'
  },
  {
    id: 4,
    icon: 'fas fa-paint-brush',
    title: 'Творчество',
    description: 'Мы ценим и поддерживаем творческие идеи, как в нашей работе, так и в сообществе.'
  }
]