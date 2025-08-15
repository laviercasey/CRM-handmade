export function generateUniqueId() {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
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

  export function formatPrice(price, includeCurrency = true) {
    if (price === undefined || price === null) return '';
    
    const formattedPrice = new Intl.NumberFormat('ru-RU').format(price);
    return includeCurrency ? `${formattedPrice} ₽` : formattedPrice;
  }

  export function truncateText(text, maxLength = 100) {
    if (!text || text.length <= maxLength) return text;
    
    return text.slice(0, maxLength) + '...';
  }

  export function filterBySearchQuery(items, searchQuery, fields) {
    if (!searchQuery) return items;
    
    const query = searchQuery.toLowerCase();
    
    return items.filter(item => {
      return fields.some(field => {
        const value = item[field];
        if (!value) return false;
        return value.toString().toLowerCase().includes(query);
      });
    });
  }

  export function sortItems(items, field, order = 'asc') {
    const sortedItems = [...items];
    
    sortedItems.sort((a, b) => {
      let valueA = a[field];
      let valueB = b[field];
      
      if (field.includes('date') || field.includes('created_at')) {
        valueA = new Date(valueA || 0);
        valueB = new Date(valueB || 0);
      }
      
      if (typeof valueA === 'string' && typeof valueB === 'string') {
        return order === 'asc' 
          ? valueA.localeCompare(valueB) 
          : valueB.localeCompare(valueA);
      }
      
      return order === 'asc' ? valueA - valueB : valueB - valueA;
    });
    
    return sortedItems;
  }

  export function groupBy(items, field) {
    return items.reduce((result, item) => {
      const key = item[field];
      
      if (!result[key]) {
        result[key] = [];
      }
      
      result[key].push(item);
      return result;
    }, {});
  }

  export function formatTelegramUsername(username) {
    if (!username) return '';
    
    if (username.startsWith('@')) {
      return username;
    }
    
    return '@' + username;
  }

  export function getInitials(firstName, lastName) {
    if (!firstName && !lastName) return '?';
    
    const firstInitial = firstName ? firstName.charAt(0).toUpperCase() : '';
    const lastInitial = lastName ? lastName.charAt(0).toUpperCase() : '';
    
    return `${firstInitial}${lastInitial}`;
  }

  export function isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  }
  
  export function capitalizeFirstLetter(string) {
    if (!string) return '';
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
  
  export function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  export function getRandomColor() {
    return '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
  }
  
  export function calculatePercentage(value, total) {
    if (total === 0) return 0;
    return Math.round((value / total) * 100);
  }

  export function isDateOverdue(date) {
    if (!date) return false;
    
    const dateObj = new Date(date);
    const now = new Date();
    
    return dateObj < now;
  }
  
  export function daysBetweenDates(date1, date2) {
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    
    const diffTime = Math.abs(d2 - d1);
    
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  export function isEmpty(value) {
    if (value === null || value === undefined) return true;
    if (typeof value === 'string' && value.trim() === '') return true;
    if (Array.isArray(value) && value.length === 0) return true;
    if (typeof value === 'object' && Object.keys(value).length === 0) return true;
    
    return false;
  }
  