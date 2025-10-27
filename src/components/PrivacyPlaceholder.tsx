import React from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Shield, Lock, Eye, FileText } from 'lucide-react';

interface PrivacyPlaceholderProps {
  onBack: () => void;
}

export function PrivacyPlaceholder({ onBack }: PrivacyPlaceholderProps) {
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
          <h1 className="text-primary-foreground">Datenschutz</h1>
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
            🔒
          </motion.div>

          <h2 className="text-foreground mb-3">In Entwicklung</h2>
          <p className="text-muted-foreground mb-8">
            Die Datenschutzrichtlinien werden aktuell erstellt und sind bald verfügbar.
          </p>

          {/* Features Preview */}
          <div className="space-y-3 mb-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="flex items-center gap-3 p-4 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-[16px]"
            >
              <Shield className="text-primary" size={24} />
              <span className="text-sm text-foreground">Datenschutz & Sicherheit</span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="flex items-center gap-3 p-4 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-[16px]"
            >
              <Lock className="text-primary" size={24} />
              <span className="text-sm text-foreground">Verschlüsselte Daten</span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="flex items-center gap-3 p-4 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-[16px]"
            >
              <Eye className="text-primary" size={24} />
              <span className="text-sm text-foreground">Transparente Nutzung</span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="flex items-center gap-3 p-4 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-[16px]"
            >
              <FileText className="text-primary" size={24} />
              <span className="text-sm text-foreground">DSGVO-konform</span>
            </motion.div>
          </div>

          {/* Info Box */}
          <div className="p-6 bg-gradient-to-br from-accent/10 to-accent/5 rounded-[20px]">
            <div className="text-5xl mb-3">🚧</div>
            <p className="text-sm text-foreground">
              Diese Seite wird während der Testphase vervollständigt.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
