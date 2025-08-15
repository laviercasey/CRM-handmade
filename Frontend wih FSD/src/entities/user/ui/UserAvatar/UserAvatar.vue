<template>
  <Avatar
    :src="avatarUrl"
    :alt="altText"
    :initials="userInitials"
    :size="size"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue';
import Avatar from '@/shared/ui/Avatar/';
import { getUserInitials, getUserAvatarUrl, getUserDisplayName } from '@/shared/utils/user';

type AvatarSize = 'small' | 'medium' | 'large';

interface User {
  first_name?: string;
  second_name?: string;
  avatar?: string;
  [key: string]: any;
}

interface UserAvatarProps {
  user: User;
  size?: AvatarSize;
}

const props = withDefaults(defineProps<UserAvatarProps>(), {
  size: 'medium'
});

const avatarUrl = computed((): string | null => {
  return getUserAvatarUrl(props.user);
});

const userInitials = computed((): string => {
  return getUserInitials(props.user);
});

const altText = computed((): string => {
  const name = getUserDisplayName(props.user);
  return `Аватар пользователя ${name}`;
});
</script>