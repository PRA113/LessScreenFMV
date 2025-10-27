# Public Assets Folder

This folder contains static assets that will be served by Vercel.

## ✅ Logo Implementation

**Status:** Logo wird automatisch als Figma Asset verarbeitet!

Das LessScreen Logo wird über die `Logo` Komponente bereitgestellt:
- **Komponente:** `/components/Logo.tsx`
- **Quelle:** Figma Asset (wird beim Build automatisch verarbeitet)
- **Verwendung:** `<Logo className="..." />`

### Wie es funktioniert

1. **Figma Asset Import:** Die Logo-Komponente importiert das Bild direkt aus Figma
2. **Build-Prozess:** Beim Vercel-Build wird das Asset automatisch optimiert
3. **Production:** Das Logo wird als statisches Asset bereitgestellt

### Verwendete Komponenten

- ✅ `OnboardingStart.tsx` - Nutzt `<Logo />` Komponente
- ✅ `Dashboard.tsx` - Nutzt `<Logo />` Komponente

### Logo-Spezifikationen

- **Format:** PNG (aus Figma)
- **Design:** Lila abgerundetes Quadrat mit Pfeilen (↑↓)
- **Größen:**
  - Onboarding: 192×192px (w-48 h-48)
  - Dashboard: 48×48px (w-12 h-12)
- **Effekte:** Drop-Shadow mit lila Glow

### Für Vercel Deployment

Keine manuelle Aktion erforderlich! Das Figma Asset wird automatisch beim Build verarbeitet.

Bei Bedarf kann das Logo auch manuell exportiert und hier als `/public/logo.png` abgelegt werden.
