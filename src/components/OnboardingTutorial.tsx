import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronRight, ChevronLeft, Check } from "lucide-react";

interface OnboardingTutorialProps {
  onComplete: () => void;
}

export function OnboardingTutorial({
  onComplete,
}: OnboardingTutorialProps) {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      emoji: "📚⚡",
      title: "Dein Leseverhältnis",
      description:
        "Für jede Minute Lesezeit erhältst du eine Minute Bildschirmzeit",
      visual: "ratio",
    },
    {
      emoji: "⏱️",
      title: "Starte den Timer",
      description:
        "Beginne mit dem Lesen und der Timer zählt automatisch deine Lesezeit",
      visual: "timer",
    },
    {
      emoji: "🔔",
      title: "Bleib informiert",
      description:
        "Erhalte Benachrichtigungen wenn deine Lesezeit abgelaufen ist",
      visual: "notification",
    },
    {
      emoji: "📸",
      title: "Lese-Kompass",
      description:
        "Fotografiere eine Buchseite und beantworte Fragen zum Gelesenen",
      visual: "compass",
    },
    {
      emoji: "🎯",
      title: "Setze Ziele",
      description:
        "Erreiche deine Leseziele und sammle Belohnungen!",
      visual: "goals",
    },
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/10 flex flex-col items-center justify-center p-6">
      {/* Progress Dots */}
      <div className="flex gap-2 mb-8">
        {steps.map((_, index) => (
          <motion.div
            key={index}
            className={`h-2 rounded-full transition-all ${
              index === currentStep
                ? "w-8 bg-primary"
                : index < currentStep
                  ? "w-2 bg-primary/50"
                  : "w-2 bg-primary/20"
            }`}
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ delay: index * 0.05 }}
          />
        ))}
      </div>

      {/* Content Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-md"
        >
          <div className="bg-card rounded-[32px] p-8 shadow-[0_20px_60px_rgba(139,92,246,0.15)] border border-primary/10">
            {/* Emoji Header */}
            <div className="flex justify-center mb-6">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{
                  type: "spring",
                  stiffness: 200,
                  damping: 15,
                }}
                className="text-7xl"
              >
                {steps[currentStep].emoji}
              </motion.div>
            </div>

            {/* Title */}
            <h2 className="text-center text-foreground mb-3">
              {steps[currentStep].title}
            </h2>

            {/* Description */}
            <p className="text-center text-muted-foreground mb-8">
              {steps[currentStep].description}
            </p>

            {/* Visual Component */}
            <div className="mb-8">
              {steps[currentStep].visual === "ratio" && (
                <RatioVisual />
              )}
              {steps[currentStep].visual === "timer" && (
                <TimerVisual />
              )}
              {steps[currentStep].visual === "notification" && (
                <NotificationVisual />
              )}
              {steps[currentStep].visual === "compass" && (
                <CompassVisual />
              )}
              {steps[currentStep].visual === "goals" && (
                <GoalsVisual />
              )}
            </div>

            {/* Navigation Buttons */}
            <div className="flex gap-3">
              {currentStep > 0 && (
                <button
                  onClick={handlePrev}
                  className="flex-1 bg-muted hover:bg-muted/80 text-foreground py-4 rounded-[20px] transition-all active:scale-95 flex items-center justify-center gap-2"
                >
                  <ChevronLeft size={20} />
                  Zurück
                </button>
              )}
              <button
                onClick={handleNext}
                className={`${
                  currentStep === 0 ? "flex-1" : "flex-1"
                } bg-gradient-to-r from-primary to-secondary hover:shadow-lg text-primary-foreground py-4 rounded-[20px] transition-all active:scale-95 flex items-center justify-center gap-2`}
              >
                {currentStep === steps.length - 1 ? (
                  <>
                    Los geht's!
                    <Check size={20} />
                  </>
                ) : (
                  <>
                    Weiter
                    <ChevronRight size={20} />
                  </>
                )}
              </button>
            </div>

            {/* Skip Button */}
            {currentStep < steps.length - 1 && (
              <button
                onClick={onComplete}
                className="w-full mt-4 text-muted-foreground text-sm py-2 hover:text-foreground transition-colors text-center"
              >
                Tutorial überspringen
              </button>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

// Visual Components for each step
function RatioVisual() {
  return (
    <div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-[24px] p-6">
      <div className="flex items-center justify-center gap-4">
        {/* Reading Time */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex-1 bg-card rounded-[20px] p-4 shadow-lg"
        >
          <div className="text-4xl mb-2 text-center">📖</div>
          <div className="text-xs text-muted-foreground text-center mb-1">
            Lesezeit
          </div>
          <div className="text-2xl text-primary text-center">
            30 min
          </div>
        </motion.div>

        {/* Arrow */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.4, type: "spring" }}
          className="text-3xl"
        >
          →
        </motion.div>

        {/* Screen Time */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="flex-1 bg-card rounded-[20px] p-4 shadow-lg"
        >
          <div className="text-4xl mb-2 text-center">📱</div>
          <div className="text-xs text-muted-foreground text-center mb-1">
            Bildschirmzeit
          </div>
          <div className="text-2xl text-accent text-center">
            30 min
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="mt-4 text-center text-sm text-primary"
      >
        ✨ 1:1 Verhältnis - Fair & Motivierend!
      </motion.div>
    </div>
  );
}

function TimerVisual() {
  const [isRunning, setIsRunning] = useState(false);

  return (
    <div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-[24px] p-6">
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        className="bg-card rounded-[20px] p-6 shadow-lg text-center"
      >
        <div className="text-5xl mb-4">⏱️</div>
        <motion.div
          animate={{ scale: isRunning ? [1, 1.05, 1] : 1 }}
          transition={{
            repeat: isRunning ? Infinity : 0,
            duration: 1,
          }}
          className="text-4xl text-primary mb-4"
        >
          {isRunning ? "00:15" : "00:00"}
        </motion.div>
        <button
          onClick={() => setIsRunning(!isRunning)}
          className={`px-6 py-3 rounded-[16px] transition-all ${
            isRunning
              ? "bg-destructive text-destructive-foreground"
              : "bg-gradient-to-r from-primary to-secondary text-primary-foreground"
          }`}
        >
          {isRunning ? "⏸️ Pause" : "▶️ Start"}
        </button>
      </motion.div>

      <div className="mt-4 text-center text-sm text-primary">
        ✨ Drücke einfach Start und lese los!
      </div>
    </div>
  );
}

function NotificationVisual() {
  return (
    <div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-[24px] p-6">
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-card rounded-[20px] p-4 shadow-lg mb-4"
      >
        <div className="flex items-start gap-3">
          <div className="text-3xl">🔔</div>
          <div className="flex-1">
            <div className="text-sm text-foreground mb-1">
              LessScreen
            </div>
            <div className="text-xs text-muted-foreground">
              Deine Lesezeit ist vorbei! Du hast 30 Minuten
              gelesen 🎉
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="bg-card rounded-[20px] p-4 shadow-lg"
      >
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm text-foreground">
            Benachrichtigungen
          </span>
          <span className="text-2xl">✅</span>
        </div>
        <div className="text-xs text-muted-foreground">
          Wir erinnern dich, wenn es Zeit ist!
        </div>
      </motion.div>
    </div>
  );
}

function CompassVisual() {
  return (
    <div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-[24px] p-6">
      {/* Book Photo */}
      <motion.div
        initial={{ rotateY: -15 }}
        animate={{ rotateY: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-card rounded-[20px] p-4 shadow-lg mb-4"
      >
        <div className="flex items-center gap-3 mb-3">
          <div className="text-3xl">📸</div>
          <div className="text-sm text-foreground">
            Schritt 1: Foto machen
          </div>
        </div>
        <div className="bg-gradient-to-br from-primary/5 to-secondary/5 rounded-[12px] h-24 flex items-center justify-center">
          <div className="text-4xl">📖</div>
        </div>
      </motion.div>

      {/* Questions */}
      <motion.div
        initial={{ rotateY: 15 }}
        animate={{ rotateY: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-card rounded-[20px] p-4 shadow-lg"
      >
        <div className="flex items-center gap-3 mb-3">
          <div className="text-3xl">❓</div>
          <div className="text-sm text-foreground">
            Schritt 2: Fragen beantworten
          </div>
        </div>
        <div className="space-y-2">
          <div className="bg-primary/10 rounded-[12px] px-3 py-2 text-xs text-foreground">
            Worum ging es in dem Kapitel?
          </div>
          <div className="bg-primary/10 rounded-[12px] px-3 py-2 text-xs text-foreground">
            Wer war die Hauptfigur?
          </div>
        </div>
      </motion.div>

      <div className="mt-4 text-center text-sm text-primary">
        ✨ Somit wissen Sie, ob das Kind das Gelesene verstanden
        hat!
      </div>
    </div>
  );
}

function GoalsVisual() {
  return (
    <div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-[24px] p-6">
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        className="bg-card rounded-[20px] p-5 shadow-lg"
      >
        {/* Goal Item */}
        <div className="flex items-center gap-3 mb-4">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-2xl"
          >
            🎯
          </motion.div>
          <div className="flex-1">
            <div className="text-sm text-foreground mb-1">
              Wöchentliches Ziel
            </div>
            <div className="text-xs text-muted-foreground">
              5 Stunden lesen
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="bg-muted rounded-full h-3 overflow-hidden mb-3">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "60%" }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="bg-gradient-to-r from-primary to-secondary h-full rounded-full"
          />
        </div>

        <div className="text-center text-sm text-primary">
          3h / 5h geschafft! 🌟
        </div>
      </motion.div>

      {/* Rewards */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="mt-4 flex justify-center gap-2"
      >
        {["🏆", "⭐", "🎖️", "👑"].map((emoji, index) => (
          <motion.div
            key={index}
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{
              delay: 0.8 + index * 0.1,
              type: "spring",
            }}
            className="w-12 h-12 bg-gradient-to-br from-accent/20 to-accent/10 rounded-[12px] flex items-center justify-center text-2xl shadow-md"
          >
            {emoji}
          </motion.div>
        ))}
      </motion.div>

      <div className="mt-4 text-center text-sm text-primary">
        ✨ Erreiche Ziele und sammle Belohnungen!
      </div>
    </div>
  );
}