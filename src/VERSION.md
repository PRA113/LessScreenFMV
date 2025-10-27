# LessScreen Version

**Current Version:** `1.0.0-rc3`  
**Release Date:** 24. Oktober 2025  
**Status:** Release Candidate 3 - Production Ready

## Version History

### v1.0.0-rc3 (24. Oktober 2025) - CURRENT ⭐
**Status:** Release Candidate 3 - Production Ready

**Major Changes:**
- ✅ **Alle User-gemeldeten Bugs behoben**
- ✅ Lesekompass von allen Tabs erreichbar
- ✅ Kombinierte Aktivitäten korrekt zur Lesezeit addiert
- ✅ Weekly Chart Button funktional
- ✅ Profile Switcher bei mehreren Kindern
- ✅ **HuggingFace Inference Providers API Migration**
- ✅ **3-stufiger Fallback-Mechanismus** (OpenRouter → HuggingFace → Lokal)
- ✅ 100% kostenlose, wirtschaftliche Lösung

**Fixed Bugs:**
1. ❌ Lesekompass nur vom Dashboard erreichbar → ✅ Global verfügbar
2. ❌ Kombinierte Aktivitäten nicht zugeordnet → ✅ Korrekte Berechnung
3. ❌ Weekly Chart Button ohne Funktion → ✅ Öffnet Reading Compass
4. ❌ Kein Profile-Wechsel bei mehreren Kindern → ✅ Dropdown-Menü

**HuggingFace Migration:**
- ✅ Neue API: `router.huggingface.co/hf-inference/v1/chat/completions`
- ✅ Alte API (`api-inference.huggingface.co`) wird am 1. Nov 2025 deprecated

**Fallback Strategy:**
1. **OpenRouter** (Primär) - 4 kostenlose Models
2. **HuggingFace** (Fallback) - 3 kostenlose Models  
3. **Lokaler Fallback** (Notfall) - Immer verfügbar

**Details:** Siehe `/RELEASE_NOTES_v1.0.0-rc3.md` und `/HUGGINGFACE_FALLBACK.md`

---

### v1.0.0-rc2 (24. Oktober 2025)
**Status:** Release Candidate 2 - Production Ready

**Major Changes:**
- ✅ Intelligenter Demo-Modus als Fallback
- ✅ Automatische Graceful Degradation bei API-Fehlern
- ✅ Bessere Error Messages & User Feedback
- ✅ App funktioniert komplett ohne OpenRouter API-Key
- ✅ Visuelle Demo-Modus Anzeige im UI
- ✅ Logo-Integration mit Figma Assets

**Fixed:**
- ❌ Error 401 blockiert Reading Compass → ✅ Demo-Modus Fallback
- ❌ App unbenutzbar ohne API-Key → ✅ Vollständig testbar
- ❌ Verwirrende Fehlermeldungen → ✅ Klare Kommunikation

**Details:** Siehe `/RELEASE_NOTES_v1.0.0-rc2.md`

---

### v1.0.0-rc1 (23. Oktober 2025)
**Status:** Release Candidate 1 - Testphase

**Major Changes:**
- ✅ Push-Benachrichtigungs-Fehler behoben
- ✅ Granulare Notification-Steuerung (4 Typen)
- ✅ App-Reset Funktion für Testing
- ✅ Test-Widgets entfernt (Production-ready)
- ✅ Umfassende Dokumentation für Test-User

**Features:**
- Complete Onboarding System
- Reading Timer with Notifications
- Reading Compass (OCR + AI Questions)
- Activity & Goal Management
- Notification Settings (granular control)
- Affiliate Marketing Integration
- Mobile-First Responsive Design

**Tech Stack:**
- React + TypeScript
- Tailwind CSS v4
- Supabase (Backend + KV Store)
- OpenRouter AI (LLM)
- Tesseract.js (OCR)
- Motion/React (Animations)

---

### v0.9.0 (Oktober 2025) - Pre-Release
**Status:** Internal Testing

**Features:**
- Initial MVP implementation
- Basic Onboarding
- Reading Timer
- OCR Integration (Tesseract.js)
- Hugging Face API (unstable)

**Issues:**
- Hugging Face API: 100% 404 error rate
- No notification control
- Debug widgets in production

---

### v0.8.0 (Oktober 2025) - Alpha
**Status:** Early Development

**Features:**
- Dashboard with Donut Chart
- Basic Timer
- Profile Management
- Settings Screen

---

## Version Naming

Wir verwenden [Semantic Versioning](https://semver.org/):

```
MAJOR.MINOR.PATCH-SUFFIX

1.0.0-rc3
│ │ │  └─ Release Candidate 3
│ │ └──── Patch version
│ └────── Minor version
└──────── Major version
```

**Suffixes:**
- `alpha` - Frühe Entwicklung, instabil
- `beta` - Feature-komplett, Testing
- `rc` - Release Candidate, production-ready
- (keine) - Stable Release

## Update Strategy

### For Test Users:
- Hard Refresh: `Ctrl+F5` / `Cmd+Shift+R`
- Clear Cache: Browser Settings → Clear Cache
- Reset App: Settings → "App zurücksetzen"

### For Developers:
```bash
# Pull latest changes
git pull origin main

# Install dependencies
npm install

# Start dev server
npm run dev
```

## Roadmap

### Next: v1.0.0 (Stable)
- After successful testing
- Bug fixes from RC phase
- Performance optimizations
- Final polish

### Future: v1.1.0
- Backend data persistence
- User accounts (Supabase Auth)
- Cross-device sync
- Extended statistics

### Future: v2.0.0
- Major new features
- Redesign (if needed)
- Breaking changes

---

## Key Improvements in v1.0.0-rc3

### User Experience
- ✅ Seamless navigation zwischen allen Tabs
- ✅ Kombinierte Aktivitäten werden erkannt
- ✅ Intuitive Profile-Auswahl bei mehreren Kindern
- ✅ Alle Buttons funktional

### Reliability
- ✅ 3-Layer Fallback für maximale Verfügbarkeit
- ✅ Keine Abhängigkeit von einem einzigen Service
- ✅ App funktioniert auch bei API-Ausfällen

### Economics
- ✅ 100% kostenlose API-Nutzung
- ✅ Perfekt für Affiliate-finanzierte App
- ✅ Skalierbar ohne laufende Kosten

### Future-Proof
- ✅ Neue HuggingFace API (gültig ab Nov 2025)
- ✅ Multiple Provider-Support
- ✅ Einfach erweiterbar

---

**Current Status:** ✅ READY FOR PRODUCTION  
**Next Milestone:** v1.0.0 Stable Release
