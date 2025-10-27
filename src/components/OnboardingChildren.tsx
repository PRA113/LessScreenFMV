import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Baby, Plus, Trash2 } from 'lucide-react';

interface Child {
  id: string;
  name: string;
}

interface OnboardingChildrenProps {
  onComplete: (children: Child[]) => void;
}

const START_RANK_AVATARS = ['🐛', '🪲', '🐌', '🦗', '🐜', '🪰']; // Bücherwürmchen-Rang Avatare

export function OnboardingChildren({ onComplete }: OnboardingChildrenProps) {
  const [children, setChildren] = useState<Child[]>([]);
  const [currentName, setCurrentName] = useState('');

  const addChild = () => {
    if (currentName.trim()) {
      setChildren([
        ...children,
        { id: Date.now().toString(), name: currentName.trim() },
      ]);
      setCurrentName('');
    }
  };

  const removeChild = (id: string) => {
    setChildren(children.filter((child) => child.id !== id));
  };

  const handleSubmit = () => {
    onComplete(children);
  };

  return (
    <div className="h-screen bg-background flex flex-col px-6 py-12 overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md mx-auto h-full flex flex-col"
      >
        <div className="flex-shrink-0">
          <h1 className="text-foreground text-center mb-4">Kinderprofile</h1>
          <p className="text-secondary text-center mb-8">
            Erstelle Profile für deine Kinder.
          </p>

          {/* Add Child Input */}
          <div className="mb-6">
            <div className="flex gap-2">
              <input
                type="text"
                value={currentName}
                onChange={(e) => setCurrentName(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addChild()}
                placeholder="Name des Kindes"
                className="flex-1 bg-card rounded-[20px] px-6 py-4 border-2 border-transparent focus:border-primary outline-none shadow-[0_4px_20px_rgba(122,137,185,0.1)] transition-all"
              />
              <motion.button
                onClick={addChild}
                disabled={!currentName.trim()}
                className="w-14 h-14 bg-primary text-white rounded-full flex items-center justify-center shadow-[0_6px_20px_rgba(255,111,97,0.3)] disabled:opacity-50 disabled:cursor-not-allowed"
                whileHover={currentName.trim() ? { scale: 1.05 } : {}}
                whileTap={currentName.trim() ? { scale: 0.95 } : {}}
              >
                <Plus className="w-6 h-6" strokeWidth={2.5} />
              </motion.button>
            </div>
          </div>
        </div>

        {/* Children List */}
        <div className="flex-1 overflow-y-auto space-y-3 mb-6">
          {children.map((child, index) => (
            <motion.div
              key={child.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="bg-card rounded-[20px] p-4 shadow-[0_4px_20px_rgba(122,137,185,0.1)] flex items-center gap-4"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-secondary to-[#9BA8CD] rounded-full flex items-center justify-center text-2xl">
                {START_RANK_AVATARS[index % START_RANK_AVATARS.length]}
              </div>
              <div className="flex-1">
                <h4 className="text-foreground">{child.name}</h4>
              </div>
              <button
                onClick={() => removeChild(child.id)}
                className="w-10 h-10 flex items-center justify-center text-secondary hover:text-destructive transition-colors"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </motion.div>
          ))}

          {children.length === 0 && (
            <div className="text-center py-12 text-secondary">
              <Baby className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Noch keine Kinderprofile erstellt.</p>
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div className="flex-shrink-0 relative z-10">
          <motion.button
            onClick={handleSubmit}
            className="w-full bg-primary text-white py-4 rounded-full shadow-[0_8px_24px_rgba(255,111,97,0.35)] active:scale-95 cursor-pointer text-center"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {children.length > 0 ? 'Fertig' : 'Überspringen'}
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
