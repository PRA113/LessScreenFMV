import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, User, Mail, Check } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface ProfileEditProps {
  currentName: string;
  currentEmail?: string;
  onBack: () => void;
  onProfileUpdated: (name: string, email?: string) => void;
}

export function ProfileEdit({
  currentName,
  currentEmail,
  onBack,
  onProfileUpdated,
}: ProfileEditProps) {
  const [name, setName] = useState(currentName);
  const [email, setEmail] = useState(currentEmail || '');
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    if (!name.trim()) {
      toast.error('Bitte geben Sie einen Namen ein');
      return;
    }

    // Email validation (optional field)
    if (email.trim() && !email.includes('@')) {
      toast.error('Bitte geben Sie eine gültige E-Mail-Adresse ein');
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));

      toast.success('Profil aktualisiert! 🎉', {
        description: `Ihr Name: ${name}`,
      });

      onProfileUpdated(name.trim(), email.trim() || undefined);
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Profil konnte nicht aktualisiert werden', {
        description: 'Bitte versuchen Sie es erneut.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/10 pb-24">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-secondary p-6 pb-8 shadow-lg">
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={onBack}
            className="p-2 hover:bg-white/20 rounded-full transition-colors"
          >
            <ArrowLeft className="text-primary-foreground" size={24} />
          </button>
          <h1 className="text-primary-foreground">Eltern-Profil bearbeiten</h1>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 -mt-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-[28px] p-6 shadow-[0_10px_40px_rgba(139,92,246,0.15)]"
        >
          {/* Profile Preview */}
          <div className="flex flex-col items-center mb-8">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="w-24 h-24 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full flex items-center justify-center text-6xl mb-3 shadow-lg"
            >
              👨‍👩‍👧‍👦
            </motion.div>
            <h2 className="text-foreground">{name || 'Ihr Name'}</h2>
            {email && (
              <p className="text-sm text-muted-foreground">{email}</p>
            )}
          </div>

          {/* Name Input */}
          <div className="mb-6">
            <label className="flex items-center gap-2 text-foreground mb-3">
              <User size={20} className="text-primary" />
              Ihr Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ihr Name"
              className="w-full px-4 py-3 bg-input-background border border-border rounded-[16px] focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              maxLength={50}
            />
            <div className="text-xs text-muted-foreground mt-2 text-right">
              {name.length}/50 Zeichen
            </div>
          </div>

          {/* Email Input (Optional) */}
          <div className="mb-8">
            <label className="flex items-center gap-2 text-foreground mb-3">
              <Mail size={20} className="text-primary" />
              E-Mail-Adresse (optional)
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ihre.email@beispiel.de"
              className="w-full px-4 py-3 bg-input-background border border-border rounded-[16px] focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              maxLength={100}
            />
            <div className="text-xs text-muted-foreground mt-2">
              Für zukünftige Features (z.B. Berichte per E-Mail)
            </div>
          </div>

          {/* Save Button */}
          <button
            onClick={handleSave}
            disabled={isLoading || !name.trim()}
            className="w-full bg-gradient-to-r from-primary to-secondary hover:shadow-lg text-primary-foreground py-4 rounded-[20px] transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                  className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full"
                />
                Wird gespeichert...
              </>
            ) : (
              <>
                <Check size={20} />
                Änderungen speichern
              </>
            )}
          </button>

          {/* Info Box */}
          <div className="mt-6 p-4 bg-primary/10 rounded-[16px] text-center">
            <div className="text-4xl mb-2">👨‍👩‍👧‍👦</div>
            <p className="text-sm text-foreground">
              Dies ist Ihr Eltern-Profil. Die Profile Ihrer Kinder können Sie im Dashboard über den Profil-Wechsler verwalten.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
