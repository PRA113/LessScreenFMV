import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, Plus, Trash2, CheckCircle2 } from 'lucide-react';
import { Switch } from './ui/switch';

export interface Goal {
  id: string;
  name: string;
  emoji: string;
  targetMinutes: number;
  type: 'reading' | 'combined'; // reading only or reading + activities
  isActive: boolean;
}

interface GoalManagementProps {
  onBack: () => void;
  goals: Goal[];
  onGoalsChange: (goals: Goal[]) => void;
}

const GOAL_EMOJIS = ['🎯', '🎬', '🎮', '🎁', '📚', '🏆', '⭐', '🎉', '🎊', '💎', '🌟', '✨', '🎪', '🎨'];

export function GoalManagement({ onBack, goals, onGoalsChange }: GoalManagementProps) {
  const [goalName, setGoalName] = useState('');
  const [selectedEmoji, setSelectedEmoji] = useState('🎯');
  const [targetMinutes, setTargetMinutes] = useState('');
  const [goalType, setGoalType] = useState<'reading' | 'combined'>('reading');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const addGoal = () => {
    if (!goalName.trim() || !targetMinutes) return;

    const newGoal: Goal = {
      id: `goal-${Date.now()}`,
      name: goalName.trim(),
      emoji: selectedEmoji,
      targetMinutes: parseInt(targetMinutes),
      type: goalType,
      isActive: goals.length === 0, // First goal is active by default
    };

    onGoalsChange([...goals, newGoal]);
    
    // Reset form
    setGoalName('');
    setTargetMinutes('');
    setSelectedEmoji('🎯');
    setGoalType('reading');
  };

  const deleteGoal = (id: string) => {
    const updatedGoals = goals.filter((g) => g.id !== id);
    
    // If we deleted the active goal and there are other goals, make the first one active
    if (updatedGoals.length > 0 && !updatedGoals.some(g => g.isActive)) {
      updatedGoals[0].isActive = true;
    }
    
    onGoalsChange(updatedGoals);
  };

  const setActiveGoal = (id: string) => {
    const updatedGoals = goals.map((g) => ({
      ...g,
      isActive: g.id === id,
    }));
    onGoalsChange(updatedGoals);
  };

  // Quick presets
  const quickPresets = [
    { label: '2 Std', minutes: 120 },
    { label: '5 Std', minutes: 300 },
    { label: '10 Std', minutes: 600 },
    { label: '20 Std', minutes: 1200 },
  ];

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
              <span className="text-2xl">🎯</span>
            </div>
            <h1 className="text-white">Ziele verwalten</h1>
          </div>
          <p className="text-white/80 text-sm">
            Definiere deine persönlichen Leseziele
          </p>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md mx-auto px-6 space-y-6"
      >
        {/* Add New Goal Card */}
        <div className="bg-card rounded-[24px] p-6 shadow-[0_8px_30px_rgba(139,92,246,0.12)]">
          <h3 className="text-foreground mb-6 flex items-center gap-2">
            <Plus className="w-5 h-5 text-primary" />
            Neues Ziel erstellen
          </h3>

          {/* Emoji Selection */}
          <div className="mb-6">
            <label className="block text-foreground mb-3">
              Emoji wählen
            </label>
            <button
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="w-20 h-20 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-[20px] flex items-center justify-center text-5xl hover:scale-105 transition-transform"
            >
              {selectedEmoji}
            </button>
            
            <AnimatePresence>
              {showEmojiPicker && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-4 grid grid-cols-7 gap-2"
                >
                  {GOAL_EMOJIS.map((emoji) => (
                    <motion.button
                      key={emoji}
                      onClick={() => {
                        setSelectedEmoji(emoji);
                        setShowEmojiPicker(false);
                      }}
                      className="w-12 h-12 bg-muted rounded-[12px] flex items-center justify-center text-2xl hover:scale-110 transition-transform"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {emoji}
                    </motion.button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Goal Name */}
          <div className="mb-6">
            <label className="block text-foreground mb-2">
              Ziel-Name
            </label>
            <input
              type="text"
              value={goalName}
              onChange={(e) => setGoalName(e.target.value)}
              placeholder="z.B. Kino Besuch, Neues Buch..."
              className="w-full px-4 py-3 bg-input-background border border-border rounded-[16px] text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              maxLength={30}
            />
          </div>

          {/* Target Minutes */}
          <div className="mb-6">
            <label className="block text-foreground mb-2">
              Ziel (in Minuten)
            </label>
            <input
              type="number"
              value={targetMinutes}
              onChange={(e) => setTargetMinutes(e.target.value)}
              placeholder="z.B. 600"
              className="w-full px-4 py-3 bg-input-background border border-border rounded-[16px] text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              min="1"
            />
            
            {/* Quick Presets */}
            <div className="grid grid-cols-4 gap-2 mt-3">
              {quickPresets.map((preset) => (
                <button
                  key={preset.label}
                  onClick={() => setTargetMinutes(preset.minutes.toString())}
                  className="py-2 px-3 bg-muted rounded-[12px] text-sm text-foreground hover:bg-primary/10 transition-colors text-center"
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {/* Goal Type Toggle */}
          <div className="mb-6">

          </div>

          {/* Add Button */}
          <motion.button
            onClick={addGoal}
            disabled={!goalName.trim() || !targetMinutes}
            className="w-full bg-gradient-to-br from-primary to-secondary text-white py-4 rounded-full shadow-[0_8px_24px_rgba(139,92,246,0.35)] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed text-center"
            whileHover={
              goalName.trim() && targetMinutes
                ? { scale: 1.02 }
                : {}
            }
            whileTap={
              goalName.trim() && targetMinutes
                ? { scale: 0.98 }
                : {}
            }
          >
            <Plus className="w-5 h-5" />
            Ziel hinzufügen
          </motion.button>
        </div>

        {/* Existing Goals */}
        {goals.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-foreground px-2">Meine Ziele ({goals.length})</h3>
            <AnimatePresence>
              {goals.map((goal) => (
                <motion.div
                  key={goal.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className={`bg-card rounded-[20px] p-5 shadow-[0_4px_20px_rgba(139,92,246,0.08)] ${
                    goal.isActive ? 'ring-2 ring-primary shadow-[0_8px_30px_rgba(139,92,246,0.2)]' : ''
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-[16px] flex items-center justify-center flex-shrink-0">
                      <span className="text-3xl">{goal.emoji}</span>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="text-foreground">{goal.name}</h4>
                        {goal.isActive && (
                          <span className="px-2.5 py-1 bg-gradient-to-br from-primary/15 to-secondary/15 text-primary text-xs rounded-full flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" />
                            Aktiv
                          </span>
                        )}
                      </div>
                      
                      <div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-[12px] p-3 mb-2">
                        <p className="text-sm text-foreground">
                          <span className="text-primary">{goal.targetMinutes} Min</span>{' '}
                          ({(goal.targetMinutes / 60).toFixed(1)} Std)
                        </p>
                      </div>
                      
                      <div className="flex items-center gap-2 bg-muted rounded-[10px] px-3 py-2">
                        <span className="text-sm">
                          {goal.type === 'reading' ? '📚' : '✨'}
                        </span>
                        <p className="text-xs text-muted-foreground">
                          {goal.type === 'reading' ? 'Nur Lesezeit' : 'Mit Aktivitäten'}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      {!goal.isActive && (
                        <motion.button
                          onClick={() => setActiveGoal(goal.id)}
                          className="p-2 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-[12px] text-primary hover:scale-110 transition-transform"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <CheckCircle2 className="w-5 h-5" />
                        </motion.button>
                      )}
                      <motion.button
                        onClick={() => deleteGoal(goal.id)}
                        className="p-2 bg-destructive/10 rounded-[12px] text-destructive hover:scale-110 transition-transform"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Trash2 className="w-5 h-5" />
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* Info Card */}
        {goals.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-gradient-to-br from-primary/5 to-secondary/5 rounded-[20px] p-6 text-center"
          >
            <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">🎯</span>
            </div>
            <h3 className="text-foreground mb-2">Noch keine Ziele</h3>
            <p className="text-sm text-muted-foreground">
              Erstelle dein erstes Ziel, um deinen Fortschritt zu tracken!
            </p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
