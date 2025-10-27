# 📚 LessScreen - Lesezeit fördern, Bildschirmzeit verdienen

> **Eine Mobile-First Web-App, die Kinder zum Lesen motiviert und Eltern die Kontrolle über Bildschirmzeit gibt.**

![Version](https://img.shields.io/badge/version-1.0.0--rc1-purple)
![Status](https://img.shields.io/badge/status-testphase-brightgreen)
![License](https://img.shields.io/badge/license-proprietary-red)

---

## 🌟 Übersicht

**LessScreen** ist eine gamifizierte Lese-App für Familien, die ein 1:1 Verhältnis zwischen Lesezeit und verdiente Bildschirmzeit implementiert. Kinder können durch Lesen Bildschirmzeit verdienen, Ränge aufsteigen und Ziele erreichen. Eltern haben volle Kontrolle und können das Leseverständnis durch den "Lese-Kompass" validieren.

### ✨ Kernfeatures

- 📖 **Reading Timer** - Lesezeit erfassen mit Browser-Notifications
- 📸 **Lese-Kompass** - Leseverständnis durch Foto + Fragen validieren
- 🏆 **Rang-System** - 9 motivierende Ränge (🐛 bis 👑)
- 🎯 **Ziele** - Individuelle Leseziele (täglich/wöchentlich/monatlich)
- 📊 **Dashboard** - Fortschritt visualisiert im Donut Chart
- 🎨 **Vibrant Clarity Design** - Claymorphismus mit Emojis
- 👨‍👩‍👧‍👦 **Multi-Profile** - Mehrere Kinder verwalten
- ⚙️ **Anpassbar** - Leseverhältnis & eigene Aktivitäten

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm oder yarn
- Supabase Account (für Backend)

### Installation

```bash
# 1. Clone Repository
git clone https://github.com/your-org/lessscreen.git
cd lessscreen

# 2. Install Dependencies
npm install

# 3. Environment Variables
cp .env.example .env
# Edit .env with your Supabase credentials

# 4. Start Development Server
npm run dev
```

### Backend Setup

```bash
# 1. Install Supabase CLI
npm install -g supabase

# 2. Login to Supabase
supabase login

# 3. Link Project
supabase link --project-ref YOUR_PROJECT_ID

# 4. Deploy Edge Functions
supabase functions deploy make-server-e4c1b088
```

---

## 📖 Dokumentation

### Vollständige Dokumentation

Siehe **[PRD.md](./PRD.md)** für:
- Detaillierte Feature-Beschreibungen
- Technische Architektur
- API-Spezifikation
- Datenmodell
- Security Best Practices
- Deployment-Guide

### Schnellreferenz

#### Technologie-Stack

**Frontend:**
- React 18 + TypeScript
- Tailwind CSS v4.0
- Framer Motion (Animationen)
- Shadcn/ui (UI Components)
- Recharts (Charts)

**Backend:**
- Supabase Edge Functions (Deno)
- Hono Web Framework
- KV Store (Database)
- OpenRouter AI (Fragengenerierung)

**Hosting:**
- Frontend: Vercel/Netlify/Supabase
- Backend: Supabase

---

## 🎨 Design-System

### Vibrant Clarity Theme

```css
/* Farben */
--primary: #8B5CF6        /* Lila */
--secondary: #A78BFA      /* Helles Lila */
--accent: #F472B6         /* Pink */
--background: #F5F3FF     /* Lavendel */

/* Claymorphismus */
border-radius: 16px-32px
box-shadow: 0 10px 40px rgba(139,92,246,0.15)
```

### Design-Prinzipien

1. **Mobile-First** - Optimiert für Smartphones
2. **Emojis statt Icons** - Kindgerecht und verspielt
3. **Claymorphismus** - Weiche Schatten & Verläufe
4. **Vibrant Colors** - Lila-Pink Gradient-System
5. **Smooth Animations** - Framer Motion Transitions

---

## 📁 Projekt-Struktur

```
lessscreen/
├── /components           # React Components
│   ├── Dashboard.tsx
│   ├── ReadingTimer.tsx
│   ├── ReadingCompass.tsx
│   ├── Settings.tsx
│   ├── ProfileEdit.tsx
│   ├── OnboardingTutorial.tsx
│   └── /ui              # Shadcn Components
├── /utils
│   ├── api-client.ts    # API Client
│   └── /supabase
│       └── info.tsx     # Supabase Config
├── /supabase/functions/server
│   ├── index.tsx        # Hono Server
│   └── kv_store.tsx     # KV Utilities
├── /styles
│   └── globals.css      # Tailwind Config
├── App.tsx              # Main App
├── PRD.md               # Product Requirements Document
└── README.md            # This file
```

---

## 🔌 API-Übersicht

### Base URL

```
https://{projectId}.supabase.co/functions/v1/make-server-e4c1b088
```

### Wichtigste Endpoints

```typescript
// User & Profile
POST   /user                    // Create User
POST   /profile                 // Create Profile
GET    /profiles/:userId        // Get All Profiles
PUT    /profile/:id             // Update Profile

// Reading Sessions
POST   /session                 // Create Session
GET    /sessions/:profileId     // Get Sessions

// Goals & Activities
POST   /goal                    // Create Goal
POST   /activity                // Create Activity
GET    /goals/:profileId        // Get Goals
GET    /activities/:profileId   // Get Activities

// Compass & Stats
POST   /compass                 // Save Validation
GET    /stats/:profileId        // Get Statistics
```

Vollständige API-Dokumentation: [PRD.md - API-Spezifikation](./PRD.md#api-spezifikation)

---

## 🧪 Testing

### Status: Beta Phase

Aktuell in Beta-Testing. Feedback willkommen!

### Test-Abdeckung

- ✅ Unit Tests: TODO
- ✅ Integration Tests: TODO
- ✅ E2E Tests: TODO
- ✅ Manual Testing: In Progress

---

## 🔐 Sicherheit

### Implementierte Security-Features

- ✅ No API Keys im Frontend
- ✅ Input Validation (Backend)
- ✅ CORS Configuration
- ✅ HTTPS Only
- ✅ Error Handling & Logging

### TODO (Post-Beta)

- ⏳ User Authentication (Supabase Auth)
- ⏳ Rate Limiting
- ⏳ Data Encryption
- ⏳ GDPR Compliance

Siehe [PRD.md - Sicherheit](./PRD.md#sicherheit) für Details.

---

## 🗺️ Roadmap

### v1.1 (Nach Beta)
- [ ] Vollständige Privacy Policy
- [ ] Support-Center mit FAQ
- [ ] Streak-Berechnung
- [ ] Performance-Optimierungen
- [ ] Bug Fixes

### v2.0 (Production)
- [ ] User Authentication
- [ ] Multi-Device Sync
- [ ] Parent Dashboard
- [ ] Email Notifications
- [ ] Data Export

### v3.0 (Future)
- [ ] Native Apps (iOS/Android)
- [ ] AI Reading Recommendations
- [ ] Social Features
- [ ] Family Sharing

Vollständige Roadmap: [PRD.md - Roadmap](./PRD.md#testphase--roadmap)

---

## 🤝 Contributing

### Beta-Testing

Wir suchen Beta-Tester! Wenn du die App testen möchtest:

1. Kontaktiere uns: support@lessscreen.app
2. Erhalte Zugang zur Beta
3. Nutze die App mit deiner Familie
4. Gib uns Feedback über Issues oder Email

### Bug Reports

Bitte erstelle ein Issue mit:
- Beschreibung des Problems
- Schritte zur Reproduktion
- Screenshots (wenn möglich)
- Browser & Device Info

---

## 📄 License

**Status:** Proprietary (Beta Phase)

Nach Production Launch wird eine Open-Source Lizenz erwogen.

---

## 🙏 Credits

**Entwickelt von:** [Dein Name/Team]  
**Design-System:** Vibrant Clarity  
**UI Framework:** React + Tailwind CSS  
**Backend:** Supabase  
**Icons:** Lucide React + Emojis  

### Dependencies

- [React](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Framer Motion](https://www.framer.com/motion/)
- [Supabase](https://supabase.com/)
- [Shadcn/ui](https://ui.shadcn.com/)
- [Recharts](https://recharts.org/)
- [Hono](https://hono.dev/)

---

## 📞 Kontakt

**Email:** support@lessscreen.app  
**Website:** https://lessscreen.app (coming soon)  
**Twitter:** @lessscreen_app (coming soon)

---

## 📊 Status

![GitHub last commit](https://img.shields.io/badge/last%20commit-today-brightgreen)
![Build Status](https://img.shields.io/badge/build-passing-brightgreen)
![Test Coverage](https://img.shields.io/badge/coverage-pending-yellow)

**Version:** 1.0.0 Beta  
**Letztes Update:** 21. Oktober 2025  
**Status:** 🟡 Beta Testing

---

**Viel Spaß beim Lesen! 📚✨**
