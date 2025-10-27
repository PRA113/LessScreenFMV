import React from 'react';
import { motion } from 'motion/react';
import { Logo } from './Logo';

interface OnboardingStartProps {
  onNext: () => void;
}

export function OnboardingStart({ onNext }: OnboardingStartProps) {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6 py-12">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center text-center"
      >
        {/* Logo */}
        <motion.div
          className="w-48 h-48 mb-8"
          animate={{
            y: [0, -10, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          <Logo className="w-full h-full drop-shadow-[0_20px_60px_rgba(139,92,246,0.4)]" />
        </motion.div>

        {/* Headline */}
        <div className="mb-6 space-y-1">
          <div className="text-[#FF6F61] text-3xl font-light tracking-wide italic">
            Less Screen.
          </div>
          <div className="text-[#10B981] text-5xl font-extrabold tracking-tight">
            More Growth.
          </div>
        </div>

        <div className="max-w-md mb-12 px-6 py-5 bg-white/80 backdrop-blur-sm rounded-[24px] shadow-[0_8px_32px_rgba(139,92,246,0.12),inset_0_1px_0_rgba(255,255,255,0.8)]">
          <p className="text-foreground/90 leading-relaxed text-center">
            Verwandeln Sie übermäßige Bildschirmzeit in wertvolle Lesezeit. Fördern Sie Konzentration, Fokus und Zielerreichung Ihres Kindes.
          </p>
        </div>

        {/* CTA Button */}
        <motion.button
          onClick={onNext}
          className="bg-primary text-white px-12 py-4 rounded-full shadow-[0_8px_24px_rgba(255,111,97,0.35)] transition-all active:scale-95 text-center"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Los geht's
        </motion.button>
      </motion.div>
    </div>
  );
}
