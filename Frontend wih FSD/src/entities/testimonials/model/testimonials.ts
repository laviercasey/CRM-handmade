interface Author {
  name: string;
  profession: string;
  avatar: string;
}

export interface Testimonial {
  id: number;
  content: string;
  author: Author;
}

export const testimonials: Testimonial[] = [
  {
    id: 1,
    content: 'ТвойCRM полностью изменил мой подход к управлению заказами. Теперь я трачу меньше времени на организацию и больше на творчество!',
    author: {
      name: 'Анна',
      profession: 'Мастер вязаных игрушек',
      avatar: '@/assets/testimonial-1.jpg'
    }
  },
  {
    id: 2,
    content: 'Калькулятор стоимости помог мне понять, какие изделия действительно выгодны, а какие я продавала себе в убыток. Очень ценная функция!',
    author: {
      name: 'Мария',
      profession: 'Керамист',
      avatar: '@/assets/testimonial-2.jpg'
    }
  }
];