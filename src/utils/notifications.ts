/**
 * Browser Notification Utility for LessScreen
 * Handles permission requests and notification sending
 */

export type NotificationPermissionStatus = 'granted' | 'denied' | 'default';

export type NotificationType = 'timer' | 'reminder' | 'goal' | 'milestone';

export interface NotificationPreferences {
  timer: boolean;
  reminder: boolean;
  goal: boolean;
  milestone: boolean;
}

const NOTIFICATION_PREFS_KEY = 'lessscreen_notification_prefs';

/**
 * Check if notifications are supported in the current browser
 */
export function isNotificationSupported(): boolean {
  return 'Notification' in window;
}

/**
 * Get current notification permission status
 */
export function getNotificationPermission(): NotificationPermissionStatus {
  if (!isNotificationSupported()) {
    return 'denied';
  }
  return Notification.permission as NotificationPermissionStatus;
}

/**
 * Request notification permission from user
 */
export async function requestNotificationPermission(): Promise<NotificationPermissionStatus> {
  if (!isNotificationSupported()) {
    console.warn('Notifications not supported in this browser');
    return 'denied';
  }

  try {
    const permission = await Notification.requestPermission();
    
    // Kleine Verzögerung, um sicherzustellen, dass die Permission vollständig gesetzt ist
    await new Promise(resolve => setTimeout(resolve, 100));
    
    return permission as NotificationPermissionStatus;
  } catch (error) {
    console.error('Error requesting notification permission:', error);
    return 'denied';
  }
}

/**
 * Get notification preferences from localStorage
 */
export function getNotificationPreferences(): NotificationPreferences {
  try {
    const saved = localStorage.getItem(NOTIFICATION_PREFS_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (error) {
    console.error('Error loading notification preferences:', error);
  }
  
  // Default: All enabled
  return {
    timer: true,
    reminder: true,
    goal: true,
    milestone: true,
  };
}

/**
 * Save notification preferences to localStorage
 */
export function saveNotificationPreferences(prefs: NotificationPreferences): void {
  try {
    localStorage.setItem(NOTIFICATION_PREFS_KEY, JSON.stringify(prefs));
  } catch (error) {
    console.error('Error saving notification preferences:', error);
  }
}

/**
 * Check if a specific notification type is enabled
 */
export function isNotificationTypeEnabled(type: NotificationType): boolean {
  const prefs = getNotificationPreferences();
  return prefs[type] ?? true;
}

export interface NotificationOptions {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  tag?: string;
  requireInteraction?: boolean;
  silent?: boolean;
}

/**
 * Show a browser notification (only if permission granted)
 */
export function showNotification(options: NotificationOptions, type?: NotificationType): Notification | null {
  if (!isNotificationSupported()) {
    console.warn('Notifications not supported');
    return null;
  }

  if (Notification.permission !== 'granted') {
    console.warn('Notification permission not granted');
    return null;
  }

  // Check if this notification type is enabled
  if (type && !isNotificationTypeEnabled(type)) {
    console.log(`Notification type '${type}' is disabled by user`);
    return null;
  }

  try {
    const notification = new Notification(options.title, {
      body: options.body,
      icon: options.icon || '📚',
      badge: options.badge || '⭐',
      tag: options.tag,
      requireInteraction: options.requireInteraction || false,
      silent: options.silent || false,
    });

    return notification;
  } catch (error) {
    console.error('Error showing notification:', error);
    return null;
  }
}

/**
 * Pre-defined notification templates for common use cases
 */
export const NotificationTemplates = {
  /**
   * Timer completed notification
   */
  timerComplete: (profileName: string, minutes: number) => {
    return showNotification({
      title: '🎉 Lesezeit abgelaufen!',
      body: `${profileName} hat ${minutes} Minuten gelesen! Super gemacht!`,
      icon: '📚',
      badge: '⭐',
      tag: 'timer-complete',
      requireInteraction: true,
    }, 'timer');
  },

  /**
   * Reminder to read
   */
  readingReminder: (profileName: string) => {
    return showNotification({
      title: '📖 Zeit zum Lesen!',
      body: `${profileName}, vergiss nicht zu lesen heute!`,
      icon: '📚',
      badge: '⏰',
      tag: 'reading-reminder',
    }, 'reminder');
  },

  /**
   * Goal achieved notification
   */
  goalAchieved: (goalName: string, emoji: string) => {
    return showNotification({
      title: `${emoji} Ziel erreicht!`,
      body: `Glückwunsch! Du hast "${goalName}" erreicht!`,
      icon: '🎯',
      badge: '🏆',
      tag: 'goal-achieved',
      requireInteraction: true,
    }, 'goal');
  },

  /**
   * Milestone reached notification
   */
  milestoneReached: (milestone: string) => {
    return showNotification({
      title: '🏆 Meilenstein erreicht!',
      body: milestone,
      icon: '⭐',
      badge: '🎊',
      tag: 'milestone',
      requireInteraction: true,
    }, 'milestone');
  },

  /**
   * Welcome notification (test notification)
   */
  welcome: () => {
    return showNotification({
      title: '🎉 LessScreen',
      body: 'Benachrichtigungen aktiviert! Du wirst jetzt informiert.',
      icon: '📚',
      badge: '✅',
      tag: 'welcome',
    });
  },
};

/**
 * Play notification sound
 * Uses a simple base64 encoded beep sound
 */
export function playNotificationSound(): void {
  try {
    // Simple beep sound (base64 encoded WAV)
    const audio = new Audio(
      'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTGH0fPTgjMGHm7A7+OZURE='
    );
    audio.play().catch((error) => {
      console.warn('Could not play notification sound:', error);
    });
  } catch (error) {
    console.error('Error playing notification sound:', error);
  }
}

/**
 * Check if user has notification permission and show friendly message
 */
export function checkNotificationPermissionStatus(): {
  hasPermission: boolean;
  message: string;
} {
  const permission = getNotificationPermission();

  switch (permission) {
    case 'granted':
      return {
        hasPermission: true,
        message: 'Benachrichtigungen sind aktiviert ✅',
      };
    case 'denied':
      return {
        hasPermission: false,
        message: 'Benachrichtigungen wurden blockiert. Bitte in den Browser-Einstellungen aktivieren.',
      };
    case 'default':
      return {
        hasPermission: false,
        message: 'Benachrichtigungen können in den Einstellungen aktiviert werden.',
      };
    default:
      return {
        hasPermission: false,
        message: 'Benachrichtigungen nicht verfügbar.',
      };
  }
}
