interface User {
  first_name?: string;
  firstName?: string;
  second_name?: string;
  last_name?: string;
  lastName?: string;
  username?: string;
  email?: string;
  avatar?: string;
}

export function getUserInitials(user?: User | null): string {
  if (!user) return '?';
  
  const firstName = user.first_name || user.firstName || '';
  const lastName = user.second_name || user.lastName || user.last_name || '';
  
  const firstInitial = firstName.charAt(0).toUpperCase();
  const lastInitial = lastName.charAt(0).toUpperCase();
  
  return `${firstInitial}${lastInitial}` || '?';
}

export function getUserDisplayName(user?: User | null): string {
  if (!user) return 'Пользователь';
  
  const firstName = user.first_name || user.firstName || '';
  const lastName = user.second_name || user.lastName || user.last_name || '';
  
  if (firstName && lastName) {
    return `${firstName} ${lastName}`;
  }
  
  return firstName || lastName || user.username || user.email || 'Пользователь';
}

export function getUserShortName(user?: User | null): string {
  if (!user) return 'Пользователь';
  
  return user.first_name || user.firstName || user.username || 'Пользователь';
}

export function getUserAvatarUrl(user?: User | null, baseUrl: string = ''): string | null {
  if (!user || !user.avatar) return null;
  
  if (user.avatar.startsWith('http')) {
    return user.avatar;
  }
  
  const apiUrl = baseUrl || import.meta.env.VITE_API_URL || '';
  return `${apiUrl}/uploads/avatars/${user.avatar}`;
}

export function isValidImageUrl(url: string): Promise<boolean> {
  return new Promise((resolve) => {
    if (!url) {
      resolve(false);
      return;
    }
    
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = url;
  });
}