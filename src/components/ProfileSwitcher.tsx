import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronDown, User } from "lucide-react";

interface Profile {
  id: string;
  name: string;
  emoji?: string;
  avatar?: string;
}

interface ProfileSwitcherProps {
  profiles: Profile[];
  currentProfile: Profile;
  onProfileChange: (profile: Profile) => void;
  rankEmoji?: string;
}

export function ProfileSwitcher({
  profiles,
  currentProfile,
  onProfileChange,
  rankEmoji,
}: ProfileSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-white/20 backdrop-blur-md rounded-[16px] px-4 py-2.5 border border-white/30 shadow-lg flex items-center gap-2.5"
        whileTap={{ scale: 0.98 }}
      >
        <div className="w-8 h-8 bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center">
          {rankEmoji ? (
            <span className="text-lg">
              {rankEmoji}
            </span>
          ) : currentProfile.emoji ? (
            <span className="text-lg">
              {currentProfile.emoji}
            </span>
          ) : (
            <User
              className="w-4 h-4 text-white"
              strokeWidth={2}
            />
          )}
        </div>
        <span className="flex-1 text-left text-white text-sm">
          {currentProfile.name}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="w-4 h-4 text-white/80" />
        </motion.div>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />

            {/* Dropdown */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-full left-0 right-0 mt-2 bg-white/95 backdrop-blur-md rounded-[16px] shadow-[0_10px_40px_rgba(0,0,0,0.15)] border border-white/40 overflow-hidden z-50"
            >
              {profiles.map((profile) => (
                <button
                  key={profile.id}
                  onClick={() => {
                    onProfileChange(profile);
                    setIsOpen(false);
                  }}
                  className={`w-full px-4 py-3 flex items-center gap-2.5 transition-colors ${
                    profile.id === currentProfile.id
                      ? "bg-primary/10"
                      : "hover:bg-primary/5"
                  }`}
                >
                  <div
                    className="w-8 h-8 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full flex items-center justify-center"
                  >
                    {profile.emoji ? (
                      <span className="text-lg">
                        {profile.emoji}
                      </span>
                    ) : (
                      <User
                        className="w-4 h-4 text-primary"
                        strokeWidth={2}
                      />
                    )}
                  </div>
                  <span className="flex-1 text-left text-foreground text-sm">
                    {profile.name}
                  </span>
                </button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}