# 🤗 HuggingFace Fallback Integration

## 📅 Migration zur neuen Inference Providers API

### Was ist passiert?

Am **Januar 2025** hat HuggingFace die alte Inference API (`api-inference.huggingface.co`) als **deprecated** markiert.

Ab **November 1st, 2025** werden alle Requests zur alten Endpoint einen **404 Error** zurückgeben.

### ✅ Migration abgeschlossen

**Alte Endpoint (deprecated):**
```
https://api-inference.huggingface.co/models/...
```

**Neue Endpoint (aktiv seit Jan 2025):**
```
https://router.huggingface.co/hf-inference/v1/chat/completions
```

## 🎯 Fallback-Strategie

LessScreen nutzt jetzt eine **3-stufige Fallback-Strategie** für maximale Zuverlässigkeit:

### 1. OpenRouter (Primär) ⭐

**Models:**
- `mistralai/mistral-7b-instruct:free`
- `meta-llama/llama-3.2-3b-instruct:free`
- `google/gemma-2-9b-it:free`
- `qwen/qwen-2-7b-instruct:free`

**Vorteile:**
- ✅ Schnell & zuverlässig
- ✅ Mehrere kostenlose Models
- ✅ Gute Qualität für deutsche Texte

**API-Key:**
```bash
OPENROUTER_API_KEY=sk-or-v1-...
```

---

### 2. HuggingFace Inference Providers (Fallback) 🤗

**Models:**
- `mistralai/Mistral-7B-Instruct-v0.2`
- `meta-llama/Llama-3.2-3B-Instruct`
- `microsoft/Phi-3-mini-4k-instruct`

**Wann wird es genutzt?**
- Wenn **alle** OpenRouter Models fehlschlagen
- Automatischer Fallback ohne User-Interaktion

**Vorteile:**
- ✅ Kostenlos
- ✅ Zuverlässig
- ✅ Neue Inference Providers API (zukunftssicher)
- ✅ Keine laufenden Kosten

**API-Key:**
```bash
HUGGINGFACE_API_KEY=hf_...
```

**API-Key erstellen:**
1. 🌐 Gehe zu https://huggingface.co/settings/tokens
2. ➕ Klicke "New Token"
3. 📝 Name: "LessScreen"
4. ✅ Typ: "Read" (ausreichend für Inference)
5. 📋 Kopiere den Token

---

### 3. Lokaler Fallback (Notfall) 💡

**Wann wird es genutzt?**
- Wenn OpenRouter **UND** HuggingFace fehlschlagen
- Oder wenn keine API-Keys konfiguriert sind

**Funktionsweise:**
- Regelbasierte Fragengenerierung
- Basiert auf erkanntem Text
- Funktioniert 100% offline
- Kein API-Call nötig

**Vorteile:**
- ✅ Immer verfügbar
- ✅ Keine API-Limits
- ✅ Sofortige Response
- ✅ Gut für Testing

**Nachteile:**
- ⚠️ Einfachere Fragen
- ⚠️ Weniger kontextbezogen

---

## 🔧 Implementierung

### Server-Side (Supabase Edge Function)

```typescript
// 1. Versuche OpenRouter
for (const model of openRouterModels) {
  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {...});
    if (response.ok) {
      aiData = await response.json();
      break; // Erfolg!
    }
  } catch (error) {
    continue; // Nächstes Model
  }
}

// 2. Fallback: HuggingFace Inference Providers
if (!aiData && HUGGINGFACE_API_KEY) {
  for (const hfModel of huggingfaceModels) {
    try {
      const response = await fetch(
        "https://router.huggingface.co/hf-inference/v1/chat/completions",
        {
          headers: {
            Authorization: `Bearer ${HUGGINGFACE_API_KEY}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            model: hfModel,
            messages: [{ role: "user", content: prompt }],
            max_tokens: 800,
            temperature: 0.7
          })
        }
      );
      
      if (response.ok) {
        aiData = await response.json();
        break; // Erfolg!
      }
    } catch (error) {
      continue;
    }
  }
}

