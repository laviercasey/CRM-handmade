export function formatPrice(price, showCurrency = true) {
    if (price === undefined || price === null) return '';
    
    const formattedPrice = new Intl.NumberFormat('ru-RU').format(price);
    return showCurrency ? `${formattedPrice} ₽` : formattedPrice;
  }

  export function formatDate(date, includeTime = false) {
    if (!date) return '';
    
    const dateObj = new Date(date);
    
    const options = {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    };
    
    if (includeTime) {
      options.hour = '2-digit';
      options.minute = '2-digit';
    }
    
    return new Intl.DateTimeFormat('ru-RU', options).format(dateObj);
  }

  export function truncateText(text, maxLength = 100) {
    if (!text || text.length <= maxLength) return text;
    
    return text.slice(0, maxLength) + '...';
  }

  export function formatRequestStatus(status) {
    const statusMap = {
      'pending': 'Ожидает',
      'accepted': 'Принята',
      'rejected': 'Отклонена'
    };
    
    return statusMap[status] || status;
  }

  export function formatPhone(phone) {
    if (!phone) return '';
    
    const cleaned = phone.replace(/\D/g, '');
    
    if (cleaned.length === 11) {
      return `+${cleaned[0]} (${cleaned.substring(1, 4)}) ${cleaned.substring(4, 7)}-${cleaned.substring(7, 9)}-${cleaned.substring(9, 11)}`;
    }
    
    return phone;
  }

  export function getInitials(firstName, lastName) {
    if (!firstName && !lastName) return '?';
    
    const firstInitial = firstName ? firstName.charAt(0) : '';
    const lastInitial = lastName ? lastName.charAt(0) : '';
    
    return `${firstInitial}${lastInitial}`;
  }
  