# 🔑 Environment Variables für Vercel Deployment

## Erforderliche Keys für LessScreen v1.0.0-rc1

### 📌 Verwendungszweck

Diese Environment Variables werden benötigt, damit deine LessScreen-App auf Vercel mit vollem Funktionsumfang läuft:

---

## 🟢 KRITISCH - MUSS konfiguriert werden

Diese Keys sind **absolut notwendig** für den Betrieb der App:

### 1. **SUPABASE_URL**
- **Wert:** `https://zyxegdbqpkboiyydasao.supabase.co`
- **Verwendung:** Basis-URL für Supabase Backend
- **Wo verwendet:** Frontend + Backend (Supabase Client)

### 2. **SUPABASE_ANON_KEY**
- **Wert:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp5eGVnZGJxcGtib2l5eWRhc2FvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA2NTY3NzUsImV4cCI6MjA3NjIzMjc3NX0.u085HTiEnejTxMmtxoOhpkYJn___SSQZdXs5aWiTK5E`
- **Verwendung:** Public Anon Key für Frontend-API-Calls
- **Wo verwendet:** Frontend API Client

### 3. **SUPABASE_SERVICE_ROLE_KEY**
- **Wert:** [MUSS VON SUPABASE DASHBOARD KOPIERT WERDEN]
- **Verwendung:** Admin-Key für Backend (KV Store)
- **Wo verwendet:** Supabase Edge Function (kv_store.tsx)
- **⚠️ WICHTIG:** Darf NIE im Frontend exponiert werden!

### 4. **SUPABASE_DB_URL**
- **Wert:** [MUSS VON SUPABASE DASHBOARD KOPIERT WERDEN]
- **Format:** `postgresql://postgres:[PASSWORD]@db.zyxegdbqpkboiyydasao.supabase.co:5432/postgres`
- **Verwendung:** Direkte Datenbank-Verbindung (falls benötigt)
- **Wo verwendet:** Backend nur

---

## 🟡 EMPFOHLEN - Für volle Features

Diese Keys ermöglichen erweiterte Features, aber die App funktioniert auch ohne sie (mit Fallback):

### 5. **OPENROUTER_API_KEY**
- **Wert:** [DEIN OPENROUTER API KEY]
- **Verwendung:** LLM-basierte Fragengenerierung im Lese-Kompass
- **Wo verwendet:** Backend (index.tsx, Route: /generate-questions)
- **Fallback:** App zeigt Fehlermeldung wenn nicht vorhanden
- **Kostenlos:** OpenRouter bietet kostenlose Models:
  - `mistralai/mistral-7b-instruct:free`
  - `meta-llama/llama-3.2-3b-instruct:free`
  - `google/gemma-2-9b-it:free`
  - `qwen/qwen-2-7b-instruct:free`

