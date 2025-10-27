import React, { useState } from 'react';
import { User, Users, Baby } from 'lucide-react';
import { motion } from 'motion/react';

interface OnboardingUserTypeProps {
  onNext: (userType: 'oneChild' | 'multipleChildren' | 'adult') => void;
}

export function OnboardingUserType({ onNext }: OnboardingUserTypeProps) {
  const [selected, setSelected] = useState<'oneChild' | 'multipleChildren' | 'adult' | null>(null);

  const handleSelect = (type: 'oneChild' | 'multipleChildren' | 'adult') => {
    setSelected(type);
    setTimeout(() => onNext(type), 300);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <h1 className="text-foreground text-center mb-4">Für wen?</h1>
        <p className="text-muted-foreground text-center mb-12">
          Wähle aus, wie du LessScreen nutzen möchtest.
        </p>

        <div className="space-y-4">
          {/* One Child Option */}
          <motion.button
            onClick={() => handleSelect('oneChild')}
            className={`w-full bg-card rounded-[24px] p-6 shadow-[0_8px_30px_rgba(139,92,246,0.15)] transition-all active:scale-98 ${
              selected === 'oneChild' ? 'ring-2 ring-primary' : ''
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-[#14B8A6] to-[#0891B2] rounded-[20px] flex items-center justify-center shadow-[0_6px_20px_rgba(20,184,166,0.3)]">
                <Baby className="w-8 h-8 text-white" strokeWidth={2} />
              </div>
              <div className="flex-1 text-left">
                <h3 className="text-foreground">Für ein Kind</h3>
                <p className="text-muted-foreground text-sm mt-1">
                  Verwalte die Lesezeit deines Kindes
                </p>
              </div>
            </div>
          </motion.button>

          {/* Multiple Children Option */}
          <motion.button
            onClick={() => handleSelect('multipleChildren')}
            className={`w-full bg-card rounded-[24px] p-6 shadow-[0_8px_30px_rgba(139,92,246,0.15)] transition-all active:scale-98 ${
              selected === 'multipleChildren' ? 'ring-2 ring-primary' : ''
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-[#8B5CF6] to-[#A78BFA] rounded-[20px] flex items-center justify-center shadow-[0_6px_20px_rgba(139,92,246,0.3)]">
                <Users className="w-8 h-8 text-white" strokeWidth={2} />
              </div>
              <div className="flex-1 text-left">
                <h3 className="text-foreground">Für mehrere Kinder</h3>
                <p className="text-muted-foreground text-sm mt-1">
                  Erstelle Profile für deine Familie
                </p>
              </div>
            </div>
          </motion.button>

          {/* Adult Option */}
          <motion.button
            onClick={() => handleSelect('adult')}
            className={`w-full bg-card rounded-[24px] p-6 shadow-[0_8px_30px_rgba(139,92,246,0.15)] transition-all active:scale-98 ${
              selected === 'adult' ? 'ring-2 ring-primary' : ''
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-[#F472B6] to-[#EF4444] rounded-[20px] flex items-center justify-center shadow-[0_6px_20px_rgba(244,114,182,0.3)]">
                <User className="w-8 h-8 text-white" strokeWidth={2} />
              </div>
              <div className="flex-1 text-left">
                <h3 className="text-foreground">Für mich selbst</h3>
                <p className="text-muted-foreground text-sm mt-1">
                  Verwalte deine eigenen Leseziele
                </p>
              </div>
            </div>
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
