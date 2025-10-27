import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ChevronLeft, Clock, Monitor } from 'lucide-react';

interface ReadingRatioSettingsProps {
  onBack: () => void;
}

export function ReadingRatioSettings({ onBack }: ReadingRatioSettingsProps) {
  const [readingMinutes, setReadingMinutes] = useState('60');
  const [screenMinutes, setScreenMinutes] = useState('60');

  const handleSave = () => {
    // Save settings logic
    onBack();
  };

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
          <h1 className="text-white mb-2">Lesezeit-Verhältnis</h1>
          <p className="text-white/80 text-sm">
            Lege fest, wie viel Bildschirmzeit für Lesezeit gewährt wird
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-md mx-auto px-6 -mt-4 space-y-6 pb-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-[24px] p-6 shadow-[0_8px_30px_rgba(139,92,246,0.12)]"
        >
          <h3 className="text-foreground mb-6">Verhältnis festlegen</h3>

          {/* Reading Time Input */}
          <div className="mb-6">
            <label className="text-sm text-muted-foreground mb-2 block flex items-center gap-2">
              <Clock className="w-4 h-4 text-primary" />
              Lesezeit (Minuten)
            </label>
            <div className="relative">
              <input
                type="number"
                value={readingMinutes}
                onChange={(e) => setReadingMinutes(e.target.value)}
                min="1"
                className="w-full bg-muted rounded-[16px] px-5 py-4 border-2 border-transparent focus:border-primary outline-none transition-all pr-16"
              />
              <span className="absolute right-5 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                Min
              </span>
            </div>
          </div>

          {/* Equals Sign */}
          <div className="flex justify-center mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full flex items-center justify-center">
              <span className="text-primary">=</span>
            </div>
          </div>

          {/* Screen Time Input */}
          <div className="mb-6">
            <label className="text-sm text-muted-foreground mb-2 block flex items-center gap-2">
              <Monitor className="w-4 h-4 text-accent" />
              Bildschirmzeit (Minuten)
            </label>
            <div className="relative">
              <input
                type="number"
                value={screenMinutes}
                onChange={(e) => setScreenMinutes(e.target.value)}
                min="1"
                className="w-full bg-muted rounded-[16px] px-5 py-4 border-2 border-transparent focus:border-primary outline-none transition-all pr-16"
              />
              <span className="absolute right-5 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                Min
              </span>
            </div>
          </div>

          {/* Summary */}
          <div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-[16px] p-4 mb-6">
            <p className="text-sm text-foreground text-center">
              Für <span className="text-primary">{readingMinutes} Minuten</span> Lesen
              erhält dein Kind{' '}
              <span className="text-accent">{screenMinutes} Minuten</span>{' '}
              Bildschirmzeit
            </p>
          </div>

          {/* Preset Buttons */}
          <div className="space-y-2 mb-6">
            <p className="text-xs text-muted-foreground uppercase tracking-wide mb-3">
              Schnellauswahl
            </p>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => {
                  setReadingMinutes('30');
                  setScreenMinutes('30');
                }}
                className="py-2 px-3 bg-muted rounded-[12px] text-sm text-foreground hover:bg-primary/10 transition-colors text-center"
              >
                1:1
              </button>
              <button
                onClick={() => {
                  setReadingMinutes('60');
                  setScreenMinutes('30');
                }}
                className="py-2 px-3 bg-muted rounded-[12px] text-sm text-foreground hover:bg-primary/10 transition-colors text-center"
              >
                2:1
              </button>
              <button
                onClick={() => {
                  setReadingMinutes('30');
                  setScreenMinutes('60');
                }}
                className="py-2 px-3 bg-muted rounded-[12px] text-sm text-foreground hover:bg-primary/10 transition-colors text-center"
              >
                1:2
              </button>
            </div>
          </div>

          {/* Save Button */}
          <motion.button
            onClick={handleSave}
            className="w-full bg-gradient-to-br from-primary to-secondary text-white py-4 rounded-full shadow-[0_8px_24px_rgba(139,92,246,0.35)] text-center"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Speichern
          </motion.button>
        </motion.div>

        {/* Info Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card rounded-[20px] p-5 shadow-[0_4px_20px_rgba(139,92,246,0.08)]"
        >
          <div className="flex gap-3">
            <span className="text-2xl">💡</span>
            <div>
              <h4 className="text-foreground mb-1">Tipp</h4>
              <p className="text-sm text-muted-foreground">
                Ein Verhältnis von 1:1 motiviert dein Kind gleichmäßig. Bei 2:1
                wird mehr Wert auf Lesen gelegt.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
