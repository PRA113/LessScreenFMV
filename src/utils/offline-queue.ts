/**
 * Offline-Queue für gespeicherte OCR-Fotos
 * Speichert Fotos lokal wenn keine Internetverbindung besteht
 */

const QUEUE_KEY = 'lessscreen_ocr_queue';

export interface QueuedPhoto {
  id: string;
  photoDataUrl: string;
  extractedText: string;
  timestamp: number;
  userId: string;
}

/**
 * Speichert ein Foto für spätere Verarbeitung
 * @param photoDataUrl - Das Foto als Data-URL
 * @param extractedText - Der bereits extrahierte Text
 * @param userId - Die User-ID
 * @returns Die ID des gespeicherten Items
 */
export function savePhotoForLater(
  photoDataUrl: string,
  extractedText: string,
  userId: string
): string {
  const queue = getQueue();
  
  const newItem: QueuedPhoto = {
    id: crypto.randomUUID(),
    photoDataUrl,
    extractedText,
    timestamp: Date.now(),
    userId
  };
  
  queue.push(newItem);
  
  try {
    localStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
    console.log('📦 Foto für spätere Verarbeitung gespeichert:', newItem.id);
  } catch (error) {
    console.error('Fehler beim Speichern in LocalStorage:', error);
    throw new Error('Speichern fehlgeschlagen - möglicherweise ist der Speicher voll');
  }
  
  return newItem.id;
}

/**
 * Gibt alle gespeicherten Fotos zurück
 * @returns Array von gespeicherten Fotos
 */
export function getQueue(): QueuedPhoto[] {
  try {
    const data = localStorage.getItem(QUEUE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Fehler beim Lesen der Queue:', error);
    return [];
  }
}

/**
 * Gibt die Anzahl der gespeicherten Fotos für einen User zurück
 * @param userId - Die User-ID
 * @returns Anzahl der gespeicherten Fotos
 */
export function getQueueCountForUser(userId: string): number {
  const queue = getQueue();
  return queue.filter(item => item.userId === userId).length;
}

/**
 * Entfernt ein Foto aus der Queue
 * @param id - Die ID des zu entfernenden Items
 */
export function removeFromQueue(id: string): void {
  try {
    const queue = getQueue().filter(item => item.id !== id);
    localStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
    console.log('🗑️ Foto aus Queue entfernt:', id);
  } catch (error) {
    console.error('Fehler beim Entfernen aus Queue:', error);
  }
}

/**
 * Löscht alle Fotos eines Users aus der Queue
 * @param userId - Die User-ID
 */
export function clearQueueForUser(userId: string): void {
  try {
    const queue = getQueue().filter(item => item.userId !== userId);
    localStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
    console.log('🧹 Queue für User geleert:', userId);
  } catch (error) {
    console.error('Fehler beim Leeren der Queue:', error);
  }
}

/**
 * Löscht die komplette Queue
 */
export function clearQueue(): void {
  try {
    localStorage.removeItem(QUEUE_KEY);
    console.log('🧹 Komplette Queue geleert');
  } catch (error) {
    console.error('Fehler beim Leeren der Queue:', error);
  }
}

/**
 * Gibt alle Fotos eines bestimmten Users zurück
 * @param userId - Die User-ID
 * @returns Array von Fotos des Users
 */
export function getQueueForUser(userId: string): QueuedPhoto[] {
  const queue = getQueue();
  return queue.filter(item => item.userId === userId);
}

/**
 * Prüft ob die Queue zu groß wird und löscht alte Items
 * (Mehr als 5 Items oder älter als 7 Tage)
 */
export function cleanupOldItems(): void {
  try {
    const queue = getQueue();
    const now = Date.now();
    const sevenDaysInMs = 7 * 24 * 60 * 60 * 1000;
    
    // Entferne Items älter als 7 Tage
    let cleanedQueue = queue.filter(item => 
      now - item.timestamp < sevenDaysInMs
    );
    
    // Wenn noch immer mehr als 10 Items, behalte nur die neuesten 10
    if (cleanedQueue.length > 10) {
      cleanedQueue = cleanedQueue
        .sort((a, b) => b.timestamp - a.timestamp)
        .slice(0, 10);
    }
    
    localStorage.setItem(QUEUE_KEY, JSON.stringify(cleanedQueue));
    
    if (cleanedQueue.length < queue.length) {
      console.log(`🧹 ${queue.length - cleanedQueue.length} alte Items aus Queue entfernt`);
    }
  } catch (error) {
    console.error('Fehler beim Cleanup:', error);
  }
}
