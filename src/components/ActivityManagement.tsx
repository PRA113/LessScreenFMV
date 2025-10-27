import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, Plus, Trash2, TrendingUp } from 'lucide-react';
import { Switch } from './ui/switch';

export interface Activity {
  id: string;
  name: string;
  emoji: string;
  activityMinutes: number;
  screenMinutes: number;
  showSeparately: boolean;
  color: string;
}

interface ActivityManagementProps {
  onBack: () => void;
  activities: Activity[];
  onActivitiesChange: (activities: Activity[]) => void;
}

const EMOJI_OPTIONS = ['⚽', '🏊', '🎨', '🎵', '📚', '🧩', '🎮', '🏃', '🚴', '🎯', '⭐', '💯', '🏆', '✨'];

const ACTIVITY_COLORS = ['#EF4444', '#F472B6', '#8B5CF6', '#14B8A6', '#F97316'];

export function ActivityManagement({ onBack, activities, onActivitiesChange }: ActivityManagementProps) {
  const [activityName, setActivityName] = useState('');
  const [selectedEmoji, setSelectedEmoji] = useState('⚽');
  const [activityMinutes, setActivityMinutes] = useState('60');
  const [screenMinutes, setScreenMinutes] = useState('30');
  const [showSeparately, setShowSeparately] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const addActivity = () => {
    if (activityName.trim() && activityMinutes && screenMinutes) {
      const colorIndex = activities.length % ACTIVITY_COLORS.length;
      const newActivity: Activity = {
        id: Date.now().toString(),
        name: activityName.trim(),
        emoji: selectedEmoji,
        activityMinutes: parseInt(activityMinutes, 10),
        screenMinutes: parseInt(screenMinutes, 10),
        showSeparately,
        color: ACTIVITY_COLORS[colorIndex],
      };
      onActivitiesChange([...activities, newActivity]);
      setActivityName('');
      setActivityMinutes('60');
      setScreenMinutes('30');
      setSelectedEmoji('⚽');
      setShowSeparately(false);
      setShowEmojiPicker(false);
    }
  };

  const removeActivity = (id: string) => {
    onActivitiesChange(activities.filter((activity) => activity.id !== id));
  };

  const quickRatios = [
    { label: '1:1', activity: 60, screen: 60 },
    { label: '2:1', activity: 60, screen: 30 },
    { label: '1:2', activity: 30, screen: 60 },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary to-secondary rounded-b-[32px] px-6 pt-12 pb-8 shadow-lg">
        <div className="max-w-md mx-auto">
          <button
            onClick={onBack}
            className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm mb-4 transition-transform active:scale-95"
          >
            <ChevronLeft className="w-6 h-6 text-white" strokeWidth={2} />
          </button>
          <h1 className="text-white mb-2">Aktivitäten verwalten</h1>
          <p className="text-white/80 text-sm">
            Definiere Aktivitäten, die Bildschirmzeit verdienen
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-md mx-auto px-6 -mt-4 space-y-6 pb-32">
        {/* Add Activity Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-[24px] p-6 shadow-[0_8px_30px_rgba(139,92,246,0.12)]"
        >
          <h3 className="text-foreground mb-6">Neue Aktivität hinzufügen</h3>

          {/* Activity Name & Emoji */}
          <div className="mb-6">
            <label className="text-sm text-muted-foreground mb-2 block">
              Aktivitätsname & Icon
            </label>
            <div className="flex gap-2">
              <button
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className="w-14 h-14 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-[16px] flex items-center justify-center text-2xl transition-all hover:scale-105 active:scale-95"
              >
                {selectedEmoji}
              </button>
              <input
                type="text"
                value={activityName}
                onChange={(e) => setActivityName(e.target.value)}
                placeholder="z.B. Fußball spielen"
                className="flex-1 bg-muted rounded-[16px] px-5 py-4 border-2 border-transparent focus:border-primary outline-none transition-all text-[14px]"
              />
            </div>

            {/* Emoji Picker */}
            <AnimatePresence>
              {showEmojiPicker && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-3 bg-muted rounded-[16px] p-3 grid grid-cols-7 gap-2"
                >
                  {EMOJI_OPTIONS.map((emoji) => (
                    <button
                      key={emoji}
                      onClick={() => {
                        setSelectedEmoji(emoji);
                        setShowEmojiPicker(false);
                      }}
                      className={`w-10 h-10 rounded-[12px] flex items-center justify-center text-xl transition-all hover:scale-110 ${
                        selectedEmoji === emoji
                          ? 'bg-primary text-white'
                          : 'bg-white hover:bg-primary/10'
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Ratio Settings */}
          <div className="mb-6">
            <label className="text-sm text-muted-foreground mb-2 block flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-primary" />
              Verhältnis zur Bildschirmzeit
            </label>

            <div className="space-y-3">
              <div className="relative">
                <input
                  type="number"
                  value={activityMinutes}
                  onChange={(e) => setActivityMinutes(e.target.value)}
                  min="1"
                  placeholder="60"
                  className="w-full bg-muted rounded-[16px] px-5 py-4 border-2 border-transparent focus:border-primary outline-none transition-all pr-28"
                />
                <span className="absolute right-5 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                  Min Aktivität
                </span>
              </div>

              <div className="flex justify-center">
                <div className="w-10 h-10 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full flex items-center justify-center">
                  <span className="text-primary">=</span>
                </div>
              </div>

              <div className="relative">
                <input
                  type="number"
                  value={screenMinutes}
                  onChange={(e) => setScreenMinutes(e.target.value)}
                  min="1"
                  placeholder="30"
                  className="w-full bg-muted rounded-[16px] px-5 py-4 border-2 border-transparent focus:border-primary outline-none transition-all pr-32"
                />
                <span className="absolute right-5 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                  Min Bildschirmzeit
                </span>
              </div>
            </div>

            {/* Quick Ratios */}
            <div className="grid grid-cols-3 gap-2 mt-3">
              {quickRatios.map((ratio) => (
                <button
                  key={ratio.label}
                  onClick={() => {
                    setActivityMinutes(ratio.activity.toString());
                    setScreenMinutes(ratio.screen.toString());
                  }}
                  className="py-2 px-3 bg-muted rounded-[12px] text-sm text-foreground hover:bg-primary/10 transition-colors text-center"
                >
                  {ratio.label}
                </button>
              ))}
            </div>
          </div>

          {/* Separate Display Toggle */}
          <div className="mb-6">
            <div className="bg-card rounded-[20px] p-5 shadow-[0_4px_20px_rgba(139,92,246,0.08)] border border-primary/5">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-start gap-3 flex-1">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-[16px] flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl">📊</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-foreground mb-1">Separat anzeigen</h4>
                    <p className="text-xs text-muted-foreground">
                      Aktivität separat von Lesezeit im Dashboard anzeigen
                    </p>
                  </div>
                </div>
                <Switch
                  checked={showSeparately}
                  onCheckedChange={setShowSeparately}
                />
              </div>
              
              {/* Info Text */}
              <div className="mt-4 pt-4 border-t border-border">
                <div className="bg-gradient-to-br from-primary/5 to-secondary/5 rounded-[12px] p-3">
                  <p className="text-xs text-muted-foreground">
                    {showSeparately ? (
                      <span className="flex items-center gap-2">
                        <span className="text-lg">✨</span>
                        <span>
                          <span className="text-primary">Separat:</span> Eigene Farbe und Label im Dashboard
                        </span>
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <span className="text-lg">📚</span>
                        <span>
                          <span className="text-accent">Kombiniert:</span> Wird zur Lesezeit addiert
                        </span>
                      </span>
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Add Button */}
          <motion.button
            onClick={addActivity}
            disabled={!activityName.trim() || !activityMinutes || !screenMinutes}
            className="w-full bg-gradient-to-br from-primary to-secondary text-white py-4 rounded-full shadow-[0_8px_24px_rgba(139,92,246,0.35)] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed text-center"
            whileHover={
              activityName.trim() && activityMinutes && screenMinutes
                ? { scale: 1.02 }
                : {}
            }
            whileTap={
              activityName.trim() && activityMinutes && screenMinutes
                ? { scale: 0.98 }
                : {}
            }
          >
            <Plus className="w-5 h-5" strokeWidth={2.5} />
            Aktivität hinzufügen
          </motion.button>
        </motion.div>

        {/* Activities List */}
        {activities.length > 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-3"
          >
            <h4 className="text-muted-foreground text-xs uppercase tracking-wide px-2">
              Deine Aktivitäten
            </h4>
            {activities.map((activity, index) => (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: index * 0.05 }}
                className="bg-card rounded-[20px] p-5 shadow-[0_4px_20px_rgba(139,92,246,0.08)]"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-[16px] flex items-center justify-center text-2xl flex-shrink-0">
                    {activity.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="text-foreground">{activity.name}</h4>
                      {activity.showSeparately && (
                        <span className="px-2.5 py-1 bg-gradient-to-br from-primary/15 to-secondary/15 text-primary text-xs rounded-full flex items-center gap-1">
                          <span>✨</span> Separat
                        </span>
                      )}
                    </div>
                    <div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-[12px] p-3 mb-2">
                      <p className="text-sm text-foreground">
                        <span className="text-primary">{activity.activityMinutes} Min</span>{' '}
                        = <span className="text-accent">{activity.screenMinutes} Min</span>{' '}
                        Bildschirmzeit
                      </p>
                    </div>
                    {activity.showSeparately && (
                      <div className="flex items-center gap-2 bg-muted rounded-[10px] px-3 py-2">
                        <div 
                          className="w-4 h-4 rounded-full shadow-md" 
                          style={{ backgroundColor: activity.color }}
                        />
                        <p className="text-xs text-muted-foreground">
                          Dashboard-Farbe
                        </p>
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => removeActivity(activity.id)}
                    className="w-10 h-10 flex items-center justify-center text-muted-foreground hover:text-destructive transition-colors flex-shrink-0"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-card rounded-[20px] p-8 shadow-[0_4px_20px_rgba(139,92,246,0.08)] text-center"
          >
            <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="w-8 h-8 text-primary" />
            </div>
            <h4 className="text-foreground mb-2">Noch keine Aktivitäten</h4>
            <p className="text-sm text-muted-foreground">
              Füge Aktivitäten hinzu, die dein Kind mit Bildschirmzeit belohnen
            </p>
          </motion.div>
        )}

        {/* Info Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-card rounded-[20px] p-5 shadow-[0_4px_20px_rgba(139,92,246,0.08)]"
        >
          <div className="flex gap-3">
            <span className="text-2xl">💡</span>
            <div>
              <h4 className="text-foreground mb-1">Tipp</h4>
              <p className="text-sm text-muted-foreground">
                Belohne positive Verhaltensweisen wie Hausaufgaben, Sport oder gute Noten
                mit Bildschirmzeit. Du kannst beliebige Aktivitäten hinzufügen!
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
