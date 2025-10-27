import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Clock, FileText } from 'lucide-react';

interface SessionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (duration: number, note: string) => void;
  profileName: string;
}

export function SessionModal({
  isOpen,
  onClose,
  onSubmit,
  profileName,
}: SessionModalProps) {
  const [duration, setDuration] = useState('');
  const [note, setNote] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const durationNum = parseInt(duration, 10);
    if (durationNum > 0) {
      onSubmit(durationNum, note);
      setDuration('');
      setNote('');
      onClose();
    }
  };

  const quickDurations = [15, 30, 45, 60];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-foreground/40 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed inset-x-6 top-1/2 -translate-y-1/2 max-w-md mx-auto bg-card rounded-[28px] shadow-[0_20px_60px_rgba(42,59,82,0.3)] z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-br from-primary to-[#FF8A80] p-6 relative">
              <button
                onClick={onClose}
                className="absolute top-4 right-4 w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm transition-transform active:scale-95"
              >
                <X className="w-5 h-5 text-white" strokeWidth={2} />
              </button>
              <h2 className="text-white">Session hinzufügen</h2>
              <p className="text-white/80 text-sm mt-1">für {profileName}</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Duration Input */}
              <div className="space-y-3">
                <label className="text-foreground flex items-center gap-2">
                  <Clock className="w-5 h-5 text-primary" />
                  Lesedauer (Minuten)
                </label>
                <input
                  type="number"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  placeholder="z.B. 30"
                  min="1"
                  className="w-full bg-muted rounded-[18px] px-6 py-4 border-2 border-transparent focus:border-primary outline-none transition-all"
                />
                
                {/* Quick Duration Buttons */}
                <div className="grid grid-cols-4 gap-2">
                  {quickDurations.map((mins) => (
                    <button
                      key={mins}
                      type="button"
                      onClick={() => setDuration(mins.toString())}
                      className={`py-2 rounded-[14px] text-sm transition-all text-center ${
                        duration === mins.toString()
                          ? 'bg-primary text-white shadow-[0_4px_12px_rgba(255,111,97,0.3)]'
                          : 'bg-muted text-secondary hover:bg-secondary/10'
                      }`}
                    >
                      {mins} Min
                    </button>
                  ))}
                </div>
              </div>

              {/* Note Input */}
              <div className="space-y-3">
                <label className="text-foreground flex items-center gap-2">
                  <FileText className="w-5 h-5 text-secondary" />
                  Notiz (optional)
                </label>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Was hast du gelesen?"
                  rows={3}
                  className="w-full bg-muted rounded-[18px] px-6 py-4 border-2 border-transparent focus:border-primary outline-none resize-none transition-all"
                />
              </div>

              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={!duration || parseInt(duration, 10) <= 0}
                className="w-full bg-primary text-white py-4 rounded-full shadow-[0_8px_24px_rgba(255,111,97,0.35)] transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed text-center"
                whileHover={
                  duration && parseInt(duration, 10) > 0 ? { scale: 1.02 } : {}
                }
                whileTap={
                  duration && parseInt(duration, 10) > 0 ? { scale: 0.98 } : {}
                }
              >
                Session speichern
              </motion.button>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
