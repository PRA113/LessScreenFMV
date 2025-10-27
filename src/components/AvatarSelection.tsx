import React from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Check } from 'lucide-react';
import { RANKS, getRankInfo } from './Dashboard';

interface Profile {
  id: string;
  name: string;
  emoji?: string;
  avatar?: string;
}

interface AvatarSelectionProps {
  currentProfile: Profile;
  onBack: () => void;
  onAvatarSelect: (avatar: string) => void;
}

export function AvatarSelection({
  currentProfile,
  onBack,
  onAvatarSelect,
}: AvatarSelectionProps) {
  // TODO: In Zukunft echte Lesestunden aus Backend/LocalStorage laden
  // Neue User starten bei 0 Stunden = Bücherwürmchen Rang
  const totalReadingHours = 0; // Wird nach ersten Sessions > 0
  const rankInfo = getRankInfo(totalReadingHours);
  const availableAvatars = rankInfo.currentRank.avatars;
  const currentAvatar = currentProfile.avatar || rankInfo.currentRank.emoji;

  return (
    <div className="min-h-screen bg-background pb-32">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary to-secondary rounded-b-[32px] px-6 pt-12 pb-8 shadow-lg mb-6">
        <div className="max-w-md mx-auto">
          <button
            onClick={onBack}
            className="mb-4 w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm"
          >
            <ArrowLeft className="w-5 h-5 text-white" strokeWidth={2} />
          </button>
          <h1 className="text-white mb-2">Avatar wählen</h1>
          <p className="text-white/80 text-sm">
            Wähle deinen Lieblings-Avatar für {rankInfo.currentRank.title}
          </p>
        </div>
      </div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md mx-auto px-6"
      >
        {/* Current Rank Info */}
        <div className="bg-card rounded-[24px] p-6 shadow-[0_8px_30px_rgba(139,92,246,0.12)] mb-6">
          <div className="flex items-center gap-4 mb-4">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center text-3xl shadow-lg"
              style={{
                background: `linear-gradient(135deg, ${rankInfo.currentRank.color}20, ${rankInfo.currentRank.color}10)`,
              }}
            >
              {currentAvatar}
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                Dein aktueller Rang
              </p>
              <h3 className="text-foreground">{rankInfo.currentRank.title}</h3>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            Entsperre mehr Avatare, indem du weiterliest und höhere Ränge erreichst! 📚
          </p>
        </div>

        {/* Avatar Grid */}
        <div className="bg-card rounded-[24px] p-6 shadow-[0_8px_30px_rgba(139,92,246,0.12)]">
          <h3 className="text-foreground mb-4">Verfügbare Avatare</h3>
          <div className="grid grid-cols-3 gap-4">
            {availableAvatars.map((avatar, index) => {
              const isSelected = avatar === currentAvatar;
              return (
                <motion.button
                  key={index}
                  onClick={() => onAvatarSelect(avatar)}
                  className={`relative aspect-square rounded-[20px] flex items-center justify-center text-4xl transition-all ${
                    isSelected
                      ? 'bg-gradient-to-br from-primary to-secondary shadow-lg scale-105'
                      : 'bg-muted hover:bg-muted/80 hover:scale-105'
                  }`}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {avatar}
                  {isSelected && (
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-lg">
                      <Check className="w-4 h-4 text-primary" strokeWidth={3} />
                    </div>
                  )}
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Locked Avatars Preview */}
        <div className="bg-card rounded-[24px] p-6 shadow-[0_8px_30px_rgba(139,92,246,0.12)] mt-4">
          <h3 className="text-foreground mb-2">Nächste Freischaltungen</h3>
          <p className="text-sm text-muted-foreground mb-4">
            {rankInfo.nextRank
              ? `${rankInfo.nextRank.emoji} ${rankInfo.nextRank.title} - noch ${Math.round(rankInfo.nextRank.minHours - totalReadingHours)} Std`
              : 'Du hast alle Ränge erreicht! 🏆'}
          </p>
          {rankInfo.nextRank && (
            <div className="grid grid-cols-3 gap-4">
              {rankInfo.nextRank.avatars.slice(0, 3).map((avatar, index) => (
                <div
                  key={index}
                  className="relative aspect-square rounded-[20px] bg-muted/50 flex items-center justify-center text-4xl opacity-40"
                >
                  {avatar}
                  <div className="absolute inset-0 bg-black/20 rounded-[20px] backdrop-blur-[1px]" />
                </div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
