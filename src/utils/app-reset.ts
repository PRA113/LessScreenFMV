/**
 * App Reset Utility
 * Provides functions to reset the app to initial state for testing
 */

/**
 * List of all localStorage keys used by LessScreen
 */
const APP_STORAGE_KEYS = [
  'lessscreen_notification_prefs',
  'lessscreen_offline_queue',
  'lessscreen_onboarding_complete',
  'lessscreen_user_profiles',
  'lessscreen_current_profile',
  'lessscreen_activities',
  'lessscreen_goals',
  'lessscreen_reading_sessions',
  'lessscreen_parent_profile',
];

/**
 * Reset all app data to initial state
 * This will:
 * - Clear all localStorage data
 * - Reset notification permissions (user needs to re-enable in browser)
 * - Clear all user profiles and settings
 */
export function resetAppData(): void {
  try {
    console.log('🔄 Starte App-Reset...');
    
    // Clear all app-specific localStorage keys
    APP_STORAGE_KEYS.forEach(key => {
      try {
        localStorage.removeItem(key);
        console.log(`✅ Gelöscht: ${key}`);
      } catch (error) {
        console.warn(`⚠️ Konnte ${key} nicht löschen:`, error);
      }
    });
    
    // Clear any other potential LessScreen keys
    Object.keys(localStorage).forEach(key => {
      if (key.toLowerCase().includes('lessscreen')) {
        try {
          localStorage.removeItem(key);
          console.log(`✅ Gelöscht: ${key}`);
        } catch (error) {
          console.warn(`⚠️ Konnte ${key} nicht löschen:`, error);
        }
      }
    });
    
    console.log('✅ App-Reset erfolgreich!');
    
  } catch (error) {
    console.error('❌ Fehler beim App-Reset:', error);
    throw error;
  }
}

/**
 * Reset app and reload page
 */
export function resetAndReload(): void {
  resetAppData();
  
  // Wait a bit to ensure localStorage is cleared
  setTimeout(() => {
    window.location.reload();
  }, 500);
}

/**
 * Get storage usage info (for debugging)
 */
export function getStorageInfo(): {
  keys: string[];
  estimatedSize: number;
} {
  const keys: string[] = [];
  let estimatedSize = 0;
  
  try {
    Object.keys(localStorage).forEach(key => {
      if (key.toLowerCase().includes('lessscreen')) {
        keys.push(key);
        const value = localStorage.getItem(key);
        if (value) {
          estimatedSize += value.length;
        }
      }
    });
  } catch (error) {
    console.error('Fehler beim Abrufen der Storage-Info:', error);
  }
  
  return {
    keys,
    estimatedSize,
  };
}

/**
 * Export app data for backup (before reset)
 */
export function exportAppData(): string {
  const data: Record<string, any> = {};
  
  try {
    APP_STORAGE_KEYS.forEach(key => {
      const value = localStorage.getItem(key);
      if (value) {
        try {
          data[key] = JSON.parse(value);
        } catch {
          data[key] = value;
        }
      }
    });
    
    return JSON.stringify(data, null, 2);
  } catch (error) {
    console.error('Fehler beim Exportieren der Daten:', error);
    throw error;
  }
}

/**
 * Import app data from backup
 */
export function importAppData(jsonData: string): void {
  try {
    const data = JSON.parse(jsonData);
    
    Object.entries(data).forEach(([key, value]) => {
      try {
        const stringValue = typeof value === 'string' ? value : JSON.stringify(value);
        localStorage.setItem(key, stringValue);
        console.log(`✅ Importiert: ${key}`);
      } catch (error) {
        console.warn(`⚠️ Konnte ${key} nicht importieren:`, error);
      }
    });
    
    console.log('✅ Daten erfolgreich importiert!');
  } catch (error) {
    console.error('❌ Fehler beim Importieren der Daten:', error);
    throw error;
  }
}