**So bekommst du den Key:**
1. Gehe zu [https://openrouter.ai](https://openrouter.ai)
2. Erstelle einen kostenlosen Account
3. Navigiere zu "API Keys"
4. Erstelle einen neuen Key
5. Kopiere den Key (beginnt mit `sk-or-v1-...`)

---

## ❌ NICHT MEHR BENÖTIGT

Diese Keys waren früher verwendet, werden aber nicht mehr benötigt:

### ~~HUGGINGFACE_API_KEY~~
- **Status:** ⛔ VERALTET - Wurde durch OpenRouter ersetzt
- **Grund:** Migration zu OpenRouter für bessere LLM-Performance

---

## 📋 Vercel Setup - Schritt für Schritt

### 1. Vercel Projekt erstellen
```bash
# Mit GitHub verbinden (empfohlen)
vercel.com → "Add New Project" → Repository auswählen
```

### 2. Environment Variables setzen

Gehe zu: **Vercel Dashboard → Dein Projekt → Settings → Environment Variables**

Trage folgende Keys ein:

| Name | Value | Environment |
|------|-------|-------------|
| `SUPABASE_URL` | `https://zyxegdbqpkboiyydasao.supabase.co` | Production, Preview, Development |
| `SUPABASE_ANON_KEY` | `eyJhbGci...` (siehe oben) | Production, Preview, Development |
| `SUPABASE_SERVICE_ROLE_KEY` | [Von Supabase Dashboard] | Production, Preview, Development |
| `SUPABASE_DB_URL` | `postgresql://...` | Production, Preview, Development |
| `OPENROUTER_API_KEY` | `sk-or-v1-...` (optional) | Production, Preview, Development |

### 3. Supabase Service Role Key finden

1. Gehe zu [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Wähle dein Projekt: `zyxegdbqpkboiyydasao`
3. Gehe zu: **Settings → API**
4. Unter "Project API keys" findest du:
   - ✅ `anon` `public` (bereits bekannt)
   - ✅ `service_role` `secret` ← **DIESEN KOPIEREN**

### 4. Build Settings (Vercel)

Vercel sollte automatisch erkennen, aber prüfe:

```
Framework Preset: Vite
Build Command: npm run build
Output Directory: dist
Install Command: npm install
```

### 5. Deploy!

Klicke auf **"Deploy"** und warte auf den Build.

---

## 🧪 Deployment testen

Nach dem Deployment:

### 1. Grundfunktionen testen
- [ ] App lädt ohne Fehler
- [ ] Onboarding funktioniert
- [ ] Dashboard zeigt Daten
- [ ] Profile können erstellt werden

### 2. Backend-Features testen
- [ ] Lese-Timer speichert Sessions
- [ ] Aktivitäten können erstellt werden
- [ ] Ziele funktionieren
- [ ] Settings werden gespeichert

### 3. OCR & AI testen (wenn OPENROUTER_API_KEY gesetzt)
- [ ] Lese-Kompass: Foto hochladen
- [ ] OCR extrahiert Text
- [ ] AI generiert 3 Fragen
- [ ] Antworten können validiert werden

### 4. Notifications testen
- [ ] Browser-Benachrichtigungen können aktiviert werden
- [ ] Timer-Ablauf sendet Notification
- [ ] Verschiedene Notification-Typen funktionieren

---

## 🚨 Häufige Probleme & Lösungen

### Problem: "Service-Konfiguration fehlt"
**Ursache:** `OPENROUTER_API_KEY` fehlt  
**Lösung:** 
1. OpenRouter API Key erstellen (siehe oben)
2. In Vercel Environment Variables eintragen
3. Redeploy auslösen

### Problem: "Failed to fetch from server"
**Ursache:** Supabase Keys falsch oder fehlend  
**Lösung:**
1. Prüfe alle 4 Supabase Keys
2. Stelle sicher, dass keine Leerzeichen am Anfang/Ende sind
3. Redeploy auslösen

### Problem: "CORS Error"
**Ursache:** Supabase Edge Function nicht deployed  
**Lösung:**
```bash
# Deploye die Supabase Edge Function
supabase functions deploy make-server-e4c1b088

# Setze Secrets
supabase secrets set SUPABASE_URL=https://zyxegdbqpkboiyydasao.supabase.co
supabase secrets set SUPABASE_SERVICE_ROLE_KEY=[DEIN_KEY]
supabase secrets set OPENROUTER_API_KEY=[DEIN_KEY]
```

### Problem: "Rate Limit exceeded"
**Ursache:** OCR/AI Limit erreicht (5/Stunde, 20/Tag pro User)  
**Lösung:** Das ist normales Verhalten für Prototypen. Warte 1 Stunde oder 1 Tag.

---

## 📊 Monitoring nach Deployment

Nutze Vercel's eingebaute Tools:

1. **Vercel Dashboard → Analytics**
   - Seitenaufrufe
   - Performance-Metriken
   - Fehlerquote

2. **Vercel Dashboard → Logs**
   - Runtime Logs
   - Build Logs
   - Function Logs

3. **Supabase Dashboard → Logs**
   - Edge Function Logs
   - Database Queries
   - API Requests

---

## ✅ Final Checklist

Vor dem Versand an Test-User:

- [ ] Alle 5 Environment Variables in Vercel gesetzt
- [ ] Supabase Edge Function deployed
- [ ] Supabase Secrets gesetzt
- [ ] Production Build erfolgreich
- [ ] Alle Features manuell getestet
- [ ] Keine Console-Errors
- [ ] Mobile-responsive funktioniert
- [ ] HTTPS-URL aktiv
- [ ] Domain konfiguriert (optional)

---

## 🎉 Ready to Deploy!

**Zusammenfassung der benötigten Keys:**

```env
# KRITISCH (MUSS vorhanden sein)
SUPABASE_URL=https://zyxegdbqpkboiyydasao.supabase.co
SUPABASE_ANON_KEY=eyJhbGci... (siehe oben)
SUPABASE_SERVICE_ROLE_KEY=[VON SUPABASE DASHBOARD]
SUPABASE_DB_URL=postgresql://... [VON SUPABASE DASHBOARD]

# EMPFOHLEN (für volle Features)
OPENROUTER_API_KEY=sk-or-v1-... [VON OPENROUTER.AI]
```

**Nächste Schritte:**

1. ✅ Kopiere die Keys in Vercel Environment Variables
2. ✅ Deploy die Supabase Edge Function
3. ✅ Klicke auf "Deploy" in Vercel
4. ✅ Teste alle Features auf der Production-URL
5. ✅ Sende Test-User Guide an deine Tester

**Viel Erfolg mit dem Deployment! 🚀**

---

**Version:** 1.0.0-rc1  
**Letzte Aktualisierung:** $(date)  
**Support:** [DEINE EMAIL/KONTAKT]
