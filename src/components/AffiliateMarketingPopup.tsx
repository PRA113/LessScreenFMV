import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ExternalLink, Gift } from 'lucide-react';

interface AffiliateMarketingPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AffiliateMarketingPopup({
  isOpen,
  onClose,
}: AffiliateMarketingPopupProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-foreground/60 backdrop-blur-md z-50"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-6"
          >
            <div className="w-full max-w-md bg-background rounded-[28px] shadow-[0_20px_60px_rgba(139,92,246,0.3)] overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-br from-primary to-secondary p-6 relative">
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm transition-transform active:scale-95"
                >
                  <X className="w-5 h-5 text-white" strokeWidth={2} />
                </button>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                    <Gift className="w-6 h-6 text-white" strokeWidth={2} />
                  </div>
                  <div>
                    <h2 className="text-white">Partner-Angebote</h2>
                    <p className="text-white/80 text-sm">Exklusive Empfehlungen</p>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 space-y-4">
                <div className="text-center mb-4">
                  <div className="w-20 h-20 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-4xl">🎁</span>
                  </div>
                  <h3 className="text-foreground mb-2">Coming Soon!</h3>
                  <p className="text-muted-foreground text-sm">
                    Hier findest du bald exklusive Angebote und Empfehlungen unserer Partner.
                  </p>
                </div>

                {/* Platzhalter für zukünftige Affiliate-Links */}
                <div className="space-y-3">
                  <div className="bg-card rounded-[20px] p-4 shadow-[0_4px_20px_rgba(139,92,246,0.08)] border-2 border-dashed border-primary/20">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-2xl">📚</span>
                      </div>
                      <div className="flex-1">
                        <p className="text-foreground text-sm">Bücher & E-Reader</p>
                        <p className="text-muted-foreground text-xs">Tolle Angebote für Leser</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-card rounded-[20px] p-4 shadow-[0_4px_20px_rgba(139,92,246,0.08)] border-2 border-dashed border-primary/20">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-2xl">🎓</span>
                      </div>
                      <div className="flex-1">
                        <p className="text-foreground text-sm">Lern-Apps & Kurse</p>
                        <p className="text-muted-foreground text-xs">Bildung macht Spaß</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-card rounded-[20px] p-4 shadow-[0_4px_20px_rgba(139,92,246,0.08)] border-2 border-dashed border-primary/20">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-2xl">🎮</span>
                      </div>
                      <div className="flex-1">
                        <p className="text-foreground text-sm">Lernspiele</p>
                        <p className="text-muted-foreground text-xs">Spielend lernen</p>
                      </div>
                    </div>
                  </div>
                </div>

                <motion.button
                  onClick={onClose}
                  className="w-full bg-gradient-to-br from-primary to-secondary text-white py-4 rounded-full shadow-[0_8px_24px_rgba(139,92,246,0.35)] text-center mt-6"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Verstanden
                </motion.button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
