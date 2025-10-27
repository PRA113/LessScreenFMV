# 🔑 OpenRouter API-Key Problem - Lösung

## ❌ Aktuelles Problem

**Fehler:** `Error 401: {"error":{"message":"User not found.","code":401}}`

**Ursache:** Der OpenRouter API-Key ist ungültig, abgelaufen oder gehört zu einem nicht existierenden User.

**Status:** Alle 4 Free Models schlagen fehl mit 401 Unauthorized

---

## ✅ Lösung: Neuen API-Key erstellen

### Schritt 1: OpenRouter Account erstellen/anmelden

1. **Gehe zu:** https://openrouter.ai/
2. **Klicke auf:** "Sign In" oder "Sign Up"
3. **Melde dich an mit:**
   - Google Account (empfohlen)
   - GitHub Account
   - Email/Password

### Schritt 2: API-Key generieren

1. **Nach dem Login:** Gehe zu https://openrouter.ai/keys
2. **Klicke auf:** "Create Key" oder "+ New Key"
3. **Name eingeben:** z.B. "LessScreen Production"
4. **Klicke auf:** "Create"
5. **Kopiere den Key:** Er beginnt mit `sk-or-v1-...`

⚠️ **WICHTIG:** Kopiere den Key sofort! Er wird nur einmal angezeigt.

### Schritt 3: API-Key Credits (Optional für Free Models)

**Gute Nachricht:** Free Models benötigen **KEINE** Credits!

Die folgenden Models sind komplett kostenlos:
- ✅ `mistralai/mistral-7b-instruct:free`
- ✅ `meta-llama/llama-3.2-3b-instruct:free`
- ✅ `google/gemma-2-9b-it:free`
- ✅ `qwen/qwen-2-7b-instruct:free`

**Aber:** Dein Account muss gültig sein (Email verifiziert)!

### Schritt 4: Email verifizieren (WICHTIG!)

🚨 **Das ist oft das Problem!**

1. Gehe zu deiner Email (die du bei der Registrierung verwendet hast)
2. Suche nach einer Email von OpenRouter
3. Klicke auf den Verification-Link
4. Bestätige deine Email-Adresse

**Ohne verifizierte Email:** API-Calls schlagen mit 401 fehl!

### Schritt 5: API-Key in Supabase Environment Variable setzen

**Option A: Über Supabase Dashboard** (Empfohlen)

1. Gehe zu: https://supabase.com/dashboard
2. Wähle dein LessScreen Projekt
3. Navigiere zu: **Settings** → **Edge Functions** → **Secrets**
4. Finde: `OPENROUTER_API_KEY`
5. Klicke auf **Edit**
6. Füge deinen neuen Key ein: `sk-or-v1-...`
7. Klicke auf **Save**

**Option B: Über Supabase CLI**

```bash
# Im Terminal:
supabase secrets set OPENROUTER_API_KEY=sk-or-v1-DEIN-KEY-HIER

# Verifizieren:
supabase secrets list
```

**Option C: Über Vercel (wenn du direkt auf Vercel deployed hast)**

1. Gehe zu: https://vercel.com/dashboard
2. Wähle dein LessScreen Projekt
3. Gehe zu: **Settings** → **Environment Variables**
4. Finde: `OPENROUTER_API_KEY`
5. Klicke auf **Edit**
6. Füge deinen neuen Key ein
7. Klicke auf **Save**
8. **Re-deploy** das Projekt (wichtig!)

---

## 🧪 Testen ob es funktioniert

### Test 1: Lokaler Test (Development)

1. **Setze Environment Variable:**
   ```bash
   # In .env.local (erstelle die Datei wenn sie nicht existiert)
   OPENROUTER_API_KEY=sk-or-v1-DEIN-KEY-HIER
   ```

2. **Starte Dev-Server neu:**
   ```bash
   # Stoppe den Server (Ctrl+C)
   npm run dev
   ```

3. **Teste im Browser:**
   - Gehe zum Reading Compass
   - Lade ein Bild hoch
   - Klicke auf "Fragen generieren"
   - Prüfe die Console auf Fehler

### Test 2: API-Endpoint Test

**Erstelle einen Test-Request:**

```bash
curl -X POST https://DEIN-PROJEKT.supabase.co/functions/v1/make-server-e4c1b088/test-openrouter \
  -H "Authorization: Bearer DEIN_SUPABASE_ANON_KEY"
```

**Erwartete Antwort bei Erfolg:**
```json
{
  "success": true,
  "apiKeyPresent": true,
  "workingModels": [
    "mistralai/mistral-7b-instruct:free"
  ],
  "message": "OpenRouter funktioniert!"
}
```

**Fehler wenn API-Key fehlt:**
```json
{
  "success": false,
  "error": "OPENROUTER_API_KEY nicht gesetzt"
}
```

### Test 3: Im Reading Compass

