# ⚠️ DEPRECATED - Hugging Face Models 

> **Hinweis:** Diese Dokumentation ist veraltet. Die App verwendet jetzt **OpenRouter** statt Hugging Face.  
> **Siehe:** [OPENROUTER_INTEGRATION.md](./OPENROUTER_INTEGRATION.md) für aktuelle Informationen.

## ❌ Warum nicht mehr Hugging Face?

Die Hugging Face Inference API hat sich als unzuverlässig erwiesen:
- Alle getesteten Modelle gaben 404-Fehler zurück
- Modelle sind häufig nicht verfügbar oder laden zu langsam
- Komplexe unterschiedliche Parameter je nach Modell

**Migration zu OpenRouter abgeschlossen am 23. Oktober 2025**

---

## Alte Dokumentation (nur zur Referenz)

~~Die LessScreen App nutzt die Hugging Face Inference API zur Generierung von Verständnisfragen basierend auf fotografierten Texten. Da die kostenlose API limitiert ist und Modelle sich ändern können, verwendet die App ein **Fallback-System** mit mehreren Modellen.~~

## Verwendete Modelle (aktualisiert)

Die folgenden Modelle werden nacheinander getestet, bis eines erfolgreich antwortet:

### 1. **mistralai/Mistral-7B-Instruct-v0.2**
- **Typ**: Instruction-tuned LLM
- **Größe**: 7B Parameter
- **Vorteile**: Sehr gute Qualität, deutsch-fähig, stabil
- **Status**: ✅ Empfohlen (Primary)

### 2. **google/flan-t5-base**
- **Typ**: Seq2Seq Modell
- **Größe**: 250M Parameter (klein & schnell)
- **Vorteile**: Schnell, zuverlässig verfügbar, mehrsprachig
- **Besonderheit**: Verwendet `max_length` statt `max_new_tokens`
- **Status**: ✅ Empfohlen (Fallback)

### 3. **tiiuae/falcon-7b-instruct**
- **Typ**: Instruction-tuned LLM
- **Größe**: 7B Parameter
- **Vorteile**: Open-source, gute Performance
- **Status**: ⚠️ Backup (kann langsam laden)

### 4. **microsoft/DialoGPT-medium**
- **Typ**: Conversational Model
- **Größe**: 355M Parameter
- **Vorteile**: Konversationsfähig, kompakt
- **Besonderheit**: Primär für Englisch, aber funktioniert mit einfachen Prompts
- **Status**: ⚠️ Emergency Fallback

## Removed Models (404 Errors)

Diese Modelle waren zuvor konfiguriert, sind aber nicht mehr über die Inference API verfügbar:

- ❌ `mistralai/Mistral-7B-Instruct-v0.3` → Ersetzt durch v0.2
- ❌ `HuggingFaceH4/zephyr-7b-beta` → Nicht mehr public
- ❌ `google/flan-t5-xxl` → Zu groß, nicht auf Inference API
- ❌ `google/flan-t5-large` → Ebenfalls nicht verfügbar

## Fallback-System

Falls **ALLE** Hugging Face Modelle fehlschlagen, generiert die App automatisch **lokale, regelbasierte Fragen**:

### Lokale Fallback-Fragen
Die `generateFallbackQuestions()` Funktion analysiert den erkannten Text und erstellt:

1. **Hauptthema-Frage**: Basierend auf dem ersten Satz + Schlüsselwörtern
2. **Detail-Frage**: Basierend auf der Textmitte + Statistiken (Wort-/Satzanzahl)
3. **Schlussfolgerung-Frage**: Basierend auf dem letzten Satz oder Zählfrage

**Vorteile**:
- ✅ Funktioniert komplett offline (nach OCR)
- ✅ Keine API-Kosten
- ✅ Echte Antworten basierend auf dem Text
- ✅ Eltern können Antworten ihrer Kinder überprüfen

**Beispiel**:
```javascript
// Text: "Der Wald ist voller Tiere. Dort leben Rehe, Füchse und Vögel..."

Frage 1: "Worum geht es in diesem Text?"
Antwort: "Der Text handelt von: Der Wald ist voller Tiere. Wichtige Begriffe sind: Tiere, leben, Vögel."

Frage 2: "Welche wichtigen Informationen werden genannt?"
Antwort: "Im Text steht: 'Dort leben Rehe, Füchse und Vögel'. Der Text enthält insgesamt 42 Wörter und 4 Sätze."

Frage 3: "Wie endet der Text?"
Antwort: "Am Ende heißt es: 'Alle Tiere leben friedlich zusammen.'"
```

## Prompt-Optimierung

Der Prompt wurde vereinfacht, um mit verschiedenen Modellen besser zu funktionieren:

```
Du bist ein Lehrer und erstellst Verständnisfragen auf Deutsch für Kinder (Grundschule, Schwierigkeit: mittel).

Text: "[Text hier]"

Aufgabe: Erstelle genau 3 Verständnisfragen mit Antworten zum Text. 
Antworte NUR mit einem JSON-Array, ohne weitere Erklärungen.

Format:
[
  {"question": "Frage 1?", "answer": "Antwort 1."},
  {"question": "Frage 2?", "answer": "Antwort 2."},
  {"question": "Frage 3?", "answer": "Antwort 3."}
]

JSON-Antwort:
```

## Testing

Verwende die **HuggingFaceTest** Komponente in der App oder rufe direkt auf:

```bash
curl -X GET \
  https://[project-id].supabase.co/functions/v1/make-server-e4c1b088/test-hf \
  -H "Authorization: Bearer [anon-key]"
```

Die Test-Route prüft alle 4 Modelle und gibt detaillierte Informationen zurück.

## Rate Limits

- **5 Requests** pro Stunde pro Profil
- **20 Requests** pro Tag pro Profil
- Limits gelten für **erfolgreiche** Generierungen (nicht für Fallback)

## Fehlerbehandlung

Die App behandelt folgende Fehler gracefully:

- **404**: Model nicht gefunden → Nächstes Model probieren
- **503**: Model lädt noch → 1 Sekunde warten, nächstes Model probieren
- **401/403**: API-Key Problem → Nächstes Model probieren
- **400**: Bad Request → Parameter inkompatibel, nächstes Model probieren

Wenn alle Modelle fehlschlagen, wird der User informiert und Fallback-Fragen werden verwendet.

## Environment Variable

Benötigt:
```
HUGGINGFACE_API_KEY=hf_xxxxxxxxxxxxxxxxxxxxx
```

Kann erstellt werden auf: https://huggingface.co/settings/tokens

**Wichtig**: "Read" Berechtigung ist ausreichend für die Inference API.

## Kostenstruktur

- ✅ Hugging Face Inference API: **KOSTENLOS** (mit Rate Limits)
- ✅ Fallback-Fragen: **KOSTENLOS** (lokal generiert)
- ⚠️ Rate Limits verhindern Missbrauch
- 💡 Perfekt für kostenloses Affiliate-Marketing finanziertes App

## Weiterentwicklung

Mögliche Verbesserungen:

1. **Caching**: Gleiche Texte nicht erneut verarbeiten
2. **User-Feedback**: Fragen bewerten lassen
3. **Custom Fine-Tuning**: Eigenes Modell für bessere Qualität
4. **Paid API**: Falls App erfolgreich ist → OpenAI API für Premium-User

## Support

Bei Problemen:
1. Check HuggingFaceTest Widget
2. Check Server Logs in Supabase
3. Verify API Key ist gesetzt
4. Fallback-Modus funktioniert immer!
