# 🚀 LessScreen - Deployment Guide

**Version:** 1.0.0  
**Zielgruppe:** Entwickler & DevOps  
**Geschätzte Zeit:** 30-45 Minuten

---

## 📋 Voraussetzungen

- [x] Supabase Account (https://supabase.com)
- [x] Node.js 18+ installiert
- [x] Git installiert
- [x] Terminal/Command Line Zugriff

---

## 🛠️ Schritt 1: Supabase Project Setup

### 1.1 Neues Projekt erstellen

1. Gehe zu https://supabase.com/dashboard
2. Klicke auf "New Project"
3. Wähle:
   - **Organization:** Deine Organization
   - **Name:** LessScreen
   - **Database Password:** Generiere sicheres Passwort (speichern!)
   - **Region:** Europe (Frankfurt/Amsterdam für DSGVO)
4. Klicke "Create new project"
5. Warte ~2 Minuten bis Projekt bereit ist

### 1.2 API Credentials abrufen

1. Gehe zu: **Settings** → **API**
2. Kopiere:
   - **Project URL:** `https://YOUR_PROJECT_ID.supabase.co`
   - **anon public key:** `eyJhbGci...` (lange JWT)
   - **service_role key:** `eyJhbGci...` (andere JWT, GEHEIM!)

**⚠️ WICHTIG:** 
- `anon public` ist sicher für Frontend
- `service_role` NIEMALS im Frontend verwenden!

---

## 🔧 Schritt 2: Backend Deployment

### 2.1 Supabase CLI installieren

```bash
npm install -g supabase
```

### 2.2 Login

```bash
supabase login
```

→ Browser öffnet sich, autorisiere die CLI

### 2.3 Project linken

```bash
# Im Projekt-Root-Verzeichnis
cd /path/to/lessscreen

# Link to Supabase Project
supabase link --project-ref YOUR_PROJECT_ID
```

**YOUR_PROJECT_ID** findest du in der Project URL: `https://[HIER].supabase.co`

### 2.4 Environment Variables setzen (Backend)

1. Gehe zu: **Edge Functions** → **Settings** (oder direkt in Dashboard)
2. Füge Secrets hinzu:

```
SUPABASE_URL = https://YOUR_PROJECT_ID.supabase.co
SUPABASE_SERVICE_ROLE_KEY = [dein service_role key von Schritt 1.2]
```

**Wichtig:** Diese Secrets sind nur im Backend verfügbar!

### 2.5 Edge Function deployen

```bash
# Deploy der Server Function
supabase functions deploy make-server-e4c1b088
```

**Erwartete Ausgabe:**
```
Deploying function make-server-e4c1b088...
Function make-server-e4c1b088 deployed successfully!
URL: https://YOUR_PROJECT_ID.supabase.co/functions/v1/make-server-e4c1b088
```

### 2.6 Backend testen

```bash
# Health Check
curl https://YOUR_PROJECT_ID.supabase.co/functions/v1/make-server-e4c1b088/health
```

**Erwartete Response:**
```json
{
  "status": "ok",
  "timestamp": "2025-10-21T12:00:00.000Z"
}
```

✅ Backend deployed!

---

## 🌐 Schritt 3: Frontend Deployment

### 3.1 Environment Variables setzen (Frontend)

Erstelle `.env` im Projekt-Root:

```env
VITE_SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_public_key_from_step_1.2
```

**Oder:** Kopiere `.env.example` und fülle aus:
```bash
cp .env.example .env
# Dann editiere .env mit deinen Werten
```

### 3.2 Build erstellen

```bash
# Dependencies installieren
npm install

# Production Build
npm run build
```

**Erwartete Ausgabe:**
```
✓ built in 12.34s
dist/index.html          X.XX kB
dist/assets/index-abc123.js   XXX.XX kB
```

### 3.3 Deployment-Option wählen

#### Option A: Vercel (Empfohlen) ⭐

```bash
# Vercel CLI installieren
npm install -g vercel

# Deploy
vercel --prod
```

**Schritte:**
1. Login mit GitHub/GitLab
2. "Set up and deploy?" → **Yes**
3. "Which scope?" → Wähle deine Organization
4. "Link to existing project?" → **No**
5. "What's your project's name?" → `lessscreen`
6. "In which directory is your code located?" → `./`
7. Warte auf Deployment (~1-2 Min)

**Fertig!** Deine URL: `https://lessscreen.vercel.app`

---

#### Option B: Netlify

```bash
# Netlify CLI installieren
npm install -g netlify-cli

# Login
netlify login

# Deploy
netlify deploy --prod
```

**Schritte:**
1. "Create & configure a new site" → **Yes**
2. "Team:" → Wähle dein Team
3. "Site name:" → `lessscreen`
4. "Publish directory:" → `dist`
5. Warte auf Deployment

**Fertig!** Deine URL: `https://lessscreen.netlify.app`

---

#### Option C: Supabase Storage (Statisches Hosting)

```bash
# Build wurde bereits erstellt (npm run build)

# Upload zu Supabase Storage
supabase storage cp dist/ supabase://public/lessscreen --recursive
```

**Dann:**
1. Gehe zu Dashboard → **Storage** → **Buckets**
2. Erstelle öffentlichen Bucket: `public`
3. Upload `dist/` Inhalt
4. Aktiviere "Public Bucket"
5. URL: `https://YOUR_PROJECT_ID.supabase.co/storage/v1/object/public/lessscreen/index.html`

---

### 3.4 Environment Variables auf Hosting-Platform setzen

#### Vercel:
1. Dashboard → Settings → Environment Variables
2. Füge hinzu:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
3. Redeploy

#### Netlify:
1. Site Settings → Environment Variables
2. Füge hinzu:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
3. Trigger new deploy

---

## ✅ Schritt 4: Deployment-Verification

### 4.1 Backend Health Check

```bash
curl https://YOUR_PROJECT_ID.supabase.co/functions/v1/make-server-e4c1b088/health
```

**Erwartete Response:**
```json
{
  "status": "ok",
  "timestamp": "..."
}
```

### 4.2 Frontend Check

1. Öffne deine deployed URL
2. Check:
   - [ ] Willkommensseite lädt
   - [ ] Onboarding funktioniert
   - [ ] Profil kann erstellt werden
   - [ ] Dashboard zeigt Daten

### 4.3 Integration Check

1. Starte Onboarding
2. Erstelle Profil
3. Starte Reading Timer (30 Sekunden)
4. Beende Timer
5. Öffne Dashboard
6. Check:
   - [ ] Session wurde gespeichert
   - [ ] Bildschirmzeit wurde berechnet
   - [ ] Statistiken zeigen korrekten Wert

✅ **Wenn alle Checks erfolgreich:** Deployment komplett!

---

## 🔐 Schritt 5: Security & Production Readiness

### 5.1 CORS konfigurieren (Production)

**Nach Deployment:**

1. Öffne `/supabase/functions/server/index.tsx`
2. Ändere CORS Origin:

```typescript
// DEV (aktuell):
cors({ origin: "*" })

// PRODUCTION:
cors({ 
  origin: [
    "https://lessscreen.vercel.app",
    "https://www.lessscreen.app"
  ]
})
```

3. Redeploy Backend:
```bash
supabase functions deploy make-server-e4c1b088
```

### 5.2 Custom Domain (Optional)

#### Vercel:
1. Dashboard → Settings → Domains
2. Add Domain: `lessscreen.app`
3. Konfiguriere DNS (A/CNAME Records)
4. Warte auf SSL-Zertifikat (~5 Min)

#### Netlify:
1. Site Settings → Domain Management
2. Add custom domain
3. Folge DNS-Anweisungen

### 5.3 SSL/HTTPS

- ✅ Vercel: Automatisch (Let's Encrypt)
- ✅ Netlify: Automatisch (Let's Encrypt)
- ✅ Supabase: Immer HTTPS

---

## 📊 Schritt 6: Monitoring Setup

### 6.1 Supabase Monitoring

1. Dashboard → **Logs**
2. Aktiviere:
   - Edge Function Logs
   - Database Logs
3. Set up Alerts für:
   - Error Rate > 5%
   - Response Time > 2s

### 6.2 Error Tracking (Optional aber empfohlen)

**Sentry Setup:**

```bash
npm install @sentry/react @sentry/vite-plugin
```

```typescript
// main.tsx
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "YOUR_SENTRY_DSN",
  environment: "production",
});
```

### 6.3 Analytics (Optional)

**Google Analytics:**

```bash
npm install @analytics/google-analytics
```

---

## 🚨 Troubleshooting

### Problem: Backend nicht erreichbar

**Symptom:** API Calls schlagen fehl mit 404

**Lösung:**
```bash
# 1. Check Deployment Status
supabase functions list

# 2. Check Logs
supabase functions logs make-server-e4c1b088

# 3. Redeploy
supabase functions deploy make-server-e4c1b088 --no-verify-jwt
```

### Problem: CORS Error

**Symptom:** "Access-Control-Allow-Origin" Error in Browser Console

**Lösung:**
1. Check Backend CORS Config
2. Verify Frontend URL in allowed origins
3. Redeploy Backend

### Problem: Environment Variables nicht verfügbar

**Symptom:** `undefined` für Supabase URL/Key

**Lösung:**

**Frontend (Vercel/Netlify):**
1. Check Dashboard → Environment Variables
2. Verify Namen: `VITE_` Prefix!
3. Redeploy

**Backend (Supabase):**
1. Dashboard → Edge Functions → Settings
2. Add Secrets
3. Redeploy Function

### Problem: Build schlägt fehl

**Symptom:** `npm run build` Error

**Lösung:**
```bash
# 1. Clean install
rm -rf node_modules package-lock.json
npm install

# 2. Check TypeScript errors
npm run type-check

# 3. Try build again
npm run build
```

---

## 🔄 Updates & Redeployment

### Backend Update

```bash
# 1. Ändere Code in /supabase/functions/server/index.tsx
# 2. Deploy
supabase functions deploy make-server-e4c1b088
```

### Frontend Update

**Vercel:**
```bash
# Option 1: Git Push (Auto-Deploy)
git push origin main

# Option 2: Manual Deploy
vercel --prod
```

**Netlify:**
```bash
# Git Push oder Manual:
netlify deploy --prod
```

---

## 📋 Deployment Checklist

**Vor Production Launch:**

- [ ] Backend deployed & Health Check erfolgreich
- [ ] Frontend deployed & erreichbar
- [ ] Environment Variables gesetzt (Frontend & Backend)
- [ ] Integration Tests bestanden
- [ ] CORS auf Production-Domain beschränkt
- [ ] Custom Domain konfiguriert (optional)
- [ ] SSL/HTTPS aktiv
- [ ] Monitoring aktiviert
- [ ] Error Tracking konfiguriert (Sentry)
- [ ] Analytics aktiviert (Google Analytics)
- [ ] Backup-Strategy definiert
- [ ] Privacy Policy vollständig
- [ ] Support-Kontakt hinterlegt

**Nach Deployment:**

- [ ] Smoke Tests durchgeführt
- [ ] Performance-Check (<3s Ladezeit)
- [ ] Mobile-Test (verschiedene Geräte)
- [ ] Browser-Test (Chrome, Safari, Firefox)
- [ ] User-Testing (Beta-Tester)

---

## 🎉 Deployment Complete!

**Deine LessScreen App ist jetzt live!** 🚀

**URLs:**
- **Frontend:** https://lessscreen.vercel.app (oder deine Domain)
- **Backend:** https://YOUR_PROJECT_ID.supabase.co/functions/v1/make-server-e4c1b088
- **Dashboard:** https://supabase.com/dashboard/project/YOUR_PROJECT_ID

---

## 📞 Support

**Bei Problemen:**
- Check [INTEGRATION_CHECKLIST.md](./INTEGRATION_CHECKLIST.md)
- Siehe [PRD.md](./PRD.md) für Details
- Email: support@lessscreen.app

---

**Viel Erfolg mit LessScreen! 📚✨**
