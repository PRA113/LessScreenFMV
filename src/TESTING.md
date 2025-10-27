# LessScreen Testing-Anleitung 🧪

## ⚠️ WICHTIG: Fallback-Modus für Testing

**Die App funktioniert JETZT auch OHNE Hugging Face API-Key!**

Wenn der API-Key nicht verfügbar ist, verwendet die App automatisch **Fallback-Fragen** zum Testen der UI. Du siehst dann eine Warnung "KI nicht verfügbar - Beispiel-Fragen werden angezeigt".

**Das bedeutet:**
- ✅ Du kannst die **komplette App-Funktionalität testen**
- ✅ OCR funktioniert vollständig (läuft im Browser)
- ✅ UI, Navigation und Flows funktionieren
- ⚠️ Fragen sind generisch (nicht text-spezifisch)
- 🎯 Für echte KI-Fragen: Hugging Face API-Key einrichten (siehe unten)

---

## Hugging Face API Setup (Optional für echte KI)

### 1. API-Key prüfen

**Zum Überprüfen:**
1. Öffne die App
2. Rechts unten siehst du ein "Hugging Face Test" Widget
3. Klicke auf "API Testen"
4. Du siehst sofort, ob der API-Key funktioniert

**Mögliche Ergebnisse:**
- ✅ **Erfolg**: API-Key funktioniert, echte KI-Fragen werden generiert
- ❌ **API-Key fehlt**: App verwendet Fallback-Fragen (funktioniert trotzdem!)
- ❌ **401/403 Fehler**: API-Key ist ungültig oder abgelaufen
- ⏳ **503 Fehler**: Model lädt noch (Cold Start), nach 20 Sekunden nochmal versuchen

### 2. Hugging Face API-Key einrichten (für echte KI-Fragen)

**So bekommst du einen KOSTENLOSEN API-Key:**

1. 🌐 Gehe zu https://huggingface.co/join
2. 📝 Registriere dich (kostenlos, dauert 2 Minuten)
3. ⚙️ Gehe zu https://huggingface.co/settings/tokens
4. ➕ Klicke auf "New Token"
   - **Name**: "LessScreen" 
   - **Type**: "Read" (wichtig!)
5. 📋 Kopiere den Token (beginnt mit `hf_...`)

**Token in der App einfügen:**

**Option A: Figma Make Secret Modal (einfachste)**
- Das Modal wird automatisch angezeigt, wenn du versuchst Fragen zu generieren
- Einfach den Token einfügen → Fertig!

**Option B: Manuell in Supabase**
1. Öffne dein Supabase Projekt Dashboard
2. Gehe zu "Project Settings" → "Edge Functions" 
3. Scroll zu "Secrets" / "Environment Variables"
4. Klicke "Add new secret"
5. **Name**: `HUGGINGFACE_API_KEY`
6. **Value**: Dein kopierter Token (beginnt mit `hf_...`)
7. Speichern
8. ⚠️ **Wichtig**: Edge Function neu deployen oder warten (kann 1-2 Minuten dauern)

---

## Feature Testing

### Test 1: Browser-Benachrichtigungen ✅

**Schritte:**
1. ✅ App öffnen und Onboarding durchlaufen
2. ✅ Bei "Benachrichtigungen aktivieren" → Erlauben klicken
3. ✅ Zum Dashboard
4. ✅ Plus-Button → Timer starten (1 Minute zum Testen)
5. ✅ Warten bis Timer abläuft
6. ✅ **Erwartung**: Browser-Notification + Sound erscheinen

**Troubleshooting:**
- Keine Notification? → Prüfe Browser-Einstellungen (Benachrichtigungen müssen erlaubt sein)
- Kein Sound? → Prüfe Browser-Lautstärke und Auto-Play-Einstellungen

---

### Test 2: Lese-Kompass mit OCR + AI ✅

