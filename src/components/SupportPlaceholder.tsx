import React from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Mail, MessageCircle, BookOpen, HelpCircle } from 'lucide-react';

interface SupportPlaceholderProps {
  onBack: () => void;
}

export function SupportPlaceholder({ onBack }: SupportPlaceholderProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/10 pb-24">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-secondary p-6 pb-8 shadow-lg">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 hover:bg-white/20 rounded-full transition-colors"
          >
            <ArrowLeft className="text-primary-foreground" size={24} />
          </button>
          <h1 className="text-primary-foreground">Support & Hilfe</h1>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 -mt-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-[28px] p-8 shadow-[0_10px_40px_rgba(139,92,246,0.15)] text-center"
        >
          {/* Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            className="w-32 h-32 mx-auto bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full flex items-center justify-center text-7xl mb-6 shadow-lg"
          >
            💬
          </motion.div>

          <h2 className="text-foreground mb-3">Wir sind für dich da!</h2>
          <p className="text-muted-foreground mb-8">
            Das Support-Center wird aktuell aufgebaut und ist bald verfügbar.
          </p>

          {/* Support Options Preview */}
          <div className="space-y-3 mb-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="flex items-center gap-3 p-4 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-[16px]"
            >
              <Mail className="text-primary" size={24} />
              <div className="flex-1 text-left">
                <div className="text-sm text-foreground">E-Mail Support</div>
                <div className="text-xs text-muted-foreground">Antwort innerhalb 24h</div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="flex items-center gap-3 p-4 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-[16px]"
            >
              <MessageCircle className="text-primary" size={24} />
              <div className="flex-1 text-left">
                <div className="text-sm text-foreground">Live Chat</div>
                <div className="text-xs text-muted-foreground">Mo-Fr, 9-18 Uhr</div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="flex items-center gap-3 p-4 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-[16px]"
            >
              <BookOpen className="text-primary" size={24} />
              <div className="flex-1 text-left">
                <div className="text-sm text-foreground">Wissensdatenbank</div>
                <div className="text-xs text-muted-foreground">Häufige Fragen & Tutorials</div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="flex items-center gap-3 p-4 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-[16px]"
            >
              <HelpCircle className="text-primary" size={24} />
              <div className="flex-1 text-left">
                <div className="text-sm text-foreground">FAQ</div>
                <div className="text-xs text-muted-foreground">Schnelle Antworten</div>
              </div>
            </motion.div>
          </div>

          {/* Contact Info Placeholder */}
          <div className="p-6 bg-gradient-to-br from-accent/10 to-accent/5 rounded-[20px] mb-4">
            <div className="text-5xl mb-3">📧</div>
            <p className="text-sm text-foreground mb-2">
              Kontaktiere uns während der Testphase:
            </p>
            <p className="text-sm text-primary">
              support@lessscreen.app
            </p>
          </div>

          {/* Info Box */}
          <div className="p-4 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-[16px]">
            <div className="text-4xl mb-2">🚀</div>
            <p className="text-xs text-muted-foreground">
              Vollständiges Support-System kommt bald!
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
