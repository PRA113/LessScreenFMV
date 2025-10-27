import React, { useState } from 'react';
import { motion } from 'motion/react';
import { User, Target, Bell, Shield, HelpCircle, LogOut, Clock, TrendingUp, Smile, Gift, RotateCcw, Compass } from 'lucide-react';
import { resetAndReload } from '../utils/app-reset';
import { toast } from 'sonner@2.0.3';

interface SettingsProps {
  userName: string;
  onNavigateToRatio?: () => void;
  onNavigateToActivities?: () => void;
  onNavigateToGoals?: () => void;
  onNavigateToProfileEdit?: () => void;
  onNavigateToNotifications?: () => void;
  onNavigateToPrivacy?: () => void;
  onNavigateToSupport?: () => void;
  onNavigateToAffiliate?: () => void;
  onOpenReadingCompass?: () => void;
}

export function Settings({ userName, onNavigateToRatio, onNavigateToActivities, onNavigateToGoals, onNavigateToProfileEdit, onNavigateToNotifications, onNavigateToPrivacy, onNavigateToSupport, onNavigateToAffiliate, onOpenReadingCompass }: SettingsProps) {
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const handleReset = () => {
    if (showResetConfirm) {
      toast.success('App wird zurückgesetzt...', {
        description: 'Die Seite wird neu geladen.',
      });
      setTimeout(() => {
        resetAndReload();
      }, 1000);
    } else {
      setShowResetConfirm(true);
      toast.warning('Bist du sicher?', {
        description: 'Klicke erneut zum Bestätigen.',
      });
      setTimeout(() => {
        setShowResetConfirm(false);
      }, 5000);
    }
  };

  const settingsGroups = [
    {
      title: 'Konto',
      items: [
        { icon: User, label: 'Eltern-Profil bearbeiten', action: onNavigateToProfileEdit || (() => {}) },
        { icon: Target, label: 'Ziele verwalten', action: onNavigateToGoals || (() => {}) },
      ],
    },
    {
      title: 'Einstellungen',
      items: [
        { icon: Clock, label: 'Lesezeit-Verhältnis', action: onNavigateToRatio || (() => {}) },
        { icon: TrendingUp, label: 'Aktivitäten verwalten', action: onNavigateToActivities || (() => {}) },
        { icon: Compass, label: 'Lese-Kompass öffnen', action: () => {
          console.log('Lese-Kompass Button clicked!');
          if (onOpenReadingCompass) {
            onOpenReadingCompass();
          } else {
            console.log('ERROR: onOpenReadingCompass is undefined!');
          }
        } },
        { icon: Bell, label: 'Benachrichtigungen', action: onNavigateToNotifications || (() => {}) },
        { icon: Shield, label: 'Datenschutz', action: onNavigateToPrivacy || (() => {}) },
      ],
    },
    {
      title: 'Partner',
      items: [
        { icon: Gift, label: 'Partner-Angebote', action: onNavigateToAffiliate || (() => {}) },
      ],
    },
    {
      title: 'Hilfe',
      items: [{ icon: HelpCircle, label: 'Support & FAQ', action: onNavigateToSupport || (() => {}) }],
    },
  ];

  return (
    <div className="min-h-screen bg-background pb-32">
      {/* Purple Gradient Header */}
      <div className="bg-gradient-to-br from-primary to-secondary rounded-b-[32px] px-6 pt-12 pb-8 shadow-lg mb-6">
        <div className="max-w-md mx-auto">
          <h1 className="text-white mb-2">Einstellungen</h1>
          <p className="text-white/80 text-sm">Verwalte deine App-Einstellungen</p>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md mx-auto px-6 space-y-6"
      >
        {/* Profile Card */}
        <motion.div
          className="bg-gradient-to-br from-primary to-secondary rounded-[24px] p-6 shadow-[0_12px_40px_rgba(139,92,246,0.3)]"
          whileHover={{ scale: 1.02 }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
              <User className="w-8 h-8 text-white" strokeWidth={2} />
            </div>
            <div>
              <h3 className="text-white">{userName}</h3>
              <p className="text-white/80 text-sm">Premium Mitglied</p>
            </div>
          </div>
        </motion.div>

        {/* Settings Groups */}
        {settingsGroups.map((group, groupIndex) => (
          <div key={groupIndex} className="space-y-3">
            <h4 className="text-muted-foreground text-xs uppercase tracking-wide px-2">{group.title}</h4>
            <div className="bg-card rounded-[24px] shadow-[0_8px_30px_rgba(139,92,246,0.12)] overflow-hidden">
              {group.items.map((item, itemIndex) => {
                const Icon = item.icon;
                return (
                  <motion.button
                    key={itemIndex}
                    onClick={item.action}
                    className={`w-full px-6 py-4 flex items-center gap-4 text-left transition-colors hover:bg-muted ${
                      itemIndex !== group.items.length - 1
                        ? 'border-b border-border'
                        : ''
                    }`}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="w-10 h-10 bg-gradient-to-br from-primary/20 to-primary/10 rounded-[14px] flex items-center justify-center">
                      <Icon className="w-5 h-5 text-primary" strokeWidth={2} />
                    </div>
                    <span className="flex-1 text-foreground">{item.label}</span>
                    <svg
                      className="w-5 h-5 text-secondary"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </motion.button>
                );
              })}
            </div>
          </div>
        ))}

        {/* Reset Button - For Testing */}
        <motion.button
          onClick={handleReset}
          className={`w-full py-4 rounded-[20px] flex items-center justify-center gap-2 transition-all active:scale-95 ${
            showResetConfirm
              ? 'bg-destructive text-destructive-foreground shadow-lg'
              : 'bg-amber-500/10 text-amber-700 hover:bg-amber-500/20'
          }`}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <RotateCcw className="w-5 h-5" strokeWidth={2} />
          {showResetConfirm ? 'Jetzt zurücksetzen?' : 'App zurücksetzen (Test)'}
        </motion.button>

        {/* Info about Reset */}
        {showResetConfirm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="bg-amber-50 border border-amber-200 rounded-[16px] p-4 text-sm text-amber-800"
          >
            ⚠️ Dies löscht alle Daten und startet das Onboarding neu. Ideal für Test-User!
          </motion.div>
        )}

        {/* Logout Button */}
        <motion.button
          className="w-full bg-destructive/10 text-destructive py-4 rounded-[20px] flex items-center justify-center gap-2 transition-all active:scale-95 text-center"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <LogOut className="w-5 h-5" strokeWidth={2} />
          Abmelden
        </motion.button>

        {/* Version */}
        <p className="text-center text-muted-foreground text-xs pt-4">
          LessScreen v1.0.0-rc3 • Testphase
        </p>
        <p className="text-center text-muted-foreground text-xs opacity-60">
          Powered by Supabase + OpenRouter + HuggingFace AI
        </p>
      </motion.div>
    </div>
  );
}
