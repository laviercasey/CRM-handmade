export function formatPrice(price: number): string {
  return new Intl.NumberFormat('ru-RU').format(price);
}

export function formatDate(date: string | number | Date): string {
  return new Date(date).toLocaleDateString('ru-RU');
}