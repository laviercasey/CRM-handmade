<template>
  <div :class="$style.userInfo">
    <UserAvatar 
      :user="user" 
      :size="avatarSize"
      :class="$style.avatar"
    />
    <div v-if="showName" :class="$style.details">
      <div :class="$style.name">{{ displayName }}</div>
      <div v-if="showEmail && user.email" :class="$style.email">
        {{ user.email }}
      </div>
      <div v-if="showRole && user.role" :class="$style.role">
        {{ formatRole(user.role) }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import UserAvatar from '../UserAvatar'
import { getUserDisplayName } from '@/shared/lib/utils/user'
import { USER_ROLES } from '../../model/user-types'

const props = defineProps({
  user: {
    type: Object,
    required: true
  },
  showName: {
    type: Boolean,
    default: true
  },
  showEmail: {
    type: Boolean,
    default: false
  },
  showRole: {
    type: Boolean,
    default: false
  },
  avatarSize: {
    type: String,
    default: 'medium'
  },
  layout: {
    type: String,
    default: 'horizontal',
    validator: (value) => ['horizontal', 'vertical'].includes(value)
  }
})

const displayName = computed(() => {
  return getUserDisplayName(props.user)
})

function formatRole(role) {
  const roleNames = {
    [USER_ROLES.USER]: 'Пользователь',
    [USER_ROLES.ADMIN]: 'Администратор',
    [USER_ROLES.MODERATOR]: 'Модератор'
  }
  return roleNames[role] || role
}
</script>

<style module>
.userInfo {
  display: flex;
  align-items: center;
  gap: 12px;
}

.avatar {
  flex-shrink: 0;
}

.details {
  min-width: 0;
  flex: 1;
}

.name {
  font-weight: 500;
  color: #333;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.email {
  font-size: 0.875rem;
  color: #666;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.role {
  font-size: 0.75rem;
  color: #888;
  text-transform: uppercase;
}
</style>