import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Camera, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  Loader2, 
  AlertCircle,
  Sparkles,
  WifiOff,
  Image as ImageIcon,
  Check,
  XCircle,
  Edit3,
  Send
} from 'lucide-react';
import { extractTextFromImage, isTextValidForQuestions, getTextLengthFeedback } from '../utils/ocr-service';
import { ocrAPI, type Question } from '../utils/api-client';
import { 
  savePhotoForLater, 
  getQueueCountForUser, 
  removeFromQueue,
  cleanupOldItems,
  type QueuedPhoto 
} from '../utils/offline-queue';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { toast } from 'sonner@2.0.3';

interface ReadingCompassProps {
  isOpen: boolean;
  onClose: () => void;
  profileName: string;
  profileId: string;
  onBookCompleted?: () => void;
}

type Step = 'intro' | 'capture' | 'ocr-processing' | 'text-edit' | 'question-generation' | 'questions' | 'completed';

export function ReadingCompass({
  isOpen,
  onClose,
  profileName,
  profileId,
  onBookCompleted,
}: ReadingCompassProps) {
  // State Management
  const [step, setStep] = useState<Step>('intro');
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [extractedText, setExtractedText] = useState('');
  const [ocrProgress, setOcrProgress] = useState(0);
  const [ocrStatus, setOcrStatus] = useState('');
  const [isExtracting, setIsExtracting] = useState(false);
  const [generatedQuestions, setGeneratedQuestions] = useState<Question[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [userAnswers, setUserAnswers] = useState<string[]>(['', '', '']);
  const [validationStates, setValidationStates] = useState<('idle' | 'correct' | 'incorrect')[]>(['idle', 'idle', 'idle']);
  const [revealedAnswers, setRevealedAnswers] = useState<Set<number>>(new Set());
  const [bookCompleted, setBookCompleted] = useState(false);
  const [remainingScans, setRemainingScans] = useState({ hour: 5, day: 20 });
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [queueCount, setQueueCount] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isDemoMode, setIsDemoMode] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Online/Offline Detection
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      toast.success('Wieder online!');
      checkAndProcessQueue();
    };

    const handleOffline = () => {
      setIsOnline(false);
      toast.error('Keine Internetverbindung');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Load Rate Limits on Open
  useEffect(() => {
    if (isOpen && isOnline) {
      loadRateLimits();
      updateQueueCount();
      cleanupOldItems();
    }
  }, [isOpen, isOnline]);

  // Functions
  const loadRateLimits = async () => {
    try {
      const limits = await ocrAPI.getRateLimits(profileId);
      setRemainingScans({
        hour: limits.remainingHour,
        day: limits.remainingDay
      });
    } catch (error) {
      console.error('Fehler beim Laden der Rate Limits:', error);
    }
  };

  const updateQueueCount = () => {
    const count = getQueueCountForUser(profileId);
    setQueueCount(count);
  };

  const checkAndProcessQueue = async () => {
    // TODO: Queue-Processing implementieren wenn gewünscht
    updateQueueCount();
  };

  const handleCapturePhoto = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Convert to Data URL
    const reader = new FileReader();
    reader.onload = async (e) => {
      const dataUrl = e.target?.result as string;
      setCapturedPhoto(dataUrl);
      setStep('ocr-processing');
      
      // Start OCR
      await performOCR(dataUrl);
    };
    reader.readAsDataURL(file);
  };

  const performOCR = async (photoDataUrl: string) => {
    setIsExtracting(true);
    setError(null);

    try {
      const result = await extractTextFromImage(
        photoDataUrl,
        (progress) => {
          setOcrProgress(progress.progress);
          setOcrStatus(progress.status);
        }
      );

      setExtractedText(result.text);
      setOcrProgress(100);
      
      // Show success message
      toast.success(`${result.wordCount} Wörter erkannt! (${Math.round(result.confidence)}% Genauigkeit)`);

      // Move to text edit step
      setTimeout(() => {
        setIsExtracting(false);
        setStep('text-edit');
      }, 500);

    } catch (error: any) {
      console.error('OCR-Fehler:', error);
      setError(error.message || 'Texterkennung fehlgeschlagen');
      toast.error('OCR fehlgeschlagen. Bitte versuche es mit einem klareren Foto.');
      setIsExtracting(false);
      setStep('intro');
    }
  };

  const handleGenerateQuestions = async () => {
    if (!isTextValidForQuestions(extractedText)) {
      toast.error('Text ist zu kurz für Verständnisfragen');
      return;
    }

    // Check if offline
    if (!isOnline) {
      // Save for later
      const queueId = savePhotoForLater(capturedPhoto!, extractedText, profileId);
      toast.info('Offline gespeichert. Wird verarbeitet, sobald du online bist.');
      updateQueueCount();
      resetAndClose();
      return;
    }

    setStep('question-generation');
    setIsGenerating(true);
    setError(null);

    console.log('🚀 Starte Fragengenerierung...');
    console.log(`📝 Text-Länge: ${extractedText.length} Zeichen`);
    console.log(`👤 Profil-ID: ${profileId}`);

    try {
      const response = await ocrAPI.generateQuestions(extractedText, profileId, {
        difficulty: 'mittel',
        targetAge: 'Grundschule'
      });

      console.log('✅ Antwort erhalten:', response);

      setGeneratedQuestions(response.questions);
      setRemainingScans({
        hour: response.remainingHour,
        day: response.remainingDay
      });

      // Zeige Warnung wenn Fallback verwendet wurde
      const isDemoModeActive = (response as any).isFallback || (response as any).isDemoMode;
      setIsDemoMode(isDemoModeActive);
      
      if (isDemoModeActive) {
        const warningMsg = (response as any).warning || 'Demo-Modus aktiv';
        toast.info('📚 Demo-Modus', {
          description: warningMsg,
          duration: 6000
        });
        console.log('ℹ️ Demo-Modus aktiv:', (response as any).debugInfo);
      } else {
        toast.success('3 Fragen generiert!');
      }
      
      setIsGenerating(false);
      setStep('questions');

    } catch (error: any) {
      console.error('Fragengenerierung fehlgeschlagen:', error);
      
      const errorMessage = error.message || 'Unbekannter Fehler';
      
      // Check for rate limit errors
      if (errorMessage.includes('429') || errorMessage.includes('Limit')) {
        setError('Limit erreicht. Bitte versuche es später nochmal.');
        toast.error('Rate Limit erreicht!');
      } 
      // Check for model loading
      else if (errorMessage.includes('503') || errorMessage.includes('Loading')) {
        setError('KI-Modell wird geladen. Bitte warte 20 Sekunden und versuche es nochmal.');
        toast.info('Model wird vorbereitet...', { duration: 5000 });
      }
      else {
        setError(errorMessage);
        toast.error('Fehler bei Fragengenerierung');
      }
      
      setIsGenerating(false);
      setStep('text-edit'); // Back to text edit
    }
  };

  const toggleAnswer = (index: number) => {
    setRevealedAnswers((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  const checkAnswer = (index: number) => {
    const userAnswer = userAnswers[index].trim().toLowerCase();
    const correctAnswer = generatedQuestions[index].answer.toLowerCase();

    // Simple similarity check (can be improved)
    const isCorrect = userAnswer.length > 0 && correctAnswer.includes(userAnswer);

    const newStates = [...validationStates];
    newStates[index] = isCorrect ? 'correct' : 'incorrect';
    setValidationStates(newStates);

    if (isCorrect) {
      toast.success('Richtig! 🎉');
    } else {
      toast.error('Nicht ganz richtig. Schau dir die Antwort an.');
    }
  };

  const resetAndClose = () => {
    setStep('intro');
    setCapturedPhoto(null);
    setExtractedText('');
    setOcrProgress(0);
    setGeneratedQuestions([]);
    setUserAnswers(['', '', '']);
    setValidationStates(['idle', 'idle', 'idle']);
    setRevealedAnswers(new Set());
    setBookCompleted(false);
    setError(null);
    onClose();
  };

  const handleComplete = () => {
    if (bookCompleted && onBookCompleted) {
      onBookCompleted();
    }
    resetAndClose();
  };

  return (
    <>
      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        capture="environment"
        onChange={handleFileChange}
        className="hidden"
      />

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="fixed inset-0 bg-foreground/60 backdrop-blur-md z-50"
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="fixed inset-0 z-50 flex items-center justify-center p-6"
            >
              <div className="w-full max-w-md bg-background rounded-[28px] shadow-[0_20px_60px_rgba(139,92,246,0.3)] overflow-hidden max-h-[90vh] flex flex-col">
                {/* Header */}
                <div className="bg-gradient-to-br from-primary to-secondary p-6 relative flex-shrink-0">
                  <button
                    onClick={resetAndClose}
                    className="absolute top-4 right-4 w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm transition-transform active:scale-95"
                  >
                    <X className="w-5 h-5 text-white" strokeWidth={2} />
                  </button>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                      <span className="text-2xl">🧭</span>
                    </div>
                    <div>
                      <h2 className="text-white">Lese-Kompass</h2>
                      <p className="text-white/80 text-sm">für {profileName}</p>
                    </div>
                  </div>

                  {/* Rate Limit Indicator */}
                  {isOnline && (
                    <div className="flex items-center gap-2 text-xs text-white/70 mt-3">
                      <Sparkles className="w-4 h-4 text-white/90" />
                      <span>Noch {remainingScans.hour} Scans diese Stunde</span>
                      <span className="opacity-50">• {remainingScans.day}/20 heute</span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">
                  {/* Offline Banner */}
                  {!isOnline && (
                    <Alert variant="default" className="mb-4 bg-amber-50 border-amber-200">
                      <WifiOff className="w-4 h-4 text-amber-600" />
                      <AlertTitle className="text-amber-900">Offline-Modus</AlertTitle>
                      <AlertDescription className="text-amber-700">
                        Dein Foto wird gespeichert und analysiert, sobald du wieder online bist.
                        {queueCount > 0 && ` (${queueCount} in Warteschlange)`}
                      </AlertDescription>
                    </Alert>
                  )}

                  {/* Error Alert */}
                  {error && (
                    <Alert variant="destructive" className="mb-4">
                      <AlertCircle className="w-4 h-4" />
                      <AlertTitle>Fehler</AlertTitle>
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  {/* STEP: Intro */}
                  {step === 'intro' && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="space-y-6"
                    >
                      <div className="text-center">
                        <h3 className="text-foreground mb-2">Validierung</h3>
                        <p className="text-muted-foreground text-sm">
                          Fotografiere eine Buchseite, um automatisch Verständnisfragen zu erhalten
                        </p>
                      </div>

                      <motion.button
                        onClick={handleCapturePhoto}
                        className="w-full bg-gradient-to-br from-primary to-secondary text-white py-6 rounded-[20px] shadow-[0_8px_24px_rgba(139,92,246,0.35)] flex items-center justify-center gap-3 text-center"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Camera className="w-6 h-6" strokeWidth={2} />
                        <span>Buchseite fotografieren</span>
                      </motion.button>

                      <div className="bg-card rounded-[20px] p-6 border-2 border-dashed border-primary/20">
                        <p className="text-sm text-muted-foreground text-center">
                          <span className="block mb-3 text-4xl">📖</span>
                          <span className="block mb-2 text-foreground">Wie funktioniert's?</span>
                          Fotografiere eine Seite aus dem gelesenen Buch. Die KI erkennt automatisch den Text und generiert 3 Verständnisfragen.
                        </p>
                      </div>
                    </motion.div>
                  )}

                  {/* STEP: OCR Processing */}
                  {step === 'ocr-processing' && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="space-y-6"
                    >
                      <div className="text-center">
                        <motion.div
                          className="w-20 h-20 bg-gradient-to-br from-[#14B8A6] to-[#0891B2] rounded-full flex items-center justify-center mx-auto mb-4"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                        >
                          <Loader2 className="w-10 h-10 text-white" />
                        </motion.div>
                        <h3 className="text-foreground mb-2">Text wird erkannt...</h3>
                        <p className="text-muted-foreground text-sm mb-4">{ocrStatus}</p>
                        
                        {/* Progress Bar */}
                        <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
                          <motion.div 
                            className="bg-gradient-to-r from-[#14B8A6] to-[#0891B2] h-2.5 rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${ocrProgress}%` }}
                            transition={{ duration: 0.3 }}
                          />
                        </div>
                        <p className="text-xs text-muted-foreground">{ocrProgress}%</p>
                      </div>

                      {/* Preview Image */}
                      {capturedPhoto && (
                        <div className="rounded-[20px] overflow-hidden border-2 border-primary/20">
                          <img 
                            src={capturedPhoto} 
                            alt="Captured page" 
                            className="w-full h-auto"
                          />
                        </div>
                      )}
                    </motion.div>
                  )}

                  {/* STEP: Text Edit */}
                  {step === 'text-edit' && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-4"
                    >
                      <div className="text-center mb-4">
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: 'spring', stiffness: 200 }}
                          className="w-16 h-16 bg-gradient-to-br from-[#14B8A6] to-[#14B8A6]/80 rounded-full flex items-center justify-center mx-auto mb-3 shadow-[0_8px_24px_rgba(20,184,166,0.35)]"
                        >
                          <Check className="w-8 h-8 text-white" strokeWidth={3} />
                        </motion.div>
                        <h3 className="text-foreground mb-1">Text erkannt!</h3>
                        <p className="text-muted-foreground text-sm">
                          {getTextLengthFeedback(extractedText)}
                        </p>
                      </div>

                      <div className="bg-[#F5F3FF] rounded-[20px] p-4 shadow-[inset_2px_2px_6px_rgba(0,0,0,0.1)]">
                        <label className="text-sm text-foreground mb-2 flex items-center gap-2">
                          <Edit3 className="w-4 h-4" />
                          Erkannter Text (editierbar):
                        </label>
                        <Textarea
                          value={extractedText}
                          onChange={(e) => setExtractedText(e.target.value)}
                          rows={8}
                          className="bg-white/60 backdrop-blur-sm resize-none"
                          placeholder="Der erkannte Text erscheint hier..."
                        />
                        <p className="text-xs text-muted-foreground mt-2">
                          Du kannst OCR-Fehler hier korrigieren, bevor die Fragen generiert werden.
                        </p>
                      </div>

                      <Button
                        onClick={handleGenerateQuestions}
                        disabled={!isTextValidForQuestions(extractedText)}
                        className="w-full bg-gradient-to-br from-primary to-secondary text-white py-6 rounded-[20px] shadow-[0_8px_24px_rgba(139,92,246,0.35)] flex items-center justify-center gap-3"
                      >
                        <Send className="w-5 h-5" />
                        <span>Fragen generieren</span>
                      </Button>
                    </motion.div>
                  )}

                  {/* STEP: Question Generation */}
                  {step === 'question-generation' && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="space-y-6"
                    >
                      <div className="text-center">
                        <motion.div
                          className="w-20 h-20 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-4"
                          animate={{ 
                            scale: [1, 1.1, 1],
                            rotate: [0, 5, -5, 0]
                          }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          <Sparkles className="w-10 h-10 text-white" />
                        </motion.div>
                        <h3 className="text-foreground mb-2">KI generiert Fragen...</h3>
                        <p className="text-muted-foreground text-sm">
                          Dies kann 5-15 Sekunden dauern
                        </p>
                      </div>
                    </motion.div>
                  )}

                  {/* STEP: Questions */}
                  {step === 'questions' && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-4"
                    >
                      <div className="text-center mb-6">
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
                          className="w-16 h-16 bg-gradient-to-br from-[#14B8A6] to-[#14B8A6]/80 rounded-full flex items-center justify-center mx-auto mb-3 shadow-[0_8px_24px_rgba(20,184,166,0.35)]"
                        >
                          <span className="text-3xl">✓</span>
                        </motion.div>
                        <h3 className="text-foreground mb-1">Fragen generiert!</h3>
                        <p className="text-muted-foreground text-sm">
                          Stelle deinem Kind die folgenden Fragen zum gelesenen Text
                        </p>
                        
                        {/* Demo-Mode Banner */}
                        {isDemoMode && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-3 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-[16px] shadow-sm"
                          >
                            <div className="flex items-start gap-3">
                              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                                <Sparkles className="w-4 h-4 text-white" />
                              </div>
                              <div className="flex-1">
                                <p className="text-blue-900 text-sm">
                                  <span className="font-semibold">📚 Demo-Modus aktiv</span>
                                </p>
                                <p className="text-blue-700 text-xs mt-1 leading-relaxed">
                                  Diese Fragen werden lokal generiert. Für KI-basierte Fragen erstelle einen gültigen OpenRouter API-Key auf{' '}
                                  <a 
                                    href="https://openrouter.ai" 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="underline hover:text-blue-900"
                                  >
                                    openrouter.ai
                                  </a>
                                  {' '}und verifiziere deine Email.
                                </p>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </div>

                      {generatedQuestions.map((q, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="bg-card rounded-[20px] p-5 shadow-[0_4px_20px_rgba(139,92,246,0.08)]"
                        >
                          <div className="flex items-start gap-3 mb-3">
                            <div className="w-8 h-8 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                              <span className="text-sm text-primary">{index + 1}</span>
                            </div>
                            <p className="text-foreground flex-1">{q.question}</p>
                          </div>

                          <AnimatePresence mode="wait">
                            {revealedAnswers.has(index) ? (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="bg-gradient-to-br from-[#14B8A6]/10 to-[#14B8A6]/5 rounded-[16px] p-4 mb-3 border border-[#14B8A6]/20"
                              >
                                <div className="flex items-start gap-2 mb-1">
                                  <span className="text-[#14B8A6] text-xs">✓ Antwort:</span>
                                </div>
                                <p className="text-sm text-foreground">{q.answer}</p>
                              </motion.div>
                            ) : null}
                          </AnimatePresence>

                          <button
                            onClick={() => toggleAnswer(index)}
                            className="w-full py-3 px-4 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-[14px] flex items-center justify-center gap-2 text-primary transition-all hover:from-primary/20 hover:to-secondary/20 text-center"
                          >
                            {revealedAnswers.has(index) ? (
                              <>
                                <EyeOff className="w-4 h-4" />
                                <span className="text-sm">Antwort verbergen</span>
                              </>
                            ) : (
                              <>
                                <Eye className="w-4 h-4" />
                                <span className="text-sm">Antwort anzeigen</span>
                              </>
                            )}
                          </button>
                        </motion.div>
                      ))}

                      {/* Buch fertig Checkbox */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: generatedQuestions.length * 0.1 + 0.1 }}
                        className="bg-gradient-to-br from-[#14B8A6]/10 to-[#0891B2]/10 rounded-[20px] p-5 shadow-[0_4px_20px_rgba(20,184,166,0.15)] border-2 border-[#14B8A6]/20"
                      >
                        <button
                          onClick={() => setBookCompleted(!bookCompleted)}
                          className="w-full flex items-center gap-4"
                        >
                          <div
                            className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${
                              bookCompleted
                                ? 'bg-[#14B8A6] border-[#14B8A6]'
                                : 'border-[#14B8A6]/50 bg-white'
                            }`}
                          >
                            {bookCompleted && (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                              >
                                <CheckCircle2 className="w-4 h-4 text-white" strokeWidth={3} />
                              </motion.div>
                            )}
                          </div>
                          <div className="flex-1 text-left">
                            <p className="text-foreground">Buch fertig gelesen</p>
                            <p className="text-muted-foreground text-xs mt-1">
                              {bookCompleted
                                ? 'Du erhältst gleich Buchempfehlungen! 🎉'
                                : 'Aktiviere dies, wenn das Buch beendet wurde'}
                            </p>
                          </div>
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                              bookCompleted
                                ? 'bg-[#14B8A6]/20'
                                : 'bg-muted-foreground/10'
                            }`}
                          >
                            <span className="text-xl">
                              {bookCompleted ? '🏆' : '📖'}
                            </span>
                          </div>
                        </button>
                      </motion.div>

                      <motion.button
                        onClick={handleComplete}
                        className="w-full bg-gradient-to-br from-primary to-secondary text-white py-4 rounded-full shadow-[0_8px_24px_rgba(139,92,246,0.35)] mt-6 text-center"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        Fertig
                      </motion.button>
                    </motion.div>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