// 3. Notfall: Lokaler Fallback
if (!aiData) {
  questions = generateFallbackQuestions(text, difficulty, targetAge);
}
```

---

## 📊 Status-Übersicht

| Service | Status | Kosten | Qualität | Speed |
|---------|--------|--------|----------|-------|
| **OpenRouter** | ✅ Aktiv | Kostenlos (Free Tier) | ⭐⭐⭐⭐⭐ | 🚀 Schnell |
| **HuggingFace** | ✅ Aktiv | Kostenlos | ⭐⭐⭐⭐ | 🚀 Schnell |
| **Lokaler Fallback** | ✅ Aktiv | Kostenlos | ⭐⭐⭐ | ⚡ Sofort |

---

## 🧪 Testing

### Teste den Fallback-Mechanismus:

1. **Test ohne API-Keys:**
   ```bash
   # Entferne beide Keys temporär
   unset OPENROUTER_API_KEY
   unset HUGGINGFACE_API_KEY
   ```
   → Sollte lokalen Fallback verwenden

2. **Test mit nur HuggingFace:**
   ```bash
   # Setze nur HuggingFace Key
   export HUGGINGFACE_API_KEY=hf_...
   unset OPENROUTER_API_KEY
   ```
   → Sollte HuggingFace verwenden

3. **Test mit beiden Keys:**
   ```bash
   export OPENROUTER_API_KEY=sk-or-v1-...
   export HUGGINGFACE_API_KEY=hf_...
   ```
   → Sollte OpenRouter verwenden (primär)

---

## 📝 Deployment

### Supabase Environment Variables:

```bash
# Primär (empfohlen)
OPENROUTER_API_KEY=sk-or-v1-xxxxx

# Fallback (optional aber empfohlen)
HUGGINGFACE_API_KEY=hf_xxxxx

# System (bereits gesetzt)
SUPABASE_URL=...
SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
```

### Deployment-Checkliste:

- ✅ OpenRouter API-Key gesetzt und verifiziert
- ✅ HuggingFace API-Key gesetzt (Fallback)
- ✅ Server deployed auf Supabase
- ✅ Beide APIs getestet
- ✅ Fallback-Logik getestet

---

## 💰 Kosten-Analyse

### Kostenlose Lösung (empfohlen):

**Setup:**
- OpenRouter: Free Tier Models
- HuggingFace: Free Inference API
- Lokaler Fallback: Immer verfügbar

**Limits:**
- OpenRouter Free Tier: ~200 Requests/Tag
- HuggingFace: Rate Limits je nach Model
- LessScreen Rate Limit: 5/Stunde, 20/Tag (pro User)

**Ergebnis:**
- ✅ **0€ laufende Kosten**
- ✅ Ausreichend für Affiliate-finanzierte App
- ✅ Skalierbar durch 3-stufigen Fallback

---

## 🚨 Error Handling

### Automatische Fehlerbehandlung:

1. **OpenRouter 503 (Model Loading):**
   - ✅ Warte 1 Sekunde
   - ✅ Versuche nächstes OpenRouter Model
   - ✅ Nach allen Models → HuggingFace

2. **OpenRouter 401/403 (Auth Error):**
   - ✅ Logge Warnung
   - ✅ Versuche nächstes Model
   - ✅ Dann HuggingFace

3. **OpenRouter 429 (Rate Limit):**
   - ✅ Versuche nächstes Model
   - ✅ Dann HuggingFace

4. **HuggingFace 503 (Model Loading):**
   - ✅ Warte 2 Sekunden
   - ✅ Versuche nächstes HF Model
   - ✅ Nach allen Models → Lokaler Fallback

5. **Alle Services down:**
   - ✅ Lokaler Fallback wird verwendet
   - ✅ User sieht Demo-Modus Banner
   - ✅ App bleibt voll funktional

---

## 📚 Weitere Dokumentation

- [OpenRouter Integration](./OPENROUTER_INTEGRATION.md)
- [Migration zu OpenRouter](./MIGRATION_TO_OPENROUTER.md)
- [HuggingFace Models (deprecated)](./HUGGINGFACE_MODELS.md)
- [Deployment Guide](./DEPLOYMENT.md)

---

## ✅ Status: Production Ready

- ✅ Neue HuggingFace Inference Providers API implementiert
- ✅ 3-stufiger Fallback-Mechanismus aktiv
- ✅ Kostenlose Lösung für Affiliate-Finanzierung
- ✅ Alle Edge Cases behandelt
- ✅ Ready für v1.0.0-rc3

**Version:** 1.0.0-rc3  
**Datum:** 24. Oktober 2025  
**Migration abgeschlossen:** ✅
