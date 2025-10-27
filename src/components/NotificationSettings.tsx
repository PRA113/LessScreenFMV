import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ChevronLeft, Bell, BellOff, Check, AlertCircle } from 'lucide-react';
import {
  getNotificationPermission,
  requestNotificationPermission,
  NotificationTemplates,
  checkNotificationPermissionStatus,
  isNotificationSupported,
  getNotificationPreferences,
  saveNotificationPreferences,
  NotificationPreferences,
} from '../utils/notifications';
import { toast } from 'sonner@2.0.3';
import { Switch } from './ui/switch';

interface NotificationSettingsProps {
  onBack: () => void;
}

export function NotificationSettings({ onBack }: NotificationSettingsProps) {
  const [permissionState, setPermissionState] = useState<'granted' | 'denied' | 'default'>('default');
  const [isRequesting, setIsRequesting] = useState(false);
  const [preferences, setPreferences] = useState<NotificationPreferences>({
    timer: true,
    reminder: true,
    goal: true,
    milestone: true,
  });

  useEffect(() => {
    setPermissionState(getNotificationPermission());
    setPreferences(getNotificationPreferences());
  }, []);

  const handleRequestPermission = async () => {
    if (!isNotificationSupported()) {
      toast.error('Benachrichtigungen werden von diesem Browser nicht unterstützt.');
      return;
    }

    setIsRequesting(true);

    try {
      const permission = await requestNotificationPermission();
      setPermissionState(permission);

      if (permission === 'granted') {
        // Wait for permission to be fully set
        setTimeout(() => {
          NotificationTemplates.welcome();
          toast.success('Benachrichtigungen aktiviert! 🎉', {
            description: 'Du wirst jetzt über deine Lesezeiten informiert.',
          });
        }, 300);
      } else if (permission === 'denied') {
        toast.error('Benachrichtigungen wurden blockiert', {
          description: 'Bitte in den Browser-Einstellungen aktivieren.',
        });
      }
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      toast.error('Fehler beim Aktivieren der Benachrichtigungen');
    }

    setIsRequesting(false);
  };

  const handleTestNotification = () => {
    if (permissionState !== 'granted') {
      toast.error('Benachrichtigungen sind nicht aktiviert', {
        description: 'Bitte aktiviere zuerst die Benachrichtigungen.',
      });
      return;
    }

    NotificationTemplates.timerComplete('Max', 30);
    toast.success('Test-Benachrichtigung gesendet! 🔔');
  };

  const handlePreferenceChange = (key: keyof NotificationPreferences, value: boolean) => {
    const newPrefs = { ...preferences, [key]: value };
    setPreferences(newPrefs);
    saveNotificationPreferences(newPrefs);
    
    toast.success('Einstellung gespeichert', {
      description: `${getNotificationTypeLabel(key)}-Benachrichtigungen ${value ? 'aktiviert' : 'deaktiviert'}`,
    });
  };

  const getNotificationTypeLabel = (type: keyof NotificationPreferences): string => {
    const labels = {
      timer: 'Timer',
      reminder: 'Erinnerungs',
      goal: 'Ziel',
      milestone: 'Meilenstein',
    };
    return labels[type];
  };

  const status = checkNotificationPermissionStatus();

  return (
    <div className="min-h-screen bg-background pb-32">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary to-secondary rounded-b-[32px] px-6 pt-12 pb-8 shadow-lg mb-6">
        <div className="max-w-md mx-auto">
          <button
            onClick={onBack}
            className="mb-6 flex items-center gap-2 text-white/90 hover:text-white transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            <span>Zurück</span>
          </button>
          
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-white/20 rounded-[16px] flex items-center justify-center backdrop-blur-sm">
              <Bell className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-white">Benachrichtigungen</h1>
          </div>
          <p className="text-white/80 text-sm">
            Verwalte deine Push-Benachrichtigungen
          </p>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md mx-auto px-6 space-y-6"
      >
        {/* Status Card */}
        <div className="bg-card rounded-[24px] p-6 shadow-[0_8px_30px_rgba(139,92,246,0.12)]">
          <div className="flex items-start gap-4 mb-6">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
              permissionState === 'granted' 
                ? 'bg-gradient-to-br from-[#14B8A6]/20 to-[#14B8A6]/10' 
                : 'bg-gradient-to-br from-primary/20 to-secondary/20'
            }`}>
              {permissionState === 'granted' ? (
                <span className="text-4xl">✅</span>
              ) : permissionState === 'denied' ? (
                <span className="text-4xl">🔕</span>
              ) : (
                <span className="text-4xl">🔔</span>
              )}
            </div>
            <div className="flex-1">
              <h3 className="text-foreground mb-2">Status</h3>
              <p className="text-sm text-muted-foreground">{status.message}</p>
            </div>
          </div>

          {/* Permission Badges */}
          <div className="grid grid-cols-3 gap-2 mb-6">
            <div className={`p-3 rounded-[16px] text-center transition-all ${
              permissionState === 'granted' 
                ? 'bg-gradient-to-br from-[#14B8A6]/20 to-[#14B8A6]/10 ring-2 ring-[#14B8A6]/30' 
                : 'bg-muted'
            }`}>
              <div className="text-2xl mb-1">✅</div>
              <div className="text-xs text-muted-foreground">Aktiviert</div>
            </div>
            <div className={`p-3 rounded-[16px] text-center transition-all ${
              permissionState === 'default' 
                ? 'bg-gradient-to-br from-accent/20 to-accent/10 ring-2 ring-accent/30' 
                : 'bg-muted'
            }`}>
              <div className="text-2xl mb-1">❓</div>
              <div className="text-xs text-muted-foreground">Ausstehend</div>
            </div>
            <div className={`p-3 rounded-[16px] text-center transition-all ${
              permissionState === 'denied' 
                ? 'bg-gradient-to-br from-destructive/20 to-destructive/10 ring-2 ring-destructive/30' 
                : 'bg-muted'
            }`}>
              <div className="text-2xl mb-1">🔕</div>
              <div className="text-xs text-muted-foreground">Blockiert</div>
            </div>
          </div>

          {/* Action Buttons */}
          {permissionState === 'default' && (
            <button
              onClick={handleRequestPermission}
              disabled={isRequesting}
              className="w-full bg-gradient-to-r from-primary to-secondary hover:shadow-lg text-primary-foreground py-4 rounded-[20px] transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Bell size={20} />
              {isRequesting ? 'Anfrage läuft...' : 'Benachrichtigungen aktivieren'}
            </button>
          )}

          {permissionState === 'granted' && (
            <button
              onClick={handleTestNotification}
              className="w-full bg-gradient-to-r from-primary to-secondary hover:shadow-lg text-primary-foreground py-4 rounded-[20px] transition-all active:scale-95 flex items-center justify-center gap-1.5 text-center"
            >
              <Bell size={20} />
              Test-Benachrichtigung senden
            </button>
          )}

          {permissionState === 'denied' && (
            <div className="bg-destructive/10 rounded-[16px] p-4 text-center">
              <AlertCircle className="w-6 h-6 text-destructive mx-auto mb-2" />
              <p className="text-sm text-foreground mb-2">
                Benachrichtigungen wurden blockiert
              </p>
              <p className="text-xs text-muted-foreground">
                Bitte in den Browser-Einstellungen aktivieren.
              </p>
            </div>
          )}
        </div>

        {/* Notification Type Settings */}
        {permissionState === 'granted' && (
          <div className="bg-card rounded-[24px] p-6 shadow-[0_8px_30px_rgba(139,92,246,0.12)]">
            <h3 className="text-foreground mb-4">Benachrichtigungstypen</h3>
            <p className="text-sm text-muted-foreground mb-6">
              Wähle aus, welche Benachrichtigungen du erhalten möchtest.
            </p>

            <div className="space-y-4">
              {/* Timer Notifications */}
              <div className="flex items-center justify-between p-4 rounded-[16px] bg-gradient-to-br from-primary/5 to-secondary/5">
                <div className="flex items-center gap-3 flex-1">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-[12px] flex items-center justify-center">
                    <span className="text-xl">⏰</span>
                  </div>
                  <div>
                    <div className="text-foreground">Timer</div>
                    <div className="text-xs text-muted-foreground">Wenn die Lesezeit abläuft</div>
                  </div>
                </div>
                <Switch
                  checked={preferences.timer}
                  onCheckedChange={(checked) => handlePreferenceChange('timer', checked)}
                />
              </div>

              {/* Reminder Notifications */}
              <div className="flex items-center justify-between p-4 rounded-[16px] bg-gradient-to-br from-accent/5 to-accent/5">
                <div className="flex items-center gap-3 flex-1">
                  <div className="w-10 h-10 bg-gradient-to-br from-accent/20 to-accent/20 rounded-[12px] flex items-center justify-center">
                    <span className="text-xl">📖</span>
                  </div>
                  <div>
                    <div className="text-foreground">Erinnerungen</div>
                    <div className="text-xs text-muted-foreground">Tägliche Leseerinnerungen</div>
                  </div>
                </div>
                <Switch
                  checked={preferences.reminder}
                  onCheckedChange={(checked) => handlePreferenceChange('reminder', checked)}
                />
              </div>

              {/* Goal Notifications */}
              <div className="flex items-center justify-between p-4 rounded-[16px] bg-gradient-to-br from-[#14B8A6]/5 to-[#14B8A6]/5">
                <div className="flex items-center gap-3 flex-1">
                  <div className="w-10 h-10 bg-gradient-to-br from-[#14B8A6]/20 to-[#14B8A6]/10 rounded-[12px] flex items-center justify-center">
                    <span className="text-xl">🎯</span>
                  </div>
                  <div>
                    <div className="text-foreground">Ziele</div>
                    <div className="text-xs text-muted-foreground">Wenn ein Ziel erreicht wird</div>
                  </div>
                </div>
                <Switch
                  checked={preferences.goal}
                  onCheckedChange={(checked) => handlePreferenceChange('goal', checked)}
                />
              </div>

              {/* Milestone Notifications */}
              <div className="flex items-center justify-between p-4 rounded-[16px] bg-gradient-to-br from-amber-500/5 to-amber-500/5">
                <div className="flex items-center gap-3 flex-1">
                  <div className="w-10 h-10 bg-gradient-to-br from-amber-500/20 to-amber-500/10 rounded-[12px] flex items-center justify-center">
                    <span className="text-xl">🏆</span>
                  </div>
                  <div>
                    <div className="text-foreground">Meilensteine</div>
                    <div className="text-xs text-muted-foreground">Besondere Erfolge</div>
                  </div>
                </div>
                <Switch
                  checked={preferences.milestone}
                  onCheckedChange={(checked) => handlePreferenceChange('milestone', checked)}
                />
              </div>
            </div>
          </div>
        )}

        {/* Info Cards - Only show when permission granted */}
        {permissionState === 'granted' && (
          <div className="space-y-3">
            <h3 className="text-foreground px-2">Beispiele</h3>
            
            <div className="bg-card rounded-[20px] p-5 shadow-[0_4px_20px_rgba(139,92,246,0.08)]">
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-[14px] flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">⏰</span>
                </div>
                <div>
                  <h4 className="text-foreground mb-1">Timer abgelaufen</h4>
                  <p className="text-sm text-muted-foreground">
                    "Max hat 30 Minuten gelesen! Super gemacht!"
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-card rounded-[20px] p-5 shadow-[0_4px_20px_rgba(139,92,246,0.08)]">
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-[#14B8A6]/20 to-[#14B8A6]/10 rounded-[14px] flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">🎯</span>
                </div>
                <div>
                  <h4 className="text-foreground mb-1">Ziel erreicht</h4>
                  <p className="text-sm text-muted-foreground">
                    "Glückwunsch! Du hast '100 Minuten lesen' erreicht!"
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-card rounded-[20px] p-5 shadow-[0_4px_20px_rgba(139,92,246,0.08)]">
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-accent/20 to-accent/10 rounded-[14px] flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">🏆</span>
                </div>
                <div>
                  <h4 className="text-foreground mb-1">Meilenstein</h4>
                  <p className="text-sm text-muted-foreground">
                    "Du hast 10 Bücher gelesen! Fantastisch!"
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Privacy Info */}
        <div className="bg-gradient-to-br from-primary/5 to-secondary/5 rounded-[20px] p-5">
          <div className="flex items-start gap-3">
            <div className="text-2xl">🔒</div>
            <div>
              <h4 className="text-foreground mb-1">Deine Privatsphäre</h4>
              <p className="text-sm text-muted-foreground">
                Benachrichtigungen werden nur lokal auf deinem Gerät angezeigt. 
                Keine Daten werden an externe Server gesendet.
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