**Schritte:**
1. ✅ Timer beenden oder Session manuell hinzufügen
2. ✅ Lese-Kompass öffnet sich automatisch
3. ✅ "Buchseite fotografieren" klicken
4. ✅ Foto von **deutscher** Buchseite machen (mindestens 20-30 Wörter sichtbar)
5. ✅ Warten auf OCR (zeigt Fortschritt)
6. ✅ Text wird angezeigt → prüfen und ggf. korrigieren
7. ✅ "Fragen generieren" klicken
8. ✅ **Erwartung**: Nach 5-15 Sekunden erscheinen 3 Verständnisfragen

**OCR-Tipps für beste Ergebnisse:**
- 📸 Klares, gut beleuchtetes Foto
- 📖 Deutsche Texte funktionieren am besten
- 🔤 Mindestens 20-30 Wörter sichtbar
- 📏 Text sollte gerade und nicht verzerrt sein

**Troubleshooting:**

| Problem | Lösung |
|---------|--------|
| OCR erkennt keinen Text | Klareres Foto machen, bessere Beleuchtung |
| "Text zu kurz" Fehler | Mehr Text fotografieren (mindestens 5 Wörter) |
| 503 Error (Model lädt) | 20-30 Sekunden warten, dann nochmal versuchen |
| 404 Error | Backend nutzt Fallback-Models automatisch |
| 500 Error | Hugging Face Test-Tool nutzen (siehe oben) |

---

## Rate Limits

**Kostenlose Hugging Face API Limits:**
- ⏱️ 5 Scans pro Stunde (pro Profil)
- 📅 20 Scans pro Tag (pro Profil)

**Status sehen:**
- Im Lese-Kompass Header wird angezeigt: "Noch X Scans diese Stunde"

---

## Debug-Tools

### 1. Hugging Face Test Widget
- **Position**: Rechts unten in der App
- **Funktion**: Direkter API-Test ohne OCR
- **Nutzen**: Schnell prüfen, ob API-Key funktioniert

### 2. Browser Console
- **Öffnen**: F12 oder Rechtsklick → "Untersuchen" → Console
- **Nutzen**: Detaillierte Logs für OCR und API-Calls
- **Wichtige Logs**:
  - `🚀 Starte Fragengenerierung...`
  - `📡 Versuche Model: ...`
  - `✅ Erfolgreiche Antwort von ...`
  - `❌ Hugging Face API Fehler: ...`

### 3. Network Tab
- **Öffnen**: F12 → Network Tab
- **Filter**: "make-server-e4c1b088"
- **Nutzen**: API-Requests sehen und debuggen

---

## Bekannte Limitierungen (Prototyp)

1. **Cold Start**: Erstes Laden eines Models kann 20-30 Sekunden dauern
2. **Offline-Queue**: Fotos werden gespeichert, aber automatische Verarbeitung ist noch nicht implementiert
3. **Model-Wechsel**: Bei Problemen versucht Backend automatisch alternative Models
4. **OCR-Genauigkeit**: Abhängig von Foto-Qualität (Tesseract.js)

---

## Support

**Bei Problemen:**
1. Hugging Face Test-Tool nutzen
2. Browser Console prüfen
3. Test mit kürzerem, einfacherem Text versuchen
4. Nach 1 Minute nochmal versuchen (Cold Start)

**Häufige Fehler und Fixes:**

```
❌ "Not Found" → Model nicht verfügbar
   ✅ Fix: Backend versucht automatisch Fallback-Models

❌ "503 Service Unavailable" → Model lädt
   ✅ Fix: 20 Sekunden warten, nochmal versuchen

❌ "401 Unauthorized" → API-Key ungültig
   ✅ Fix: Neuen API-Key von HuggingFace holen

❌ "Rate Limit" → Limit erreicht
   ✅ Fix: Warte 1 Stunde oder bis zum nächsten Tag
```

---

## Produktions-Readiness Checklist

- ✅ OCR funktioniert offline (Tesseract.js im Browser)
- ✅ Multiple Fallback-Models für Stabilität
- ✅ Rate Limiting implementiert
- ✅ Offline-Queue für schlechte Verbindung
- ✅ Detailliertes Error-Handling
- ✅ Test-Tools für Debugging
- ⏳ Automatische Queue-Verarbeitung (TODO)
- ⏳ Model-Caching für schnellere Antworten (TODO)

---

**Viel Erfolg beim Testen! 🚀**
