import Tesseract from 'tesseract.js';

/**
 * OCR-Service für Texterkennung aus Bildern
 * Verwendet Tesseract.js für deutsche Texte
 */

export interface OCRResult {
  text: string;
  confidence: number;
  wordCount: number;
}

export interface OCRProgress {
  status: string;
  progress: number;
}

/**
 * Extrahiert Text aus einem Bild
 * @param imageDataUrl - Das Bild als Data-URL (base64)
 * @param onProgress - Callback für Fortschritts-Updates
 * @returns OCR-Ergebnis mit Text und Konfidenz
 */
export async function extractTextFromImage(
  imageDataUrl: string,
  onProgress?: (progress: OCRProgress) => void
): Promise<OCRResult> {
  try {
    // Tesseract mit deutscher Sprache konfigurieren
    const result = await Tesseract.recognize(
      imageDataUrl,
      'deu', // Deutsche Sprache
      {
        logger: (m) => {
          // Progress-Updates an UI weiterleiten
          if (m.status === 'recognizing text') {
            onProgress?.({
              status: 'Text wird erkannt...',
              progress: Math.round(m.progress * 100)
            });
          } else if (m.status === 'loading tesseract core') {
            onProgress?.({
              status: 'OCR-Engine wird geladen...',
              progress: Math.round(m.progress * 50)
            });
          } else if (m.status === 'loading language traineddata') {
            onProgress?.({
              status: 'Sprachdaten werden geladen...',
              progress: Math.round(m.progress * 30)
            });
          }
        }
      }
    );

    // Text bereinigen
    const cleanedText = cleanExtractedText(result.data.text);

    // Wortanzahl berechnen
    const wordCount = cleanedText.split(/\s+/).filter(word => word.length > 0).length;

    return {
      text: cleanedText,
      confidence: result.data.confidence,
      wordCount
    };
  } catch (error) {
    console.error('OCR-Fehler:', error);
    throw new Error('Texterkennung fehlgeschlagen. Bitte versuche es mit einem klareren Foto.');
  }
}

/**
 * Bereinigt den extrahierten Text
 * @param rawText - Roher Text von Tesseract
 * @returns Bereinigter Text
 */
function cleanExtractedText(rawText: string): string {
  if (!rawText) return '';

  return rawText
    // Mehrfache Leerzeichen durch einzelne ersetzen
    .replace(/\s+/g, ' ')
    // Mehrfache Zeilenumbrüche durch doppelte ersetzen
    .replace(/\n\s*\n\s*\n/g, '\n\n')
    // Führende und nachfolgende Leerzeichen entfernen
    .trim()
    // Sehr kurze "Wörter" (wahrscheinlich OCR-Artefakte) entfernen
    .split(' ')
    .filter(word => word.length > 1 || /[a-zA-ZäöüÄÖÜß]/.test(word))
    .join(' ');
}

/**
 * Validiert ob ein Text lang genug für Fragengenerierung ist
 * @param text - Der zu validierende Text
 * @returns true wenn Text gültig ist
 */
export function isTextValidForQuestions(text: string): boolean {
  if (!text || text.trim().length < 10) {
    return false;
  }

  const wordCount = text.split(/\s+/).length;
  return wordCount >= 5; // Mindestens 5 Wörter
}

/**
 * Gibt Feedback zur Textlänge
 * @param text - Der zu bewertende Text
 * @returns Feedback-String für den User
 */
export function getTextLengthFeedback(text: string): string {
  const wordCount = text.split(/\s+/).filter(w => w.length > 0).length;

  if (wordCount < 5) {
    return 'Text ist zu kurz. Versuche ein Foto mit mehr Text zu machen.';
  }

  if (wordCount > 400) {
    return 'Text ist sehr lang. Dies kann zu längerer Verarbeitung führen.';
  }

  return `${wordCount} Wörter erkannt – perfekt für Verständnisfragen!`;
}
