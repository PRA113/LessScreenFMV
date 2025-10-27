import React, { useState } from 'react';
import { motion } from 'motion/react';
import { User, Baby } from 'lucide-react';

interface OnboardingProfileProps {
  userType: 'oneChild' | 'adult';
  onNext: (name: string) => void;
}

export function OnboardingProfile({ userType, onNext }: OnboardingProfileProps) {
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onNext(name);
    }
  };

  const isChild = userType === 'oneChild';

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <h1 className="text-foreground text-center mb-4">
          {isChild ? 'Kinderprofil' : 'Dein Profil'}
        </h1>
        <p className="text-muted-foreground text-center mb-12">
          {isChild
            ? 'Wie heißt dein Kind?'
            : 'Wie möchtest du genannt werden?'}
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Avatar Selection */}
          <div className="flex justify-center mb-8">
            <div className={`w-24 h-24 rounded-full flex items-center justify-center shadow-[0_10px_40px_rgba(139,92,246,0.3)] ${
              isChild 
                ? 'bg-gradient-to-br from-[#14B8A6] to-[#0891B2]' 
                : 'bg-gradient-to-br from-[#F472B6] to-[#EF4444]'
            }`}>
              {isChild ? (
                <Baby className="w-12 h-12 text-white" strokeWidth={2} />
              ) : (
                <User className="w-12 h-12 text-white" strokeWidth={2} />
              )}
            </div>
          </div>

          {/* Name Input */}
          <div className="space-y-2">
            <label htmlFor="name" className="text-foreground block">
              Name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={isChild ? 'Name deines Kindes' : 'Dein Name'}
              className="w-full bg-card rounded-[20px] px-6 py-4 border-2 border-transparent focus:border-primary outline-none shadow-[0_4px_20px_rgba(139,92,246,0.1)] transition-all"
            />
          </div>

          {/* Submit Button */}
          <motion.button
            type="submit"
            disabled={!name.trim()}
            className="w-full bg-gradient-to-r from-[#8B5CF6] via-[#F472B6] to-[#EF4444] text-white py-4 rounded-full shadow-[0_8px_24px_rgba(139,92,246,0.35)] transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed text-center"
            whileHover={name.trim() ? { scale: 1.02 } : {}}
            whileTap={name.trim() ? { scale: 0.98 } : {}}
          >
            Weiter
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}
