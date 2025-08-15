export function getCurrentYear(): number {
  return new Date().getFullYear();
}

export function formatDate(
  date: Date | string | number,
  locale: string = 'ru-RU',
  options: Intl.DateTimeFormatOptions = {}
): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date instanceof Date ? date : new Date(date);
  
  if (!(dateObj instanceof Date) || isNaN(dateObj.getTime())) {
    return '';
  }
  
  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  };
  
  return dateObj.toLocaleDateString(locale, { ...defaultOptions, ...options });
}


export function getCopyrightYears(startYear: number, currentYear: number = getCurrentYear()): string {
  if (!startYear || startYear >= currentYear) {
    return currentYear.toString();
  }
  
  return `${startYear}-${currentYear}`;
}


export function isLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
}


export function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}