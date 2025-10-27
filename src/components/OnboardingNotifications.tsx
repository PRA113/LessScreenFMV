import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Bell, BellOff, Check, X } from 'lucide-react';
import { requestNotificationPermission, NotificationTemplates, isNotificationSupported } from '../utils/notifications';

interface OnboardingNotificationsProps {
  onComplete: () => void;
  onSkip: () => void;
}

export function OnboardingNotifications({ onComplete, onSkip }: OnboardingNotificationsProps) {
  const [permissionState, setPermissionState] = useState<'prompt' | 'granted' | 'denied'>('prompt');
  const [isRequesting, setIsRequesting] = useState(false);

  const handleRequestPermission = async () => {
    setIsRequesting(true);

    // Check if notifications are supported
    if (!isNotificationSupported()) {
      alert('Benachrichtigungen werden von diesem Browser nicht unterstützt.');
      setIsRequesting(false);
      return;
    }

    try {
      const permission = await requestNotificationPermission();
      setPermissionState(permission);

      if (permission === 'granted') {
        // Wait for permission to be fully set, then show welcome notification
        setTimeout(() => {
          NotificationTemplates.welcome();
        }, 300);
        
        // Wait a bit before completing
        setTimeout(() => {
          onComplete();
        }, 1800);
      } else if (permission === 'denied') {
        // Even if denied, allow user to continue
        setTimeout(() => {
          setIsRequesting(false);
        }, 500);
      }
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      alert('Fehler beim Aktivieren der Benachrichtigungen. Bitte versuche es später erneut.');
      setIsRequesting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/10 flex flex-col items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md"
      >
        <div className="bg-card rounded-[32px] p-8 shadow-[0_20px_60px_rgba(139,92,246,0.15)] border border-primary/10">
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 200, damping: 15 }}
              className="w-24 h-24 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full flex items-center justify-center"
            >
              <div className="text-5xl">
                {permissionState === 'granted' ? '✅' : '🔔'}
              </div>
            </motion.div>
          </div>

          {/* Title */}
          <h2 className="text-center text-foreground mb-3">
            {permissionState === 'granted' ? 'Perfekt!' : 'Bleib informiert'}
          </h2>

          {/* Description */}
          <p className="text-center text-muted-foreground mb-8">
            {permissionState === 'granted'
              ? 'Benachrichtigungen sind aktiviert. Du wirst informiert, wenn deine Lesezeit abläuft!'
              : 'Erlaube Benachrichtigungen, um erinnert zu werden, wenn deine Lesezeit abgelaufen ist.'}
          </p>

          {/* Visual Notification Preview */}
          {permissionState === 'prompt' && (
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-[24px] p-4 mb-8"
            >
              <div className="bg-card rounded-[20px] p-4 shadow-lg">
                <div className="flex items-start gap-3">
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="text-3xl"
                  >
                    🔔
                  </motion.div>
                  <div className="flex-1">
                    <div className="text-sm text-foreground mb-1">LessScreen</div>
                    <div className="text-xs text-muted-foreground">
                      Deine Lesezeit ist vorbei! Du hast 30 Minuten gelesen 🎉
                    </div>
                    <div className="text-xs text-muted-foreground mt-1 opacity-60">
                      vor 2 Minuten
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {permissionState === 'granted' && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200 }}
              className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-[20px] p-4 mb-8 text-center"
            >
              <div className="text-4xl mb-2">🎊</div>
              <div className="text-sm text-foreground">
                Super! Eine Test-Benachrichtigung wurde gesendet.
              </div>
            </motion.div>
          )}

          {permissionState === 'denied' && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="bg-destructive/10 rounded-[20px] p-4 mb-8 text-center"
            >
              <div className="text-4xl mb-2">🔕</div>
              <div className="text-sm text-foreground mb-2">
                Benachrichtigungen wurden blockiert
              </div>
              <div className="text-xs text-muted-foreground">
                Du kannst sie später in den Browser-Einstellungen aktivieren.
              </div>
            </motion.div>
          )}

          {/* Action Buttons */}
          {permissionState === 'prompt' && (
            <div className="space-y-3">
              <button
                onClick={handleRequestPermission}
                disabled={isRequesting}
                className="w-full bg-gradient-to-r from-primary to-secondary hover:shadow-lg text-primary-foreground py-4 rounded-[20px] transition-all active:scale-95 flex items-center justify-center gap-1.5 disabled:opacity-50 text-center"
              >
                <Bell size={20} />
                {isRequesting ? 'Anfrage läuft...' : 'Benachrichtigungen aktivieren'}
              </button>

              <button
                onClick={onSkip}
                className="w-full bg-muted hover:bg-muted/80 text-foreground py-4 rounded-[20px] transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                <X size={20} />
                Später aktivieren
              </button>
            </div>
          )}

          {permissionState === 'granted' && (
            <button
              onClick={onComplete}
              className="w-full bg-gradient-to-r from-primary to-secondary hover:shadow-lg text-primary-foreground py-4 rounded-[20px] transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              <Check size={20} />
              Weiter
            </button>
          )}

          {permissionState === 'denied' && (
            <button
              onClick={onSkip}
              className="w-full bg-muted hover:bg-muted/80 text-foreground py-4 rounded-[20px] transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              Weiter ohne Benachrichtigungen
            </button>
          )}

          {/* Info Text */}
          <div className="mt-6 text-center">
            <p className="text-xs text-muted-foreground">
              💡 Benachrichtigungen helfen dir, keine Lesezeit zu verpassen!
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
