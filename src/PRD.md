# LessScreen - Product Requirements Document (PRD)

**Version:** 1.0.0  
**Letzte Aktualisierung:** 21. Oktober 2025  
**Projekt-Status:** Beta/Testphase  
**Design-System:** Vibrant Clarity

---

## 📋 Inhaltsverzeichnis

1. [Executive Summary](#executive-summary)
2. [Produktvision & Ziele](#produktvision--ziele)
3. [Zielgruppe](#zielgruppe)
4. [Feature-Übersicht](#feature-übersicht)
5. [User Flows](#user-flows)
6. [Design-System](#design-system)
7. [Technische Architektur](#technische-architektur)
8. [Datenmodell](#datenmodell)
9. [API-Spezifikation](#api-spezifikation)
10. [Sicherheit](#sicherheit)
11. [Frontend-Komponenten](#frontend-komponenten)
12. [Backend-Services](#backend-services)
13. [Testphase & Roadmap](#testphase--roadmap)
14. [Deployment](#deployment)

---

## 🎯 Executive Summary

**LessScreen** ist eine Mobile-First Web-App, die Eltern dabei unterstützt, die Lesezeit ihrer Kinder zu fördern und mit Bildschirmzeit zu belohnen. Die App implementiert ein motivierendes Gamification-System mit Rang-System, Zielen und Validierung des Leseverständnisses durch den "Lese-Kompass".

### Kernproblem

Kinder verbringen zu viel Zeit vor Bildschirmen und zu wenig Zeit mit Lesen. Eltern benötigen ein Tool, um Lesezeit zu tracken, zu motivieren und zu validieren.

### Lösung

Ein gamifiziertes System, das:

- Lesezeit 1:1 in Bildschirmzeit umwandelt (konfigurierbar)
- Leseverständnis durch Foto + Fragen validiert
- Motivation durch Rang-System und Ziele schafft
- Eltern volle Kontrolle und Transparenz gibt

---

## 🌟 Produktvision & Ziele

### Vision

"Kinder sollen Freude am Lesen entwickeln und Eltern die Tools erhalten, um Bildschirmzeit sinnvoll zu steuern."

### Hauptziele

#### Für Kinder:

- 📚 **Lesemotivation** durch Belohnungssystem (Bildschirmzeit)
- 🎮 **Gamification** mit Rang-System (9 Ränge von 🐛 bis 👑)
- 🎯 **Zielerreichung** mit visuellen Fortschrittsanzeigen
- ✨ **Spaß** durch kindgerechtes, farbenfrohes Design

#### Für Eltern:

- 👨‍👩‍👧 **Kontrolle** über Bildschirmzeit-Verhältnis
- 📊 **Transparenz** durch detaillierte Statistiken
- ✅ **Validierung** durch Lese-Kompass (Foto + Fragen)
- 🔧 **Flexibilität** durch eigene Aktivitäten definieren

### Success Metrics (KPIs)

- Durchschnittliche Lesezeit pro Kind: >30 Min/Tag
- Lese-Kompass Validierungsrate: >80%
- Eltern-Zufriedenheit: >4.5/5
- App-Retention nach 30 Tagen: >70%

---

## 👥 Zielgruppe

### Primäre Zielgruppe

#### 1. Eltern mit einem Kind (oneChild)

- **Alter des Kindes:** 6-14 Jahre
- **Tech-Affinität:** Mittel bis hoch
- **Bedürfnis:** Lesezeit fördern, Bildschirmzeit kontrollieren

#### 2. Eltern mit mehreren Kindern (multipleChildren)

- **Anzahl Kinder:** 2-6
- **Bedürfnis:** Mehrere Profile verwalten, individuelle Ziele

#### 3. Erwachsene Nutzer (adult)

- **Use Case:** Selbstmotivation zum Lesen
- **Bedürfnis:** Persönliche Leseziele tracken

### User Personas

**Persona 1: Sarah (35, 2 Kinder)**

- Problem: Kinder verbringen zu viel Zeit mit iPad/Switch
- Ziel: Lesezeit als Voraussetzung für Bildschirmzeit
- Tech-Komfort: Hoch

**Persona 2: Michael (42, 1 Kind)**

- Problem: Kind liest ungern, braucht Motivation
- Ziel: Gamification für Leseförderung
- Tech-Komfort: Mittel

---

## 🎨 Feature-Übersicht

### 1. ✅ Onboarding (Vollständig implementiert)

#### 1.1 Willkommensseite

- Begrüßung mit App-Logo und Slogan
- "Los geht's!" Button

#### 1.2 User Type Selection

- Auswahl: Ein Kind / Mehrere Kinder / Erwachsener
- Bestimmt den weiteren Onboarding-Flow

#### 1.3 Profil-Erstellung

- **Ein Kind / Erwachsener:** Einzelnes Profil mit Namen
- **Mehrere Kinder:** Mehrere Profile mit individuellen Namen
- Automatische Zuweisung des Start-Rangs (🐛 Bücherwürmchen)

#### 1.4 Tutorial (5 interaktive Slides)

1. **Leseverhältnis:** Visualisierung des 1:1 Verhältnisses
2. **Timer starten:** Interactive Demo
3. **Push-Benachrichtigungen:** Browser-Permission-Anfrage
4. **Lese-Kompass:** Foto + Fragen Workflow
5. **Ziele setzen:** Motivation & Goal-Setting

#### 1.5 Push-Benachrichtigungen Setup

- Browser-Permission-Anfrage
- Test-Benachrichtigung
- "Später aktivieren" Option

### 2. 📊 Dashboard (Vollständig implementiert)

#### 2.1 Header

- Profilwechsler (Dropdown bei mehreren Profilen)
- Aktueller Rang-Emoji
- Name des aktiven Profils

#### 2.2 Progress Donut Chart

- **Zentrum:** Verdiente Bildschirmzeit in Minuten
- **Äußerer Ring:** Fortschritt zum nächsten Ziel
- **Legende:**
  - Lesedauer (gesamt)
  - Hauptziel (wöchentlich/monatlich)
  - Nächster Rang (mit Minuten bis Erreichen)

#### 2.3 Quick Stats Cards

- Verdiente Bildschirmzeit heute
- Lesezeit diese Woche
- Nächster Rang mit Fortschrittsbalken

#### 2.4 Aktivitäten-Integration

- Toggle: "Andere Aktivitäten einbeziehen"
- Zeigt auch nicht-Lese-Aktivitäten im Chart

### 3. ⏱️ Reading Timer (Vollständig implementiert)

#### 3.1 Timer-Interface

- Start/Pause/Stop Funktionalität
- Echtzeit-Anzeige: MM:SS Format
- Visueller Fortschritt (Circular Progress)
- Emoji-Animation während des Lesens

#### 3.2 Timer-Funktionen

- Automatische Zeiterfassung
- Browser-Notification bei Abschluss
- Übergang zum Lese-Kompass nach Beendigung

#### 3.3 Session-Speicherung

- Lesezeit wird automatisch gespeichert
- Berechnung der verdienten Bildschirmzeit (Ratio)
- Update des Profils (Gesamtminuten, Rang)

### 4. 📸 Lese-Kompass (Vollständig implementiert)

#### 4.1 Foto-Upload

- Kamera-Zugriff oder Datei-Upload
- Foto einer Buchseite aufnehmen
- Preview vor dem Speichern

#### 4.2 Validierungs-Fragen

- 3-5 vordefinierte Fragen zum Leseverständnis:
  - "Worum ging es in dem Kapitel?"
  - "Wer war die Hauptfigur?"
  - "Was hast du Neues gelernt?"
- Freitexteingabe für Antworten
- Eltern können Antworten später einsehen

#### 4.3 Validation Speicherung

- Verknüpfung mit Reading Session
- Timestamp der Validierung
- Status: Session wird als "validiert" markiert

### 5. 🎯 Ziele-Verwaltung (Vollständig implementiert)

#### 5.1 Ziel-Erstellung

- **Titel:** Benutzerdefinierter Name
- **Emoji:** Visuelle Darstellung
- **Ziel-Minuten:** Numerischer Wert
- **Periode:** Täglich / Wöchentlich / Monatlich
- Speicherung im Backend

#### 5.2 Fortschritts-Tracking

- Automatische Berechnung: `currentMinutes / targetMinutes`
- Visueller Fortschrittsbalken
- Prozentanzeige
- Completion-Status

#### 5.3 Ziel-Verwaltung

- Ziele bearbeiten
- Ziele löschen
- Mehrere Ziele parallel

### 6. 📈 Aktivitäten-Management (Vollständig implementiert)

#### 6.1 Aktivitäten-Erstellung

- **Name:** z.B. "Hausaufgaben", "Sport"
- **Emoji:** Visuelle Darstellung
- **Ratio:** Umrechnungsfaktor zu Bildschirmzeit
  - Beispiel: Ratio 0.5 = 30 Min Aktivität → 15 Min Bildschirmzeit
- **Include in Reading:** Toggle für Chart-Anzeige

#### 6.2 Aktivitäten-Management

- Aktivitäten bearbeiten
- Aktivitäten löschen
- Liste aller Aktivitäten

### 7. ⚙️ Einstellungen (Vollständig implementiert)

#### 7.1 Profil bearbeiten

- Name ändern
- Emoji auswählen (aus vordefinierter Liste)
- Speicherung im Backend

#### 7.2 Lesezeit-Verhältnis

- **Standard:** 1:1 (1 Min Lesen = 1 Min Bildschirmzeit)
- Anpassbar: 0.5 - 2.0
- Slider-Interface

#### 7.3 Avatar-Auswahl

- Änderung des Profil-Emojis
- Rang-Emoji-Überschreibung (optional)

#### 7.4 Platzhalter-Seiten (Testphase)

- **Datenschutz:** Informationen zu DSGVO, Datenspeicherung
- **Support & FAQ:** Kontaktmöglichkeiten, häufige Fragen
- Werden nach Testphase vervollständigt

### 8. 🏆 Rang-System (Vollständig implementiert)

#### Rang-Stufen (9 Ränge)

| Rang | Emoji | Name           | Benötigte Minuten |
| ---- | ----- | -------------- | ----------------- |
| 1    | 🐛    | Bücherwürmchen | 0                 |
| 2    | 🐌    | Leseschnecke   | 60                |
| 3    | 🦗    | Lesefreund     | 180               |
| 4    | 🐝    | Lesebiene      | 360               |
| 5    | 🦋    | Buchfalter     | 600               |
| 6    | 🦅    | Leseadler      | 1200              |
| 7    | 🦉    | Büchereule     | 2400              |
| 8    | 🐉    | Lesedrache     | 4800              |
| 9    | 👑    | Lesekönig      | 9600              |

#### Rang-Berechnung

- Basierend auf `totalReadingMinutes`
- Automatische Aktualisierung nach jeder Session
- Anzeige im Dashboard-Header

### 9. 🔔 Push-Benachrichtigungen (Vollständig implementiert)

#### 9.1 Notification-System

- **Browser Notification API** für native Push-Benachrichtigungen
- **Permission Handling** mit User-freundlichem Request-Flow
- **Sound-Feedback** bei wichtigen Benachrichtigungen
- **Template-basierte Notifications** für konsistente Nachrichten

#### 9.2 Notification-Typen

##### Timer-Complete Notification

- **Trigger:** Reading Timer läuft ab
- **Titel:** "🎉 Lesezeit abgelaufen!"
- **Inhalt:** "{Profilname} hat {X} Minuten gelesen! Super gemacht!"
- **Verhalten:** requireInteraction = true (bleibt sichtbar)

##### Goal-Achieved Notification

- **Trigger:** Ziel wird erreicht
- **Titel:** "{Emoji} Ziel erreicht!"
- **Inhalt:** "Glückwunsch! Du hast '{Zielname}' erreicht!"
- **Verhalten:** requireInteraction = true

##### Milestone Notification

- **Trigger:** Besondere Erfolge (z.B. neuer Rang)
- **Titel:** "🏆 Meilenstein erreicht!"
- **Inhalt:** Spezifischer Meilenstein-Text
- **Verhalten:** requireInteraction = true

##### Reading Reminder (Zukünftig)

- **Trigger:** Zeitbasiert / Scheduled
- **Titel:** "📖 Zeit zum Lesen!"
- **Inhalt:** "{Profilname}, vergiss nicht zu lesen heute!"

#### 9.3 Notification Utility (`/utils/notifications.ts`)

- `isNotificationSupported()`: Browser-Kompatibilität prüfen
- `getNotificationPermission()`: Aktuellen Status abrufen
- `requestNotificationPermission()`: Permission anfragen
- `showNotification(options)`: Notification anzeigen
- `NotificationTemplates`: Vordefinierte Notification-Templates
- `playNotificationSound()`: Akustisches Feedback

#### 9.4 Onboarding Integration

- **Screen:** OnboardingNotifications.tsx
- **Flow:**
  1. Permission-Anfrage mit visueller Vorschau
  2. Test-Notification bei Aktivierung
  3. "Später aktivieren" Option verfügbar
- **Statusanzeige:** Granted / Denied / Default mit Icons

#### 9.5 Settings-Integration

- **Screen:** NotificationSettings.tsx (Einstellungen → Benachrichtigungen)
- **Features:**
  - Status-Übersicht mit visuellen Badges
  - Permission-Request Button
  - Test-Notification Button
  - Info-Cards: Wann werden Benachrichtigungen gesendet?
  - Privacy-Hinweis: Alle Notifications sind lokal
- **Browser-Hinweise:** Anleitung bei blockierten Benachrichtigungen

#### 9.6 Implementation Details

- **Timer Integration:** ReadingTimer.tsx nutzt `NotificationTemplates.timerComplete()`
- **Sound Playback:** Base64-encoded WAV für plattformübergreifende Kompatibilität
- **Permission-Persistence:** Browser speichert Permission-Status
- **Fallback:** Graceful degradation wenn nicht unterstützt

#### 9.7 Privacy & Security

- **Lokale Benachrichtigungen:** Keine Server-Kommunikation
- **Keine Datensammlung:** Notification-Status wird nicht getrackt
- **User-Control:** Jederzeit in Browser-Settings deaktivierbar
- **Transparenz:** Klare Info über Notification-Zwecke

---

## 🔄 User Flows

### Flow 1: Neuer Nutzer - Komplettes Onboarding

```
1. Landing → Willkommensseite
   ↓
2. "Los geht's!" klicken
   ↓
3. User Type auswählen (Ein Kind / Mehrere Kinder / Erwachsener)
   ↓
4a. [Ein Kind] → Namen eingeben → Tutorial
4b. [Mehrere Kinder] → Namen eingeben für alle Kinder → Tutorial
4c. [Erwachsener] → Namen eingeben → Tutorial
   ↓
5. Tutorial (5 Slides durchgehen oder überspringen)
   ↓
6. Push-Benachrichtigungen aktivieren (oder später)
   ↓
7. Dashboard angezeigt
```

### Flow 2: Lesezeit erfassen

```
1. Dashboard
   ↓
2. "Buch" Button in Bottom Nav klicken
   ↓
3. Reading Timer öffnet sich (Modal)
   ↓
4. "Start" drücken → Timer läuft
   ↓
5. [Optional] Pause / Fortsetzen
   ↓
6. "Fertig" drücken
   ↓
7. Push-Notification: "Lesezeit abgeschlossen!"
   ↓
8. Lese-Kompass öffnet sich automatisch
   ↓
9. Foto von Buchseite machen
   ↓
10. Validierungs-Fragen beantworten
   ↓
11. "Validieren" → Session gespeichert
   ↓
12. Zurück zum Dashboard
   ↓
13. Dashboard zeigt:
    - Aktualisierte Bildschirmzeit
    - Fortschritt zum Rang
    - Fortschritt zu Zielen
```

### Flow 3: Profil-Wechsel (Mehrere Kinder)

```
1. Dashboard
   ↓
2. Profil-Dropdown im Header klicken
   ↓
3. Liste aller Profile angezeigt
   ↓
4. Profil auswählen
   ↓
5. Dashboard lädt Daten des ausgewählten Profils
   ↓
6. Alle Features beziehen sich jetzt auf das aktive Profil
```

### Flow 4: Ziel erstellen

```
1. Dashboard
   ↓
2. Bottom Nav → "Einstellungen"
   ↓
3. "Ziele verwalten" klicken
   ↓
4. "Neues Ziel" Button
   ↓
5. Formular ausfüllen:
   - Titel (z.B. "Wöchentliches Leseziel")
   - Emoji auswählen (🎯)
   - Ziel-Minuten (z.B. 300)
   - Periode (Wöchentlich)
   ↓
6. "Ziel erstellen" → Backend speichert
   ↓
7. Zurück zu Zielliste
   ↓
8. Dashboard zeigt Ziel im Donut Chart
```

### Flow 5: Aktivität hinzufügen

```
1. Dashboard
   ↓
2. Bottom Nav → "Einstellungen"
   ↓
3. "Aktivitäten verwalten"
   ↓
4. "Neue Aktivität"
   ↓
5. Formular ausfüllen:
   - Name (z.B. "Hausaufgaben")
   - Emoji (📝)
   - Ratio (0.5 = halbe Bildschirmzeit)
   - "In Lesezeit einbeziehen" Toggle
   ↓
6. "Aktivität erstellen"
   ↓
7. Aktivität erscheint in Liste
   ↓
8. Kann separat oder kombiniert mit Lesezeit getrackt werden
```

---

## 🎨 Design-System

### Vibrant Clarity Theme

#### Farbpalette

```css
/* Primärfarben */
--primary: #8b5cf6 /* Lila - Hauptfarbe */ --secondary: #a78bfa
  /* Helles Lila - Akzente */ --accent: #f472b6
  /* Pink - Highlights */ /* Hintergrundfarben */
  --background: #f5f3ff /* Helles Lavendel */ --card: #ffffff
  /* Weiß für Cards */ /* Textfarben */ --foreground: #1f2937
  /* Dunkelgrau - Haupttext */ --muted-foreground: #6b7280
  /* Grau - Sekundärtext */ /* Funktionale Farben */
  --destructive: #ef4444 /* Rot - Fehler/Löschen */
  --chart-1: #ef4444 /* Chart Rot */ --chart-2: #f472b6
  /* Chart Pink */ --chart-3: #8b5cf6 /* Chart Lila */
  --chart-4: #14b8a6 /* Chart Türkis */;
```

#### Claymorphismus-Stil

**Charakteristika:**

- Weiche, abgerundete Ecken (`border-radius: 16px-32px`)
- Sanfte Schatten (`box-shadow: 0 10px 40px rgba(139,92,246,0.15)`)
- Subtile Farbverläufe (`gradient-to-br`)
- Emojis statt Icons (wo möglich)
- Glassmorphismus-Effekte (backdrop-blur)

**Beispiel Card:**

```css
.clay-card {
  background: white;
  border-radius: 28px;
  padding: 24px;
  box-shadow: 0 10px 40px rgba(139, 92, 246, 0.15);
  border: 1px solid rgba(139, 92, 246, 0.1);
}
```

#### Typografie

**Schriftart:** Poppins (Primary), Inter (Fallback)

**Hierarchie:**

- H1: 24px, 600 weight
- H2: 20px, 600 weight
- H3: 18px, 600 weight
- H4: 16px, 600 weight
- Body: 16px, 400 weight
- Small: 14px, 400 weight

#### Spacing System

```
--spacing-xs: 4px
--spacing-sm: 8px
--spacing-md: 16px
--spacing-lg: 24px
--spacing-xl: 32px
--spacing-2xl: 48px
```

#### Mobile-First Breakpoints

```css
/* Default: Mobile (0-639px) */
/* sm: 640px+ */
/* md: 768px+ */
/* lg: 1024px+ */
/* xl: 1280px+ */
```

### Animations

**Motion Framework:** Framer Motion (motion/react)

**Standard Transitions:**

```typescript
// Spring Animation (Buttons, Cards)
transition={{ type: 'spring', stiffness: 300, damping: 30 }}

// Fade In
initial={{ opacity: 0, y: 20 }}
animate={{ opacity: 1, y: 0 }}

// Scale on Hover
whileHover={{ scale: 1.05 }}
whileTap={{ scale: 0.95 }}
```

---

## 🏗️ Technische Architektur

### Technologie-Stack

#### Frontend

- **Framework:** React 18+ (TypeScript)
- **Styling:** Tailwind CSS v4.0
- **Animations:** Framer Motion (motion/react)
- **Icons:** Emojis (primär) + Lucide React (sekundär)
- **Charts:** Recharts
- **Forms:** React Hook Form 7.55.0
- **Toast Notifications:** Sonner 2.0.3
- **UI Components:** Shadcn/ui

#### Backend

- **Runtime:** Deno (Supabase Edge Functions)
- **Framework:** Hono (Web Server)
- **Database:** Supabase KV Store
- **Storage:** Supabase Storage (für Fotos)

#### Infrastructure

- **Hosting:** Supabase
- **CDN:** Supabase CDN
- **Environment:** Serverless Edge Functions

### Architektur-Diagramm

```
┌─────────────────────────────────────────┐
│          Frontend (React)               │
│  ┌─────────────────────────────────┐   │
│  │  Components (TSX)               │   │
│  │  - Dashboard                    │   │
│  │  - ReadingTimer                 │   │
│  │  - ReadingCompass               │   │
│  │  - Settings                     │   │
│  │  - ...                          │   │
│  └────────────┬────────────────────┘   │
│               │                         │
│  ┌────────────▼────────────────────┐   │
│  │  API Client (/utils/api-client) │   │
│  │  - userAPI                      │   │
│  │  - profileAPI                   │   │
│  │  - sessionAPI                   │   │
│  │  - activityAPI                  │   │
│  │  - goalAPI                      │   │
│  │  - compassAPI                   │   │
│  │  - settingsAPI                  │   │
│  │  - statsAPI                     │   │
│  └────────────┬────────────────────┘   │
└───────────────┼─────────────────────────┘
                │ HTTPS (Authorization: Bearer)
                │
┌───────────────▼─────────────────────────┐
│     Supabase Edge Functions             │
│  ┌─────────────────────────────────┐   │
│  │  Hono Web Server                │   │
│  │  /make-server-e4c1b088/         │   │
│  │  ┌───────────────────────────┐  │   │
│  │  │  Routes:                  │  │   │
│  │  │  - POST /user             │  │   │
│  │  │  - POST /profile          │  │   │
│  │  │  - POST /session          │  │   │
│  │  │  - POST /activity         │  │   │
│  │  │  - POST /goal             │  │   │
│  │  │  - POST /compass          │  │   │
│  │  │  - GET /stats/:profileId  │  │   │
│  │  │  - ...                    │  │   │
│  │  └───────────────────────────┘  │   │
│  └────────────┬────────────────────┘   │
└───────────────┼─────────────────────────┘
                │
┌───────────────▼─────────────────────────┐
│      Supabase KV Store                  │
│  ┌─────────────────────────────────┐   │
│  │  Key-Value Pairs:               │   │
│  │  - user:{userId}                │   │
│  │  - profile:{profileId}          │   │
│  │  - session:{sessionId}          │   │
│  │  - activity:{activityId}        │   │
│  │  - goal:{goalId}                │   │
│  │  - settings:{profileId}         │   │
│  │  - ...                          │   │
│  └─────────────────────────────────┘   │
└─────────────────────────────────────────┘
```

### Datenaustausch-Flow

#### Beispiel: Reading Session erstellen

```
1. Frontend: User startet Timer
   → State: { startTime: Date.now() }

2. Frontend: User stoppt Timer
   → Berechne duration = (Date.now() - startTime) / 60000

3. Frontend: sessionAPI.create({ profileId, duration, note })
   ↓
4. API Client: POST https://{projectId}.supabase.co/functions/v1/make-server-e4c1b088/session
   Header: Authorization: Bearer {publicAnonKey}
   Body: { profileId, duration, startedAt, note }
   ↓
5. Backend: Server empfängt Request
   → Validiert Input
   → Generiert sessionId
   → Erstellt Session-Objekt
   → Speichert in KV: session:{sessionId}
   → Updated Profile: totalReadingMinutes, currentRank
   → Adds sessionId to sessions:{profileId}
   ↓
6. Backend: Response → { session: {...} }
   ↓
7. Frontend: sessionAPI returns session
   → Updates State
   → Öffnet ReadingCompass
   → Shows Success Toast
```

---

## 📊 Datenmodell

### Entity Relationship

```
User (1) ──────── (*) Profile
                       │
                       ├── (*) ReadingSession
                       │         │
                       │         └── (1) CompassValidation
                       │
                       ├── (*) Activity
                       │
                       ├── (*) Goal
                       │
                       └── (1) ProfileSettings
```

### Datenbank-Schema (KV Store Keys)

#### 1. User Entity

**Key:** `user:{userId}`

```typescript
interface User {
  id: string; // user_1697891234567_abc123
  createdAt: string; // ISO 8601 timestamp
  userType: "oneChild" | "multipleChildren" | "adult";
}
```

**Zusätzlicher Key:** `profiles:{userId}`

```typescript
string[]  // Array of profileIds: ["profile_...", "profile_..."]
```

#### 2. Profile Entity

**Key:** `profile:{profileId}`

```typescript
interface Profile {
  id: string; // profile_1697891234567_xyz789
  userId: string; // Referenz zu User
  name: string; // "Emma", "Max", etc.
  emoji?: string; // "🐛" (Rang-Emoji)
  avatar?: string; // Optional: Custom Avatar URL
  currentRank: string; // "🐛", "🐌", ..., "👑"
  totalReadingMinutes: number; // Gesamt-Lesezeit in Minuten
  totalScreenMinutes: number; // Gesamt-Bildschirmzeit (verdient)
  createdAt: string; // ISO 8601
  updatedAt: string; // ISO 8601
}
```

#### 3. ReadingSession Entity

**Key:** `session:{sessionId}`

```typescript
interface ReadingSession {
  id: string; // session_1697891234567_def456
  profileId: string; // Referenz zu Profile
  duration: number; // Lesedauer in Minuten
  startedAt: string; // ISO 8601
  completedAt: string; // ISO 8601
  note?: string; // Optional: Notiz vom Kind
  compassValidated: boolean; // Wurde durch Lese-Kompass validiert?
}
```

**Zusätzlicher Key:** `sessions:{profileId}`

```typescript
string[]  // Array of sessionIds
```

#### 4. Activity Entity

**Key:** `activity:{activityId}`

```typescript
interface Activity {
  id: string; // activity_1697891234567_ghi789
  profileId: string; // Referenz zu Profile
  name: string; // "Hausaufgaben", "Sport", etc.
  emoji: string; // "📝", "⚽", etc.
  ratio: number; // Umrechnungsfaktor (0.5 - 2.0)
  includeInReading: boolean; // Im Chart anzeigen?
  createdAt: string; // ISO 8601
}
```

**Zusätzlicher Key:** `activities:{profileId}`

```typescript
string[]  // Array of activityIds
```

#### 5. Goal Entity

**Key:** `goal:{goalId}`

```typescript
interface Goal {
  id: string; // goal_1697891234567_jkl012
  profileId: string; // Referenz zu Profile
  title: string; // "Wöchentliches Leseziel"
  emoji: string; // "🎯"
  targetMinutes: number; // Ziel-Minuten (z.B. 300)
  currentMinutes: number; // Aktueller Fortschritt
  period: "daily" | "weekly" | "monthly";
  createdAt: string; // ISO 8601
  completed: boolean; // Ziel erreicht?
}
```

**Zusätzlicher Key:** `goals:{profileId}`

```typescript
string[]  // Array of goalIds
```

#### 6. CompassValidation Entity

**Key:** `compass:{compassId}`

```typescript
interface CompassValidation {
  id: string; // compass_1697891234567_mno345
  profileId: string; // Referenz zu Profile
  sessionId: string; // Referenz zu ReadingSession
  photoUrl?: string; // URL zum Foto (Supabase Storage)
  questions: Array<{
    question: string; // "Worum ging es?"
    answer: string; // Antwort des Kindes
  }>;
  validatedAt: string; // ISO 8601
}
```

**Zusätzlicher Key:** `compass:{profileId}`

```typescript
string[]  // Array of compassIds
```

#### 7. ProfileSettings Entity

**Key:** `settings:{profileId}`

```typescript
interface ProfileSettings {
  profileId: string; // Referenz zu Profile
  readingRatio: number; // 0.5 - 2.0 (Default: 1.0)
  notificationsEnabled: boolean; // Push-Benachrichtigungen
  theme: "light" | "dark"; // Theme (aktuell nur light)
}
```

#### 8. ProfileStats (Computed)

**Endpoint:** `GET /stats/:profileId` (nicht gespeichert, berechnet on-the-fly)

```typescript
interface ProfileStats {
  profileId: string;
  totalReadingMinutes: number; // Aus Profile
  totalScreenMinutes: number; // Aus Profile
  currentStreak: number; // TODO: Tage in Folge gelesen
  longestStreak: number; // TODO: Längste Serie
  sessionsCompleted: number; // Anzahl Sessions
  compassValidations: number; // Anzahl Validierungen
  currentRank: string; // Aktueller Rang
  nextRank: string; // Nächster Rang
  minutesToNextRank: number; // Minuten bis nächster Rang
}
```

### Daten-Constraints & Validierung

#### Backend Validation Rules

```typescript
// User
userType: ["oneChild", "multipleChildren", "adult"]

// Profile
name: string, 1-30 Zeichen, required
totalReadingMinutes: number >= 0
totalScreenMinutes: number >= 0

// ReadingSession
duration: number > 0, required
profileId: string, required, exists in KV

// Activity
name: string, 1-50 Zeichen, required
ratio: number, 0.5 - 2.0, required
includeInReading: boolean, default: false

// Goal
title: string, 1-50 Zeichen, required
targetMinutes: number > 0, required
period: ["daily", "weekly", "monthly"]

// CompassValidation
questions: Array, min 1 question, required
sessionId: string, required, exists in KV

// Settings
readingRatio: number, 0.5 - 2.0, default: 1.0
notificationsEnabled: boolean, default: false
```

---

## 🔌 API-Spezifikation

### Base URL

```
https://{projectId}.supabase.co/functions/v1/make-server-e4c1b088
```

### Authentication

Alle Requests benötigen einen Authorization Header:

```
Authorization: Bearer {publicAnonKey}
```

**publicAnonKey** wird aus `/utils/supabase/info.tsx` importiert.

---

### API Endpoints

#### 1. User Management

##### POST /user

Erstellt einen neuen User Account.

**Request:**

```json
{
  "userType": "oneChild" | "multipleChildren" | "adult"
}
```

**Response (201):**

```json
{
  "user": {
    "id": "user_1697891234567_abc123",
    "createdAt": "2025-10-21T10:30:00.000Z",
    "userType": "oneChild"
  }
}
```

**Errors:**

- 400: Invalid userType
- 500: Server error

##### GET /user/:id

Ruft User-Daten ab.

**Response (200):**

```json
{
  "user": {
    "id": "user_1697891234567_abc123",
    "createdAt": "2025-10-21T10:30:00.000Z",
    "userType": "multipleChildren"
  }
}
```

**Errors:**

- 404: User not found
- 500: Server error

---

#### 2. Profile Management

##### POST /profile

Erstellt ein neues Profil.

**Request:**

```json
{
  "userId": "user_1697891234567_abc123",
  "name": "Emma",
  "emoji": "🐛",
  "avatar": null
}
```

**Response (201):**

```json
{
  "profile": {
    "id": "profile_1697891234567_xyz789",
    "userId": "user_1697891234567_abc123",
    "name": "Emma",
    "emoji": "🐛",
    "avatar": null,
    "currentRank": "🐛",
    "totalReadingMinutes": 0,
    "totalScreenMinutes": 0,
    "createdAt": "2025-10-21T10:31:00.000Z",
    "updatedAt": "2025-10-21T10:31:00.000Z"
  }
}
```

**Errors:**

- 400: Missing userId or name
- 500: Server error

##### GET /profiles/:userId

Ruft alle Profile eines Users ab.

**Response (200):**

```json
{
  "profiles": [
    {
      "id": "profile_1697891234567_xyz789",
      "name": "Emma",
      "emoji": "🐛",
      "currentRank": "🐛",
      "totalReadingMinutes": 120,
      ...
    },
    {
      "id": "profile_1697891234568_xyz790",
      "name": "Max",
      "emoji": "🐌",
      "currentRank": "🐌",
      "totalReadingMinutes": 75,
      ...
    }
  ]
}
```

##### GET /profile/:id

Ruft ein einzelnes Profil ab.

**Response (200):**

```json
{
  "profile": {
    "id": "profile_1697891234567_xyz789",
    "userId": "user_1697891234567_abc123",
    "name": "Emma",
    ...
  }
}
```

**Errors:**

- 404: Profile not found

##### PUT /profile/:id

Aktualisiert ein Profil.

**Request:**

```json
{
  "name": "Emma Sophie",
  "emoji": "🦋"
}
```

**Response (200):**

```json
{
  "profile": {
    "id": "profile_1697891234567_xyz789",
    "name": "Emma Sophie",
    "emoji": "🦋",
    "updatedAt": "2025-10-21T11:00:00.000Z",
    ...
  }
}
```

**Errors:**

- 404: Profile not found

---

#### 3. Reading Session Management

##### POST /session

Erstellt eine neue Reading Session.

**Request:**

```json
{
  "profileId": "profile_1697891234567_xyz789",
  "duration": 30,
  "startedAt": "2025-10-21T10:00:00.000Z",
  "note": "Harry Potter gelesen"
}
```

**Response (201):**

```json
{
  "session": {
    "id": "session_1697891234567_def456",
    "profileId": "profile_1697891234567_xyz789",
    "duration": 30,
    "startedAt": "2025-10-21T10:00:00.000Z",
    "completedAt": "2025-10-21T10:30:00.000Z",
    "note": "Harry Potter gelesen",
    "compassValidated": false
  }
}
```

**Side Effects:**

- Profile `totalReadingMinutes` += duration
- Profile `totalScreenMinutes` += (duration \* readingRatio)
- Profile `currentRank` recalculated

**Errors:**

- 400: Missing profileId or duration
- 500: Server error

##### GET /sessions/:profileId

Ruft alle Sessions eines Profils ab (sortiert nach Datum, neueste zuerst).

**Response (200):**

```json
{
  "sessions": [
    {
      "id": "session_1697891234567_def456",
      "profileId": "profile_1697891234567_xyz789",
      "duration": 30,
      "completedAt": "2025-10-21T10:30:00.000Z",
      "compassValidated": true,
      ...
    },
    ...
  ]
}
```

---

#### 4. Activity Management

##### POST /activity

Erstellt eine neue Aktivität.

**Request:**

```json
{
  "profileId": "profile_1697891234567_xyz789",
  "name": "Hausaufgaben",
  "emoji": "📝",
  "ratio": 0.5,
  "includeInReading": false
}
```

**Response (201):**

```json
{
  "activity": {
    "id": "activity_1697891234567_ghi789",
    "profileId": "profile_1697891234567_xyz789",
    "name": "Hausaufgaben",
    "emoji": "📝",
    "ratio": 0.5,
    "includeInReading": false,
    "createdAt": "2025-10-21T11:00:00.000Z"
  }
}
```

##### GET /activities/:profileId

Ruft alle Aktivitäten eines Profils ab.

**Response (200):**

```json
{
  "activities": [
    {
      "id": "activity_1697891234567_ghi789",
      "name": "Hausaufgaben",
      "emoji": "📝",
      "ratio": 0.5,
      ...
    },
    ...
  ]
}
```

##### PUT /activity/:id

Aktualisiert eine Aktivität.

**Request:**

```json
{
  "ratio": 0.75,
  "includeInReading": true
}
```

**Response (200):**

```json
{
  "activity": {
    "id": "activity_1697891234567_ghi789",
    "ratio": 0.75,
    "includeInReading": true,
    ...
  }
}
```

##### DELETE /activity/:id

Löscht eine Aktivität.

**Response (200):**

```json
{
  "success": true
}
```

**Errors:**

- 404: Activity not found

---

#### 5. Goal Management

##### POST /goal

Erstellt ein neues Ziel.

**Request:**

```json
{
  "profileId": "profile_1697891234567_xyz789",
  "title": "Wöchentliches Leseziel",
  "emoji": "🎯",
  "targetMinutes": 300,
  "period": "weekly"
}
```

**Response (201):**

```json
{
  "goal": {
    "id": "goal_1697891234567_jkl012",
    "profileId": "profile_1697891234567_xyz789",
    "title": "Wöchentliches Leseziel",
    "emoji": "🎯",
    "targetMinutes": 300,
    "currentMinutes": 0,
    "period": "weekly",
    "createdAt": "2025-10-21T11:00:00.000Z",
    "completed": false
  }
}
```

##### GET /goals/:profileId

Ruft alle Ziele eines Profils ab.

**Response (200):**

```json
{
  "goals": [
    {
      "id": "goal_1697891234567_jkl012",
      "title": "Wöchentliches Leseziel",
      "targetMinutes": 300,
      "currentMinutes": 120,
      "completed": false,
      ...
    },
    ...
  ]
}
```

##### PUT /goal/:id

Aktualisiert ein Ziel (z.B. Fortschritt).

**Request:**

```json
{
  "currentMinutes": 150,
  "completed": false
}
```

**Response (200):**

```json
{
  "goal": {
    "id": "goal_1697891234567_jkl012",
    "currentMinutes": 150,
    "completed": false,
    ...
  }
}
```

##### DELETE /goal/:id

Löscht ein Ziel.

**Response (200):**

```json
{
  "success": true
}
```

---

#### 6. Reading Compass

##### POST /compass

Speichert eine Lese-Kompass Validierung.

**Request:**

```json
{
  "profileId": "profile_1697891234567_xyz789",
  "sessionId": "session_1697891234567_def456",
  "photoUrl": "https://storage.supabase.co/...",
  "questions": [
    {
      "question": "Worum ging es in dem Kapitel?",
      "answer": "Harry hat seinen ersten Zauberstab bekommen"
    },
    {
      "question": "Wer war die Hauptfigur?",
      "answer": "Harry Potter"
    }
  ]
}
```

**Response (201):**

```json
{
  "validation": {
    "id": "compass_1697891234567_mno345",
    "profileId": "profile_1697891234567_xyz789",
    "sessionId": "session_1697891234567_def456",
    "photoUrl": "https://storage.supabase.co/...",
    "questions": [...],
    "validatedAt": "2025-10-21T10:35:00.000Z"
  }
}
```

**Side Effects:**

- Session `compassValidated` = true

##### GET /compass/:profileId

Ruft alle Validierungen eines Profils ab.

**Response (200):**

```json
{
  "validations": [
    {
      "id": "compass_1697891234567_mno345",
      "sessionId": "session_1697891234567_def456",
      "questions": [...],
      "validatedAt": "2025-10-21T10:35:00.000Z",
      ...
    },
    ...
  ]
}
```

---

#### 7. Settings

##### GET /settings/:profileId

Ruft Settings eines Profils ab.

**Response (200):**

```json
{
  "settings": {
    "profileId": "profile_1697891234567_xyz789",
    "readingRatio": 1.0,
    "notificationsEnabled": true,
    "theme": "light"
  }
}
```

##### PUT /settings/:profileId

Aktualisiert Settings.

**Request:**

```json
{
  "readingRatio": 1.5,
  "notificationsEnabled": true
}
```

**Response (200):**

```json
{
  "settings": {
    "profileId": "profile_1697891234567_xyz789",
    "readingRatio": 1.5,
    "notificationsEnabled": true,
    "theme": "light"
  }
}
```

---

#### 8. Statistics

##### GET /stats/:profileId

Berechnet und liefert Statistiken für ein Profil.

**Response (200):**

```json
{
  "stats": {
    "profileId": "profile_1697891234567_xyz789",
    "totalReadingMinutes": 450,
    "totalScreenMinutes": 450,
    "currentStreak": 7,
    "longestStreak": 14,
    "sessionsCompleted": 25,
    "compassValidations": 22,
    "currentRank": "🦋",
    "nextRank": "🦅",
    "minutesToNextRank": 150
  }
}
```

---

#### 9. Health Check

##### GET /health

Health Check Endpoint.

**Response (200):**

```json
{
  "status": "ok",
  "timestamp": "2025-10-21T12:00:00.000Z"
}
```

---

## 🔐 Sicherheit

### Security Best Practices

#### 1. ✅ Keine API Keys im Frontend

- **Problem:** API Keys im Frontend-Code sind öffentlich sichtbar
- **Lösung:** Alle sensiblen Operations im Backend (Supabase Edge Functions)
- **Implementation:**
  - `publicAnonKey` ist öffentlich und sicher für Client-Side
  - `SUPABASE_SERVICE_ROLE_KEY` nur im Backend (Deno.env)

#### 2. ✅ Input Validation

- **Backend:** Alle Inputs werden validiert vor DB-Speicherung
- **Beispiel:**
  ```typescript
  if (!userId || !name) {
    return c.json(
      { error: "userId and name are required" },
      400,
    );
  }
  ```

#### 3. ✅ CORS Configuration

- **Konfiguration:** CORS Headers für alle Routes
- **Allowed Origins:** `*` (kann später auf spezifische Domains eingeschränkt werden)
- **Allowed Methods:** GET, POST, PUT, DELETE, OPTIONS
- **Allowed Headers:** Content-Type, Authorization

#### 4. ✅ Error Handling

- **Best Practice:** Detaillierte Errors nur im Backend-Log
- **Frontend:** Generische Error-Messages
- **Beispiel:**
  ```typescript
  try {
    // Operation
  } catch (error) {
    console.error("Detailed error context:", error);
    return c.json(
      { error: "Generic user-facing message" },
      500,
    );
  }
  ```

#### 5. ✅ Data Sanitization

- **XSS Prevention:** Alle User-Inputs werden escaped
- **SQL Injection:** Nicht relevant (KV Store, kein SQL)
- **Validation:** Max-Length für Strings, Range für Numbers

#### 6. ⚠️ TODO: Rate Limiting

- **Status:** Nicht implementiert (Testphase)
- **Roadmap:** Rate Limiting pro IP/User nach Beta
- **Empfehlung:** Supabase Built-in Rate Limiting aktivieren

#### 7. ⚠️ TODO: Authentication

- **Status:** Aktuell keine User-Authentication
- **Roadmap:** Supabase Auth nach Testphase
- **Plan:**
  ```typescript
  // Zukünftig:
  const accessToken = request.headers
    .get("Authorization")
    ?.split(" ")[1];
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser(accessToken);
  if (!user) return c.json({ error: "Unauthorized" }, 401);
  ```

#### 8. ✅ HTTPS Only

- **Enforcement:** Alle API-Calls über HTTPS
- **Supabase:** Erzwingt HTTPS automatisch

#### 9. ✅ Environment Variables

- **Secrets:** Alle sensiblen Daten in Environment Variables
- **Access:**
  ```typescript
  Deno.env.get("SUPABASE_URL");
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  ```

#### 10. ✅ Logging

- **Implementation:** Console.log für alle wichtigen Operations
- **Format:** `console.log('Context: Detail', data)`
- **Purpose:** Debugging & Monitoring

### Datenschutz (DSGVO)

#### Gespeicherte personenbezogene Daten

- **Profil:** Name (optional Pseudonym)
- **Session-Notizen:** Freitext vom Kind
- **Compass-Antworten:** Freitext-Antworten
- **Fotos:** Buchseiten-Fotos (optional)

#### Datenspeicherung

- **Location:** Supabase (EU-Server recommended)
- **Retention:** Unbegrenzt (bis User löscht Profil)
- **Encryption:** At rest (Supabase Standard)

#### User Rights (TODO nach Testphase)

- **Recht auf Auskunft:** API Endpoint für Datenexport
- **Recht auf Löschung:** Delete User + Cascade
- **Recht auf Berichtigung:** Update Endpoints existieren

#### Privacy Policy Placeholder

- **Status:** Platzhalter-Seite implementiert
- **TODO:** Vollständige Privacy Policy nach Testphase

---

## 🧩 Frontend-Komponenten

### Komponenten-Struktur

```
/components
├── OnboardingStart.tsx           # Willkommensseite
├── OnboardingUserType.tsx        # User Type Auswahl
├── OnboardingProfile.tsx         # Profil-Erstellung (1 Kind/Erwachsener)
├── OnboardingChildren.tsx        # Mehrere Kinder erstellen
├── OnboardingTutorial.tsx        # 5-Slide Tutorial
├── OnboardingNotifications.tsx   # Push-Permission
├── Dashboard.tsx                 # Haupt-Dashboard
├── ProfileSwitcher.tsx           # Profil-Dropdown
├── ReadingTimer.tsx              # Timer Modal
├── ReadingCompass.tsx            # Validation Modal
├── Settings.tsx                  # Settings Main
├── ProfileEdit.tsx               # Profil bearbeiten
├── ReadingRatioSettings.tsx      # Ratio Slider
├── ActivityManagement.tsx        # Aktivitäten CRUD
├── GoalManagement.tsx            # Ziele CRUD
├── AvatarSelection.tsx           # Emoji-Auswahl
├── PrivacyPlaceholder.tsx        # Datenschutz Placeholder
├── SupportPlaceholder.tsx        # Support Placeholder
├── LiquidNavBar.tsx              # Bottom Tab Bar
├── SessionModal.tsx              # (Deprecated: Legacy)
└── /ui                           # Shadcn Components
    ├── button.tsx
    ├── card.tsx
    ├── input.tsx
    ├── ...
```

### Component API Patterns

#### Standard Component Props Pattern

```typescript
interface ComponentProps {
  // Data Props
  data?: DataType;

  // Callback Props
  onAction: (param: Type) => void;
  onBack?: () => void;

  // State Props
  isOpen?: boolean;
  isLoading?: boolean;
}
```

#### Example: ReadingTimer

```typescript
interface ReadingTimerProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (duration: number) => void;
  profileName: string;
}

export function ReadingTimer({
  isOpen,
  onClose,
  onComplete,
  profileName,
}: ReadingTimerProps) {
  // Component logic
}
```

### State Management

#### App-Level State (App.tsx)

```typescript
// Onboarding State
const [onboardingStep, setOnboardingStep] =
  useState<OnboardingStep>("start");
const [userType, setUserType] = useState<UserType | null>(null);

// App State
const [profiles, setProfiles] = useState<Profile[]>([]);
const [currentProfile, setCurrentProfile] =
  useState<Profile | null>(null);
const [activeTab, setActiveTab] = useState<AppTab>("dashboard");

// Feature State
const [activities, setActivities] = useState<Activity[]>([]);
const [goals, setGoals] = useState<Goal[]>([]);

// Modal State
const [isReadingTimerOpen, setIsReadingTimerOpen] =
  useState(false);
const [isReadingCompassOpen, setIsReadingCompassOpen] =
  useState(false);
```

**Rationale:** Simple useState für Prototyp-Phase. Für Production könnte Zustand, Context API oder Zustand erwogen werden.

#### Component-Level State

```typescript
// Local UI State
const [isLoading, setIsLoading] = useState(false);
const [error, setError] = useState<string | null>(null);

// Form State
const [name, setName] = useState("");
const [emoji, setEmoji] = useState("🐛");
```

### Component Lifecycle Pattern

```typescript
export function Component() {
  // 1. Hooks
  const [state, setState] = useState(initial);

  // 2. Effects
  useEffect(() => {
    // Fetch data on mount
    loadData();
  }, []);

  // 3. Handlers
  const handleAction = async () => {
    setIsLoading(true);
    try {
      await apiCall();
      // Success
    } catch (error) {
      // Error handling
    } finally {
      setIsLoading(false);
    }
  };

  // 4. Render
  return (
    <div>...</div>
  );
}
```

---

## ⚙️ Backend-Services

### Server Structure

```
/supabase/functions/server/
├── index.tsx       # Main Server (Hono App)
└── kv_store.tsx    # KV Store Utilities (Protected)
```

### Hono Server Setup

```typescript
import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";

const app = new Hono();

// Middleware
app.use("*", logger(console.log));
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  }),
);

// Routes
app.post("/make-server-e4c1b088/user", async (c) => {
  // Handler logic
});

// Start Server
Deno.serve(app.fetch);
```

### KV Store Operations

**Verfügbare Funktionen:**

```typescript
import * as kv from "./kv_store.tsx";

// Single Operations
await kv.get<T>(key: string): Promise<T | null>
await kv.set(key: string, value: any): Promise<void>
await kv.del(key: string): Promise<void>

// Multiple Operations
await kv.mget<T>(keys: string[]): Promise<T[]>
await kv.mset(entries: Array<[string, any]>): Promise<void>
await kv.mdel(keys: string[]): Promise<void>

// Prefix Search
await kv.getByPrefix<T>(prefix: string): Promise<T[]>
```

**Beispiel-Usage:**

```typescript
// Set
await kv.set(`profile:${profileId}`, profileData);

// Get
const profile = await kv.get<Profile>(`profile:${profileId}`);

// Get Multiple
const profileIds = await kv.get<string[]>(`profiles:${userId}`);
const profiles = [];
for (const id of profileIds) {
  const profile = await kv.get<Profile>(`profile:${id}`);
  if (profile) profiles.push(profile);
}

// Delete
await kv.del(`activity:${activityId}`);
```

### Error Handling Pattern

```typescript
app.post("/make-server-e4c1b088/resource", async (c) => {
  try {
    // 1. Parse Body
    const body = await c.req.json();

    // 2. Validate Input
    if (!body.requiredField) {
      return c.json(
        { error: "requiredField is required" },
        400,
      );
    }

    // 3. Business Logic
    const result = await performOperation(body);

    // 4. Success Response
    console.log(`Resource created: ${result.id}`);
    return c.json({ resource: result }, 201);
  } catch (error) {
    // 5. Error Logging & Response
    console.error("Error creating resource:", error);
    return c.json({ error: "Failed to create resource" }, 500);
  }
});
```

### Utility Functions

#### ID Generation

```typescript
function generateId(prefix: string): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

// Usage
const userId = generateId("user");
// → "user_1697891234567_abc123"
```

#### Rank Calculation

```typescript
function calculateRank(totalMinutes: number): {
  current: string;
  next: string;
  minutesToNext: number;
} {
  const ranks = [
    { emoji: "🐛", name: "Bücherwürmchen", minutes: 0 },
    { emoji: "🐌", name: "Leseschnecke", minutes: 60 },
    // ... 7 more ranks
    { emoji: "👑", name: "Lesekönig", minutes: 9600 },
  ];

  // Find current and next rank
  let currentRank = ranks[0];
  let nextRank = ranks[1];

  for (let i = 0; i < ranks.length; i++) {
    if (totalMinutes >= ranks[i].minutes) {
      currentRank = ranks[i];
      nextRank = ranks[i + 1] || ranks[i];
    }
  }

  return {
    current: currentRank.emoji,
    next: nextRank.emoji,
    minutesToNext: Math.max(0, nextRank.minutes - totalMinutes),
  };
}
```

---

## 🧪 Testphase & Roadmap

### Aktuelle Phase: Beta Testing

**Status:** Alle Features implementiert, in Testphase

**Ziele:**

1. ✅ Feature-Vollständigkeit validieren
2. ✅ UI/UX Feedback sammeln
3. ⏳ Performance-Tests durchführen
4. ⏳ Bug-Reports sammeln
5. ⏳ User-Feedback einholen

### Bekannte Limitierungen (Testphase)

1. **Keine User-Authentication**
   - Aktuell: Keine Login-Funktion
   - Roadmap: Supabase Auth in v2.0

2. **Placeholder-Seiten**
   - Datenschutz: Nur Preview
   - Support: Nur Preview
   - Roadmap: Vollständiger Content vor Launch

3. **Streak-Berechnung**
   - Aktuell: currentStreak / longestStreak = 0 (TODO)
   - Roadmap: Implementierung basierend auf Session-Daten

4. **Notifications**
   - Aktuell: Browser-Notifications (limitiert)
   - Roadmap: Service Worker für bessere Notification-Experience

5. **Offline-Funktionalität**
   - Aktuell: Keine Offline-Support
   - Roadmap: PWA mit Service Worker & IndexedDB

### Roadmap

#### Version 1.1 (Nach Beta)

- [ ] Vollständige Privacy Policy
- [ ] Vollständiges Support-Center
- [ ] Streak-Berechnung implementieren
- [ ] Performance-Optimierungen
- [ ] Bug Fixes aus Beta-Testing

#### Version 2.0 (Production Launch)

- [ ] Supabase Auth Integration
- [ ] User Accounts & Login
- [ ] Multi-Device Sync
- [ ] Parent Dashboard (separate View)
- [ ] Email-Notifications
- [ ] Export-Funktion (Daten-Download)

#### Version 2.1 (Post-Launch)

- [ ] PWA (Installierbar)
- [ ] Offline-Mode
- [ ] Dark Mode
- [ ] Multi-Language (EN, DE)
- [ ] Social Features (Freunde-Challenges)

#### Version 3.0 (Future)

- [ ] Native Apps (iOS, Android)
- [ ] AI-Powered Reading Recommendations
- [ ] Gamification-Erweiterungen (Achievements, Badges)
- [ ] Family-Sharing (Mehrere Eltern)
- [ ] Reading Library Integration

---

## 🚀 Deployment

### Deployment-Architektur

```
Frontend (React)
    ↓
  Vercel / Netlify / Supabase Hosting
    ↓
Backend (Supabase Edge Functions)
    ↓
  Supabase KV Store
```

### Deployment-Schritte

#### 1. Supabase Project Setup

```bash
# 1. Create Supabase Project
# → https://supabase.com/dashboard

# 2. Get Project Credentials
SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

#### 2. Environment Variables

**Frontend (.env):**

```env
VITE_SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key
```

**Backend (Supabase Dashboard → Settings → Functions → Secrets):**

```
SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

#### 3. Deploy Backend

```bash
# Install Supabase CLI
npm install -g supabase

# Login
supabase login

# Link Project
supabase link --project-ref YOUR_PROJECT_ID

# Deploy Edge Functions
supabase functions deploy make-server-e4c1b088
```

#### 4. Deploy Frontend

**Option A: Vercel**

```bash
npm install -g vercel
vercel --prod
```

**Option B: Netlify**

```bash
npm install -g netlify-cli
netlify deploy --prod
```

**Option C: Supabase Hosting**

```bash
# Build
npm run build

# Deploy
supabase storage upload --project YOUR_PROJECT_ID
```

### Deployment Checklist

- [ ] Supabase Project erstellt
- [ ] Environment Variables gesetzt
- [ ] Backend deployed & getestet
- [ ] Frontend gebaut
- [ ] Frontend deployed
- [ ] Health Check erfolgreich: `GET /health`
- [ ] Smoke Tests durchgeführt
- [ ] DNS konfiguriert (Custom Domain)
- [ ] SSL-Zertifikat aktiv
- [ ] Monitoring aktiviert

### Monitoring

**Supabase Dashboard:**

- Edge Functions Logs
- Database Usage
- API Requests
- Error Rates

**Empfohlene Tools:**

- Sentry (Error Tracking)
- LogRocket (Session Replay)
- Google Analytics (Usage Metrics)

---

## 📝 Changelog

### Version 1.0.0 - Initial Release (2025-10-21)

**Features:**

- ✅ Vollständiges Onboarding (5 Schritte)
- ✅ Dashboard mit Progress Donut Chart
- ✅ Reading Timer mit Notifications
- ✅ Lese-Kompass (Foto + Fragen)
- ✅ Ziele-Verwaltung
- ✅ Aktivitäten-Verwaltung
- ✅ Einstellungen (Ratio, Avatar, Profil)
- ✅ Rang-System (9 Stufen)
- ✅ Multi-Profile Support
- ✅ Supabase Backend Integration
- ✅ API Client
- ✅ Placeholder-Seiten (Privacy, Support)

**Tech Stack:**

- React 18 + TypeScript
- Tailwind CSS v4.0
- Framer Motion
- Supabase Edge Functions (Hono)
- KV Store

**Design:**

- Vibrant Clarity Theme
- Claymorphismus
- Mobile-First
- Emojis statt Icons

---

## 🤝 Contributing

**Status:** Testphase - Feedback willkommen!

**Kontakt:**

- Email: support@lessscreen.app
- Issues: (GitHub Repo URL hier einfügen)

---

## 📄 License

**Status:** Proprietary (Testphase)

---

## 🙏 Credits

**Design-System:** Vibrant Clarity  
**UI Components:** Shadcn/ui  
**Icons:** Lucide React + Emojis  
**Backend:** Supabase  
**Deployment:** (Vercel/Netlify/Supabase)

---

**Dokument-Ende**

Für weitere Informationen oder Fragen, siehe Support-Seite oder kontaktiere das Entwicklungsteam.