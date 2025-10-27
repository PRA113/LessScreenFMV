# OpenRouter Integration - LessScreen App

## Überblick

Die LessScreen App nutzt die **OpenRouter API** zur Generierung von Verständnisfragen basierend auf fotografierten Texten. OpenRouter bietet Zugang zu vielen hochwertigen LLM-Modellen über eine einzige API und ist deutlich zuverlässiger als die Hugging Face Inference API.

## Warum OpenRouter statt Hugging Face?

### Probleme mit Hugging Face Inference API:
- ❌ Viele Modelle geben 404-Fehler zurück (nicht verfügbar)
- ❌ Modelle müssen erst "aufwachen" (503 Errors)
- ❌ Unzuverlässige Verfügbarkeit
- ❌ Komplexe unterschiedliche Parameter je nach Modell

### Vorteile von OpenRouter:
- ✅ **Einheitliche API** (OpenAI-kompatibel)
- ✅ **Kostenlose Modelle** verfügbar
- ✅ **Hohe Zuverlässigkeit** und Verfügbarkeit
- ✅ **Bessere Qualität** der generierten Fragen
- ✅ **Schnellere Antwortzeiten**
- ✅ **Einfache Parameter** für alle Modelle

## Verwendete Modelle

Die folgenden kostenlosen Modelle werden nacheinander getestet, bis eines erfolgreich antwortet:

### 1. **mistralai/mistral-7b-instruct:free** 
- **Typ**: Instruction-tuned LLM
- **Größe**: 7B Parameter
- **Vorteile**: Sehr gute Qualität, deutsch-fähig, zuverlässig
- **Kosten**: ✅ KOSTENLOS
- **Status**: ⭐ Empfohlen (Primary)

### 2. **meta-llama/llama-3.2-3b-instruct:free**
- **Typ**: Instruction-tuned LLM
- **Größe**: 3B Parameter
- **Vorteile**: Schnell, gute Qualität, mehrsprachig
- **Kosten**: ✅ KOSTENLOS
- **Status**: ✅ Empfohlen (Fallback)

### 3. **google/gemma-2-9b-it:free**
- **Typ**: Instruction-tuned LLM
- **Größe**: 9B Parameter
- **Vorteile**: Google Qualität, gut für verschiedene Sprachen
- **Kosten**: ✅ KOSTENLOS
- **Status**: ✅ Backup

### 4. **qwen/qwen-2-7b-instruct:free**
- **Typ**: Instruction-tuned LLM
- **Größe**: 7B Parameter
- **Vorteile**: Zuverlässig, gute Performance
- **Kosten**: ✅ KOSTENLOS
- **Status**: ⚠️ Emergency Fallback

## Fallback-System

Falls **ALLE** OpenRouter Modelle fehlschlagen (sehr unwahrscheinlich), generiert die App automatisch **lokale, regelbasierte Fragen**:

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

Der Prompt wurde für OpenRouter optimiert:

```
Du bist ein erfahrener Lehrer und erstellst Verständnisfragen auf Deutsch für Kinder.

**Zielgruppe:** Grundschule
**Schwierigkeitsgrad:** mittel

**Gelesener Text:**
"[Text hier]"

**Aufgabe:**
Erstelle genau 3 altersgerechte Verständnisfragen mit Antworten basierend auf dem Text.

**Wichtige Regeln:**
- Die Fragen müssen sich direkt auf den gelesenen Text beziehen
- Die Antworten müssen kurz und klar sein (1-2 Sätze)
- Verwende einfache, kindgerechte Sprache
- Stelle verschiedene Fragetypen (Was, Wer, Warum, Wie)

**Antwortformat:**
Antworte NUR mit einem JSON-Array in diesem exakten Format, ohne jegliche zusätzliche Erklärungen oder Markdown:

[
  {"question": "Erste Frage?", "answer": "Erste Antwort."},
  {"question": "Zweite Frage?", "answer": "Zweite Antwort."},
  {"question": "Dritte Frage?", "answer": "Dritte Antwort."}
]
```

## API-Format

OpenRouter verwendet das OpenAI-kompatible Format:

### Request:
```json
{
  "model": "mistralai/mistral-7b-instruct:free",
  "messages": [
    {
      "role": "user",
      "content": "Prompt hier..."
    }
  ],
  "temperature": 0.7,
  "max_tokens": 800,
  "top_p": 0.9
}
```

### Response:
```json
{
  "choices": [
    {
      "message": {
        "role": "assistant",
        "content": "[{\"question\": \"...\", \"answer\": \"...\"}...]"
      }
    }
  ]
}
```

