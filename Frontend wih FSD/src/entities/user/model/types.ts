export const USER_ROLES = {
  USER: 'user',
  ADMIN: 'admin',
  MODERATOR: 'moderator'
} as const;

export type UserRole = typeof USER_ROLES[keyof typeof USER_ROLES];

export const USER_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  BANNED: 'banned',
  PENDING: 'pending'
} as const;

export type UserStatus = typeof USER_STATUS[keyof typeof USER_STATUS];

export const AVATAR_TYPES = {
  IMAGE: 'image',
  INITIALS: 'initials',
  DEFAULT: 'default'
} as const;

export type AvatarType = typeof AVATAR_TYPES[keyof typeof AVATAR_TYPES];

export interface UserConfig {
  avatar: string | null;
  first_name: string;
  second_name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
}

export const DEFAULT_USER_CONFIG: UserConfig = {
  avatar: null,
  first_name: '',
  second_name: '',
  email: '',
  role: USER_ROLES.USER,
  status: USER_STATUS.ACTIVE
};

export interface AvatarSizes {
  small: number;
  medium: number;
  large: number;
  xlarge: number;
}

export interface AvatarConfig {
  maxSize: number;
  allowedTypes: string[];
  sizes: AvatarSizes;
}

export const AVATAR_CONFIG: AvatarConfig = {
  maxSize: 5 * 1024 * 1024,
  allowedTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  sizes: {
    small: 24,
    medium: 32,
    large: 48,
    xlarge: 64
  }
};