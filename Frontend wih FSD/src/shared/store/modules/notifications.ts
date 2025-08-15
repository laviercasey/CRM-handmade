interface Notification {
  id: string | number;
  title: string;
  message: string;
  type?: string;
}

interface NotificationMessage {
  title: string;
  message: string;
}

interface NotificationsState {
  notifications: Notification[];
}

export default {
  namespaced: true,
  
  state: (): NotificationsState => ({
    notifications: []
  }),
  
  mutations: {
    ADD_NOTIFICATION(state: NotificationsState, notification: Notification): void {
      state.notifications.push(notification);
    },
    REMOVE_NOTIFICATION(state: NotificationsState, id: string | number): void {
      state.notifications = state.notifications.filter(n => n.id !== id);
    }
  },
  
  actions: {
    showError({ commit }: { commit: Function }, { title, message }: NotificationMessage): void {
      console.error(`${title}: ${message}`);
    },
    showSuccess({ commit }: { commit: Function }, { title, message }: NotificationMessage): void {
      console.log(`${title}: ${message}`);
    }
  }
};