1. **Öffne die App** (lokal oder deployed)
2. **Navigiere zu:** Reading Compass (Kompass-Icon in der Tab Bar)
3. **Lade ein Bild hoch** mit Text (oder mache ein Foto)
4. **Klicke:** "Fragen generieren"
5. **Prüfe:**
   - ✅ Fragen werden generiert
   - ✅ Keine 401-Fehler in der Console
   - ✅ "Generiere Fragen..." erscheint und verschwindet

---

## 🔍 Troubleshooting

### Problem: Immer noch 401 Error

**Checkliste:**

- [ ] **Email verifiziert?** → Checke deine Email!
- [ ] **Key korrekt kopiert?** → Enthält `sk-or-v1-` am Anfang?
- [ ] **Leerzeichen im Key?** → Entferne führende/trailing Leerzeichen
- [ ] **Environment Variable gesetzt?** → Prüfe in Supabase Dashboard
- [ ] **Server neu gestartet?** → Supabase Edge Functions neu deployed?
- [ ] **Account aktiv?** → Melde dich bei OpenRouter an und prüfe

### Problem: "Rate limit exceeded"

**Lösung:** Free Models haben Rate Limits

- **Free Tier Limit:** ~20-50 Requests pro Minute
- **Warte 1 Minute** und versuche es erneut
- **Oder:** Upgrade auf einen kostenpflichtigen Plan

### Problem: "Model not found"

**Lösung:** Model-Name falsch

Verwende **exakt diese Namen:**
```
mistralai/mistral-7b-instruct:free
meta-llama/llama-3.2-3b-instruct:free
google/gemma-2-9b-it:free
qwen/qwen-2-7b-instruct:free
```

**Ohne** `:free` funktionieren die Models nicht kostenlos!

### Problem: "No credits available"

**Lösung für Free Models:** Sollte nicht passieren!

Free Models benötigen **keine Credits**. Wenn dieser Fehler erscheint:

1. Prüfe ob du `:free` am Ende des Model-Namens hast
2. Verifiziere deine Email
3. Erstelle einen neuen API-Key

---

## 📋 Environment Variables Checkliste

Stelle sicher, dass **alle** diese Variables gesetzt sind:

### Supabase (bereits vorhanden ✅)
- `SUPABASE_URL` - Die URL deines Supabase Projekts
- `SUPABASE_ANON_KEY` - Public Anonymous Key
- `SUPABASE_SERVICE_ROLE_KEY` - Service Role Key (secret!)
- `SUPABASE_DB_URL` - Database Connection String

### OpenRouter (muss neu gesetzt werden ⚠️)
- `OPENROUTER_API_KEY` - Dein neuer API-Key von openrouter.ai

### Optional
- `HUGGINGFACE_API_KEY` - Falls du Hugging Face nutzen willst (alternative)

---

## 🔐 Sicherheit

**⚠️ WICHTIG:**

- ✅ API-Keys sind **geheim**! Teile sie nicht
- ✅ Committe **niemals** API-Keys in Git
- ✅ Verwende Environment Variables (nicht hardcoded)
- ✅ Rotiere Keys regelmäßig (alle 3-6 Monate)
- ✅ Nutze separate Keys für Dev/Staging/Production

**Wenn dein Key kompromittiert wurde:**

1. Gehe zu https://openrouter.ai/keys
2. Klicke auf "Revoke" beim alten Key
3. Erstelle einen neuen Key
4. Update die Environment Variable

---

## 🎯 Nächste Schritte

Nach dem Fix:

1. ✅ **Neuen API-Key erstellt**
2. ✅ **Email verifiziert**
3. ✅ **Key in Supabase gesetzt**
4. ✅ **Test durchgeführt**
5. ➡️ **App neu deployed** (falls auf Vercel)
6. ➡️ **Teste Reading Compass Feature**
7. ➡️ **Bereit für Testphase!**

---

## 📞 Support

**Falls das Problem weiterhin besteht:**

1. **OpenRouter Support:** https://openrouter.ai/docs
2. **Discord:** https://discord.gg/openrouter
3. **Prüfe Docs:** https://openrouter.ai/docs/quick-start

**Häufige Lösungen:**
- 90% der Probleme: Email nicht verifiziert
- 5% der Probleme: Key falsch kopiert (Leerzeichen!)
- 5% der Probleme: Environment Variable nicht gesetzt

---

## ✅ Zusammenfassung

**Das brauchst du:**

1. **Gültiger OpenRouter Account** mit verifizierter Email
2. **Neuer API-Key** von https://openrouter.ai/keys
3. **Key gesetzt** in Supabase/Vercel Environment Variables
4. **Server neu gestartet** nach dem Key-Update

**Dann funktioniert es!** 🚀

---

**Version:** 1.0.0-rc1  
**Letzte Aktualisierung:** $(date)  
**Status:** ⚠️ ACTION REQUIRED - API-Key muss neu gesetzt werden