## Testing

Verwende die **HuggingFaceTest** Komponente (wurde zu OpenRouter umbenannt) in der App oder rufe direkt auf:

```bash
curl -X GET \
  https://[project-id].supabase.co/functions/v1/make-server-e4c1b088/test-openrouter \
  -H "Authorization: Bearer [anon-key]"
```

Die Test-Route prüft alle 4 Modelle und gibt detaillierte Informationen zurück.

## Rate Limits

- **5 Requests** pro Stunde pro Profil
- **20 Requests** pro Tag pro Profil
- Limits gelten für **erfolgreiche** Generierungen (nicht für Fallback)
- OpenRouter selbst hat sehr großzügige Limits für kostenlose Modelle

## Fehlerbehandlung

Die App behandelt folgende Fehler gracefully:

- **404**: Model nicht gefunden → Nächstes Model probieren
- **503**: Service nicht verfügbar → 1 Sekunde warten, nächstes Model probieren
- **401/403**: API-Key Problem → Nächstes Model probieren
- **400**: Bad Request → Parameter inkompatibel, nächstes Model probieren
- **429**: Rate Limit erreicht → Nächstes Model probieren

Wenn alle Modelle fehlschlagen, wird der User informiert und Fallback-Fragen werden verwendet.

## Environment Variable

Benötigt:
```
OPENROUTER_API_KEY=sk-or-v1-xxxxxxxxxxxxxxxxxxxxx
```

Kann erstellt werden auf: https://openrouter.ai/keys

**Wichtig**: 
- Kostenlose API-Keys sind verfügbar
- Keine Kreditkarte erforderlich für kostenlose Modelle
- Keys können mit Limits versehen werden

## Kostenstruktur

- ✅ OpenRouter kostenlose Modelle: **KOSTENLOS** 
- ✅ Fallback-Fragen: **KOSTENLOS** (lokal generiert)
- ⚠️ Rate Limits verhinnen Missbrauch
- 💡 Perfekt für kostenloses Affiliate-Marketing finanziertes App

### Kostenvergleich (falls Premium gewünscht):
Für zukünftige Premium-Features mit bezahlten Modellen:
- GPT-3.5-Turbo: ~$0.0005 pro Generierung
- GPT-4: ~$0.01 pro Generierung
- Claude 3 Haiku: ~$0.0003 pro Generierung

Aber: **Kostenlose Modelle reichen völlig aus!**

## Migration von Hugging Face

### Was wurde geändert:

1. **Server** (`/supabase/functions/server/index.tsx`):
   - ✅ Hugging Face API Calls → OpenRouter API Calls
   - ✅ Model-Liste aktualisiert
   - ✅ Request-Format auf OpenAI-kompatibel umgestellt
   - ✅ Response-Parsing angepasst
   - ✅ Test-Route `/test-openrouter` hinzugefügt

2. **Test-Komponente** (`/components/HuggingFaceTest.tsx`):
   - ✅ UI auf "OpenRouter API Test" aktualisiert
   - ✅ API-Endpoint auf `/test-openrouter` geändert
   - ✅ Link zu OpenRouter statt Hugging Face

3. **Environment Variable**:
   - ✅ `OPENROUTER_API_KEY` wird jetzt verwendet
   - ℹ️ `HUGGINGFACE_API_KEY` wird nicht mehr benötigt

### Rückwärtskompatibilität:
- ✅ Fallback-System bleibt identisch
- ✅ Alle API-Signaturen bleiben gleich
- ✅ Keine Breaking Changes für Frontend

## Weiterentwicklung

Mögliche Verbesserungen:

1. **Caching**: Gleiche Texte nicht erneut verarbeiten
2. **User-Feedback**: Fragen bewerten lassen
3. **Premium Models**: Falls App erfolgreich ist → GPT-4 für Premium-User
4. **Multi-Language**: Automatische Spracherkennung
5. **Schwierigkeitsgrad-Anpassung**: Dynamisch basierend auf Erfolgsrate

## Support

Bei Problemen:
1. ✅ Check OpenRouter Test Widget in der App
2. ✅ Check Server Logs in Supabase
3. ✅ Verify `OPENROUTER_API_KEY` ist gesetzt
4. ✅ Fallback-Modus funktioniert immer!

## Wichtige Links

- OpenRouter Dashboard: https://openrouter.ai/
- API Keys: https://openrouter.ai/keys
- Dokumentation: https://openrouter.ai/docs
- Verfügbare Modelle: https://openrouter.ai/models
