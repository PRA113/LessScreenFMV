import React from 'react';
import { motion } from 'motion/react';
import { Home, Settings, BookOpen } from 'lucide-react';

interface LiquidNavBarProps {
  activeTab: 'dashboard' | 'add' | 'settings';
  onTabChange: (tab: 'dashboard' | 'add' | 'settings') => void;
}

export function LiquidNavBar({ activeTab, onTabChange }: LiquidNavBarProps) {
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-md">
      <div className="relative bg-white rounded-[28px] px-4 py-3 shadow-[0_10px_40px_rgba(139,92,246,0.25)]">
        {/* Nav Items with per-button centered blob */}
        <div className="relative grid grid-cols-3 gap-0">
          {/* Dashboard Button */}
          <button
            onClick={() => onTabChange('dashboard')}
            className="relative w-14 h-14 grid place-items-center transition-transform active:scale-95 justify-self-start"
          >
            {activeTab === 'dashboard' && (
              <>
                <motion.div
                  className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-primary rounded-full blur-sm opacity-30 z-10"
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
                <motion.div
                  className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 bg-primary rounded-full z-10"
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              </>
            )}
            <Home
              className={`relative z-20 transition-colors ${
                activeTab === 'dashboard' ? 'text-white' : 'text-muted-foreground'
              }`}
              size={24}
              strokeWidth={2.5}
            />
          </button>

          {/* Add Button (Center, Larger) */}
          <button
            onClick={() => {
              console.log('📚 Middle button clicked - opening Reading Timer');
              onTabChange('add');
            }}
            className="relative w-16 h-16 grid place-items-center transition-transform active:scale-95 justify-self-center z-30 pointer-events-auto cursor-pointer"
            style={{ touchAction: 'manipulation' }}
          >
            {activeTab === 'add' && (
              <>
                <motion.div
                  className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-primary rounded-full blur-sm opacity-30 z-10"
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
                <motion.div
                  className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-primary rounded-full z-10"
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              </>
            )}
            <BookOpen
              className={`relative z-20 transition-colors ${
                activeTab === 'add' ? 'text-white' : 'text-primary'
              }`}
              size={28}
              strokeWidth={2.5}
            />
          </button>

          {/* Settings Button */}
          <button
            onClick={() => onTabChange('settings')}
            className="relative w-14 h-14 grid place-items-center transition-transform active:scale-95 justify-self-end"
          >
            {activeTab === 'settings' && (
              <>
                <motion.div
                  className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-primary rounded-full blur-sm opacity-30 z-10"
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
                <motion.div
                  className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 bg-primary rounded-full z-10"
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              </>
            )}
            <Settings
              className={`relative z-20 transition-colors ${
                activeTab === 'settings' ? 'text-white' : 'text-muted-foreground'
              }`}
              size={24}
              strokeWidth={2.5}
            />
          </button>
        </div>
      </div>
    </div>
  );
}
