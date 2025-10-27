import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Star, ExternalLink } from 'lucide-react';

interface BookRecommendationPopupProps {
  isOpen: boolean;
  onClose: () => void;
  profileName: string;
}

export function BookRecommendationPopup({
  isOpen,
  onClose,
  profileName,
}: BookRecommendationPopupProps) {
  // Platzhalter-Buchempfehlungen
  const recommendations = [
    {
      id: 1,
      title: 'Der kleine Prinz',
      author: 'Antoine de Saint-Exupéry',
      description: 'Ein zeitloser Klassiker über Freundschaft und das Wesentliche im Leben',
      rating: 4.8,
      ageRange: '8-12 Jahre',
      emoji: '👑',
    },
    {
      id: 2,
      title: 'Harry Potter und der Stein der Weisen',
      author: 'J.K. Rowling',
      description: 'Der Beginn einer magischen Reise in die Welt der Zauberei',
      rating: 4.9,
      ageRange: '9-14 Jahre',
      emoji: '⚡',
    },
    {
      id: 3,
      title: 'Die unendliche Geschichte',
      author: 'Michael Ende',
      description: 'Ein Abenteuer zwischen Fantasie und Wirklichkeit',
      rating: 4.7,
      ageRange: '10-14 Jahre',
      emoji: '📖',
    },
  ];

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
            <div className="w-full max-w-md bg-background rounded-[28px] shadow-[0_20px_60px_rgba(139,92,246,0.3)] overflow-hidden max-h-[90vh] flex flex-col">
              {/* Header */}
              <div className="bg-gradient-to-br from-primary to-secondary p-6 relative flex-shrink-0">
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm transition-transform active:scale-95"
                >
                  <X className="w-5 h-5 text-white" strokeWidth={2} />
                </button>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                    <span className="text-2xl">🎉</span>
                  </div>
                  <div>
                    <h2 className="text-white">Glückwunsch!</h2>
                    <p className="text-white/80 text-sm">{profileName} hat ein Buch beendet</p>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-6">
                <div className="text-center mb-6">
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
                    className="w-20 h-20 bg-gradient-to-br from-[#14B8A6] to-[#14B8A6]/80 rounded-full flex items-center justify-center mx-auto mb-4 shadow-[0_8px_24px_rgba(20,184,166,0.35)]"
                  >
                    <span className="text-4xl">🏆</span>
                  </motion.div>
                  <h3 className="text-foreground mb-2">Buch erfolgreich beendet!</h3>
                  <p className="text-muted-foreground text-sm">
                    Hier sind ein paar Empfehlungen für das nächste Lesevergnügen:
                  </p>
                </div>

                <div className="space-y-4">
                  {recommendations.map((book, index) => (
                    <motion.div
                      key={book.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 + 0.3 }}
                      className="bg-card rounded-[20px] p-5 shadow-[0_4px_20px_rgba(139,92,246,0.08)] hover:shadow-[0_8px_32px_rgba(139,92,246,0.15)] transition-shadow"
                    >
                      <div className="flex gap-4">
                        <div className="w-16 h-20 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-[12px] flex items-center justify-center flex-shrink-0">
                          <span className="text-3xl">{book.emoji}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-foreground mb-1 truncate">{book.title}</h4>
                          <p className="text-muted-foreground text-sm mb-2">{book.author}</p>
                          <p className="text-muted-foreground text-xs mb-3 line-clamp-2">
                            {book.description}
                          </p>
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-1">
                              <Star className="w-4 h-4 text-[#FFB800] fill-[#FFB800]" />
                              <span className="text-sm text-foreground">{book.rating}</span>
                            </div>
                            <span className="text-xs text-muted-foreground bg-primary/10 px-2 py-1 rounded-full">
                              {book.ageRange}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <motion.button
                        className="w-full mt-4 py-2.5 px-4 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-[14px] flex items-center justify-center gap-2 text-primary transition-all hover:from-primary/20 hover:to-secondary/20 text-center"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <ExternalLink className="w-4 h-4" />
                        <span className="text-sm">Mehr erfahren</span>
                      </motion.button>
                    </motion.div>
                  ))}
                </div>

                <motion.button
                  onClick={onClose}
                  className="w-full bg-gradient-to-br from-primary to-secondary text-white py-4 rounded-full shadow-[0_8px_24px_rgba(139,92,246,0.35)] mt-6 text-center"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Später ansehen
                </motion.button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
