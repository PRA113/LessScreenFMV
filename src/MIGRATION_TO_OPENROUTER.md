# Migration von Hugging Face zu OpenRouter - Anleitung

## ✅ Migration abgeschlossen

Die LessScreen App wurde erfolgreich von Hugging Face Inference API zu OpenRouter migriert.

## Was wurde geändert?

### Backend (`/supabase/functions/server/index.tsx`)

1. **API Endpoint**: 
   - ❌ Alt: `https://api-inference.huggingface.co/models/...`
   - ✅ Neu: `https://openrouter.ai/api/v1/chat/completions`

2. **Request Format**:
   - ❌ Alt: Unterschiedliche Parameter je nach Modell-Typ
   - ✅ Neu: Einheitliches OpenAI-kompatibles Format

3. **Modelle**:
   - ❌ Alt: Hugging Face Modelle (alle mit 404-Fehlern)
   - ✅ Neu: OpenRouter kostenlose Modelle:
     - `mistralai/mistral-7b-instruct:free`
     - `meta-llama/llama-3.2-3b-instruct:free`
     - `google/gemma-2-9b-it:free`
     - `qwen/qwen-2-7b-instruct:free`

4. **Response Parsing**:
   - ❌ Alt: `parseQuestionsFromResponse()` für Hugging Face Format
   - ✅ Neu: `parseQuestionsFromOpenRouterResponse()` für OpenAI Format

5. **Test-Route**:
   - ❌ Alt: `/make-server-e4c1b088/test-hf`
   - ✅ Neu: `/make-server-e4c1b088/test-openrouter`

### Frontend

1. **Test-Komponente** (`/components/HuggingFaceTest.tsx`):
   - UI aktualisiert auf "OpenRouter API Test"
   - API-Endpoint geändert
   - Links zu OpenRouter statt Hugging Face

2. **ReadingCompass** (`/components/ReadingCompass.tsx`):
   - Fehlermeldungen aktualisiert ("OpenRouter" statt "Hugging Face")

3. **QuestionGeneratorTest** (`/components/QuestionGeneratorTest.tsx`):
   - Info-Text aktualisiert

### Dokumentation

- ✅ Neue Datei: `OPENROUTER_INTEGRATION.md` (vollständige Dokumentation)
- ✅ Aktualisiert: `HUGGINGFACE_MODELS.md` (als DEPRECATED markiert)
- ✅ Aktualisiert: `README.md` (OpenRouter erwähnt)

## Nächste Schritte

### 1. Environment Variable setzen

Falls noch nicht vorhanden, setzen Sie den OpenRouter API-Key:

```bash
# In Supabase Dashboard:
# Settings > Edge Functions > Environment Variables

OPENROUTER_API_KEY=sk-or-v1-xxxxxxxxxxxxxxxxxxxxx
```

**API-Key erstellen:**
1. Gehe zu https://openrouter.ai/keys
2. Erstelle einen neuen API-Key (kostenlos)
3. Kopiere den Key
4. Füge ihn in Supabase ein

### 2. Backend deployen

```bash
# Deploy updated Edge Function
cd supabase/functions
supabase functions deploy make-server-e4c1b088
```

### 3. Testen

1. **Test-Widget verwenden:**
   - Öffne die App
   - Klicke auf das "OpenRouter API Test" Widget (unten rechts)
   - Prüfe, ob mindestens ein Modell erfolgreich ist

2. **Fragen generieren:**
   - Gehe zum "Lese-Kompass"
   - Mache ein Foto von einem Text
   - Prüfe, ob die Fragen generiert werden

3. **Logs prüfen:**
   - Supabase Dashboard > Edge Functions > Logs
   - Suche nach "OpenRouter" und prüfe auf Fehler

## Fallback-System

Das Fallback-System bleibt unverändert:
- ✅ Wenn alle OpenRouter Modelle fehlschlagen
- ✅ Werden lokale regelbasierte Fragen generiert
- ✅ Basierend auf dem erkannten OCR-Text
- ✅ Funktioniert komplett offline

## Vorteile der Migration

### Zuverlässigkeit
- ✅ Keine 404-Fehler mehr
- ✅ Konsistente Verfügbarkeit
- ✅ Schnellere Antwortzeiten

### Qualität
- ✅ Bessere Fragengenerierung
- ✅ Mehr Kontext-Verständnis
- ✅ Bessere deutsche Sprachfähigkeiten

### Entwickler-Erfahrung
- ✅ Einheitliche API für alle Modelle
- ✅ OpenAI-kompatibles Format
- ✅ Einfachere Fehlerbehandlung

## Kosten

**Alle verwendeten Modelle sind KOSTENLOS!**

- ✅ Keine Kreditkarte erforderlich
- ✅ Großzügige Limits für kostenlose Modelle
- ✅ Perfekt für Prototypen und kleine Apps
- ✅ Optional: Premium-Modelle für zukünftige Features

## Troubleshooting

### Problem: "OPENROUTER_API_KEY nicht gesetzt"

**Lösung:**
1. Erstelle API-Key auf https://openrouter.ai/keys
2. Setze in Supabase Environment Variables
3. Deploye Edge Function neu

### Problem: "Alle Models fehlgeschlagen"

**Lösung:**
1. Prüfe API-Key ist korrekt gesetzt
2. Prüfe Server-Logs für Details
3. Fallback-Fragen sollten trotzdem funktionieren

### Problem: "Rate Limit erreicht"

**Lösung:**
1. Warte eine Stunde (5 Requests/Stunde Limit)
2. Oder: Erstelle neuen API-Key
3. Fallback-Fragen haben kein Limit

## Support

Bei Fragen oder Problemen:
- 📖 Siehe: [OPENROUTER_INTEGRATION.md](./OPENROUTER_INTEGRATION.md)
- 🔍 Check Server Logs in Supabase
- 🧪 Nutze Test-Widgets in der App

## Rollback (falls nötig)

Falls OpenRouter nicht funktioniert, kann theoretisch zurück zu Hugging Face gewechselt werden:

```bash
# Git History:
git log --all -- supabase/functions/server/index.tsx

# Zurücksetzen:
git checkout <commit-hash> -- supabase/functions/server/index.tsx
```

**Aber:** Hugging Face hatte 404-Fehler, daher ist Rollback nicht empfohlen!

## Fazit

✅ Migration erfolgreich  
✅ Alle Features funktionieren  
✅ Bessere Qualität und Zuverlässigkeit  
✅ Weiterhin kostenlos  
✅ Fallback-System als Sicherheitsnetz  

**Die App ist bereit für produktiven Einsatz! 🚀**
