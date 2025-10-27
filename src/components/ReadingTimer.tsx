import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Play, Pause, Square, Clock } from 'lucide-react';
import { NotificationTemplates, playNotificationSound } from '../utils/notifications';

interface ReadingTimerProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (duration: number) => void;
  profileName: string;
}

export function ReadingTimer({
  isOpen,
  onClose,
  onComplete,
  profileName,
}: ReadingTimerProps) {
  const [mode, setMode] = useState<'setup' | 'running' | 'paused'>('setup');
  const [targetMinutes, setTargetMinutes] = useState('');
  const [remainingSeconds, setRemainingSeconds] = useState(0);
  const [totalSeconds, setTotalSeconds] = useState(0);

  useEffect(() => {
    console.log('🎯 ReadingTimer isOpen changed:', isOpen);
    if (isOpen) {
      console.log('✅ Timer opened! Mode:', mode);
    } else {
      console.log('❌ Timer closed! Resetting state...');
      // Reset timer state when modal is closed
      setMode('setup');
      setTargetMinutes('');
      setRemainingSeconds(0);
      setTotalSeconds(0);
    }
  }, [isOpen]);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (mode === 'running' && remainingSeconds > 0) {
      interval = setInterval(() => {
        setRemainingSeconds((prev) => {
          if (prev <= 1) {
            // Timer completed
            handleTimerComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [mode, remainingSeconds]);



  const handleStart = () => {
    const minutes = parseInt(targetMinutes, 10);
    if (minutes > 0) {
      const seconds = minutes * 60;
      setTotalSeconds(seconds);
      setRemainingSeconds(seconds);
      setMode('running');
    }
  };

  const handlePause = () => {
    setMode('paused');
  };

  const handleResume = () => {
    setMode('running');
  };

  const handleStop = () => {
    const elapsedSeconds = totalSeconds - remainingSeconds;
    const elapsedMinutes = Math.floor(elapsedSeconds / 60);
    
    // Always open Reading Compass if any time was tracked (even 1 second)
    if (elapsedSeconds >= 1) {
      const minutes = elapsedMinutes < 1 ? 1 : elapsedMinutes; // Minimum 1 minute
      onComplete(minutes);
      resetTimer();
    } else {
      // No time tracked, just close
      resetTimer();
      onClose();
    }
  };

  const handleTimerComplete = () => {
    setMode('paused');
    
    const minutes = Math.floor(totalSeconds / 60);

    // Show browser notification using utility
    NotificationTemplates.timerComplete(profileName, minutes);

    // Play notification sound
    playNotificationSound();

    // Complete the session and open Reading Compass after a short delay
    setTimeout(() => {
      resetTimer();
      onComplete(minutes);
    }, 2000);
  };

  const resetTimer = () => {
    setMode('setup');
    setTargetMinutes('');
    setRemainingSeconds(0);
    setTotalSeconds(0);
  };

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hrs > 0) {
      return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progressPercentage = totalSeconds > 0 
    ? ((totalSeconds - remainingSeconds) / totalSeconds) * 100 
    : 0;

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
            transition={{ duration: 0.2 }}
            onAnimationComplete={() => console.log('🎬 Backdrop animation complete')}
            onClick={(e) => {
              console.log('🖱️ Backdrop clicked!', {
                isDirectClick: e.target === e.currentTarget,
                mode,
                willClose: e.target === e.currentTarget && mode === 'setup'
              });
              // Only close if:
              // 1. Clicking directly on backdrop (not bubbled from modal)
              // 2. Timer is in setup mode (not running/paused)
              if (e.target === e.currentTarget && mode === 'setup') {
                console.log('🚪 Closing timer via backdrop click');
                onClose();
              } else if (e.target === e.currentTarget && mode !== 'setup') {
                console.log('⚠️ Backdrop clicked but timer is running - ignoring');
              }
            }}
            className="fixed inset-0 bg-foreground/40 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="fixed inset-x-6 top-1/2 -translate-y-1/2 max-w-md mx-auto bg-card rounded-[28px] shadow-[0_20px_60px_rgba(139,92,246,0.3)] z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-br from-primary to-secondary p-6 relative">
              <button
                onClick={mode === 'setup' ? onClose : handleStop}
                className="absolute top-4 right-4 w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm transition-transform active:scale-95"
              >
                {mode === 'setup' ? (
                  <X className="w-5 h-5 text-white" strokeWidth={2} />
                ) : (
                  <Square className="w-5 h-5 text-white" strokeWidth={2} />
                )}
              </button>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <Clock className="w-6 h-6 text-white" strokeWidth={2} />
                </div>
                <div>
                  <h2 className="text-white">Lesezeit starten</h2>
                  <p className="text-white/80 text-sm">für {profileName}</p>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              {mode === 'setup' ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-6"
                >
                  <div className="space-y-3">
                    <label className="text-foreground flex items-center gap-2">
                      <Clock className="w-5 h-5 text-primary" />
                      Wie lange möchtest du lesen?
                    </label>
                    <input
                      type="number"
                      value={targetMinutes}
                      onChange={(e) => setTargetMinutes(e.target.value)}
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
                          onClick={() => setTargetMinutes(mins.toString())}
                          className={`py-2 rounded-[14px] text-sm transition-all text-center ${
                            targetMinutes === mins.toString()
                              ? 'bg-primary text-white shadow-[0_4px_12px_rgba(139,92,246,0.3)]'
                              : 'bg-muted text-secondary hover:bg-primary/10'
                          }`}
                        >
                          {mins} Min
                        </button>
                      ))}
                    </div>
                  </div>

                  <motion.button
                    onClick={handleStart}
                    disabled={!targetMinutes || parseInt(targetMinutes, 10) <= 0}
                    className="w-full bg-gradient-to-br from-primary to-secondary text-white py-4 rounded-full shadow-[0_8px_24px_rgba(139,92,246,0.35)] transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-center"
                    whileHover={
                      targetMinutes && parseInt(targetMinutes, 10) > 0
                        ? { scale: 1.02 }
                        : {}
                    }
                    whileTap={
                      targetMinutes && parseInt(targetMinutes, 10) > 0
                        ? { scale: 0.98 }
                        : {}
                    }
                  >
                    <Play className="w-5 h-5" strokeWidth={2} />
                    Timer starten
                  </motion.button>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-6"
                >
                  {/* Timer Display */}
                  <div className="relative">
                    {/* Progress Ring */}
                    <svg className="w-64 h-64 mx-auto -rotate-90" viewBox="0 0 200 200">
                      {/* Background Circle */}
                      <circle
                        cx="100"
                        cy="100"
                        r="85"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="12"
                        className="text-muted"
                      />
                      {/* Progress Circle */}
                      <motion.circle
                        cx="100"
                        cy="100"
                        r="85"
                        fill="none"
                        stroke="url(#gradient)"
                        strokeWidth="12"
                        strokeLinecap="round"
                        strokeDasharray={534.07}
                        initial={{ strokeDashoffset: 534.07 }}
                        animate={{
                          strokeDashoffset: 534.07 - (534.07 * progressPercentage) / 100,
                        }}
                        transition={{ duration: 0.5 }}
                      />
                      <defs>
                        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#8B5CF6" />
                          <stop offset="100%" stopColor="#A78BFA" />
                        </linearGradient>
                      </defs>
                    </svg>

                    {/* Time Display */}
                    <div className="absolute inset-0 flex items-center justify-center flex-col">
                      <motion.h1
                        key={remainingSeconds}
                        initial={{ scale: 1.1 }}
                        animate={{ scale: 1 }}
                        className="text-foreground text-5xl"
                      >
                        {formatTime(remainingSeconds)}
                      </motion.h1>
                      <p className="text-muted-foreground text-sm mt-2">
                        {Math.floor((totalSeconds - remainingSeconds) / 60)} Min gelesen
                      </p>
                    </div>
                  </div>

                  {/* Controls */}
                  <div className="flex gap-3">
                    {mode === 'running' ? (
                      <motion.button
                        onClick={handlePause}
                        className="flex-1 bg-gradient-to-br from-accent to-accent/80 text-white py-4 rounded-full shadow-[0_8px_24px_rgba(244,114,182,0.35)] flex items-center justify-center gap-2 text-center"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Pause className="w-5 h-5" strokeWidth={2} />
                        Pause
                      </motion.button>
                    ) : (
                      <motion.button
                        onClick={handleResume}
                        className="flex-1 bg-gradient-to-br from-primary to-secondary text-white py-4 rounded-full shadow-[0_8px_24px_rgba(139,92,246,0.35)] flex items-center justify-center gap-2 text-center"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Play className="w-5 h-5" strokeWidth={2} />
                        Fortsetzen
                      </motion.button>
                    )}

                    <motion.button
                      onClick={handleStop}
                      className="flex-1 bg-gradient-to-br from-destructive/90 to-destructive text-white py-4 rounded-full flex items-center justify-center gap-2 shadow-[0_4px_16px_rgba(239,68,68,0.25)] text-center"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Square className="w-5 h-5" strokeWidth={2} />
                      Beenden & Validieren
                    </motion.button>
                  </div>

                  {remainingSeconds === 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-gradient-to-br from-[#14B8A6]/10 to-[#14B8A6]/5 rounded-[16px] p-4 text-center"
                    >
                      <p className="text-lg">🎉 Geschafft!</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Super gemacht, {profileName}!
                      </p>
                    </motion.div>
                  )}
                </motion.div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
