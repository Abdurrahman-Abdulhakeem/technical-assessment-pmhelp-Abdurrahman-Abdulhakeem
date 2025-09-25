import { useCallback, useState } from 'react';
import { toast } from 'react-hot-toast';

export type NotificationType = 'success' | 'error' | 'info' | 'warning';

interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
}

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Array<Notification>>([]);

  const addNotification = useCallback((
    type: NotificationType,
    title: string,
    message: string
  ) => {
    const notification: Notification = {
      id: Date.now().toString(),
      type,
      title,
      message,
      timestamp: new Date(),
      read: false,
    };

    setNotifications(prev => [notification, ...prev]);

    // Also show toast
    switch (type) {
      case 'success':
        toast.success(title);
        break;
      case 'error':
        toast.error(title);
        break;
      case 'warning':
        toast(title, { icon: '⚠️' });
        break;
      case 'info':
        toast(title, { icon: 'ℹ️' });
        break;
    }
  }, []);

  const markAsRead = useCallback((id: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === id
          ? { ...notification, read: true }
          : notification
      )
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, read: true }))
    );
  }, []);

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev =>
      prev.filter(notification => notification.id !== id)
    );
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  return {
    notifications,
    unreadCount,
    addNotification,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAll,
  };
};