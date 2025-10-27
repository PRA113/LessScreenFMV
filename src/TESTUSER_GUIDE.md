# LessScreen - Anleitung für Test-User 🧪

Willkommen beim Test der LessScreen App! Diese Anleitung hilft dir, die App optimal zu testen.

## 🚀 Start

Die App startet automatisch im **Onboarding**. Folge einfach den Schritten auf dem Bildschirm.

## 📋 Test-Checkliste

### 1. Onboarding (Erster Start)

- [ ] **Willkommens-Screen**: Siehst du den LessScreen-Willkommens-Screen?
- [ ] **Benutzertyp auswählen**: 
  - Teste "Ein Kind"
  - Teste "Mehrere Kinder" 
  - Teste "Erwachsener"
- [ ] **Profil erstellen**: Kannst du einen Namen eingeben?
- [ ] **Tutorial**: Werden die 5 interaktiven Tutorial-Slides angezeigt?
- [ ] **Benachrichtigungen**: 
  - Klicke auf "Benachrichtigungen aktivieren"
  - Erlaube Benachrichtigungen im Browser
  - Erscheint eine Test-Benachrichtigung?

### 2. Dashboard

- [ ] **Donut-Chart**: Wird das Progress-Chart angezeigt?
- [ ] **Statistiken**: Siehst du Lesezeit, Bildschirmzeit, etc.?
- [ ] **Design**: Ist das Design ansprechend? (Türkis-grüne Farben, Lavendel-Hintergrund)
- [ ] **Profil-Wechsel**: Kannst du zwischen Profilen wechseln? (bei mehreren Kindern)

### 3. Lese-Timer (+ Button)

- [ ] **Timer starten**: Klicke auf den + Button in der Mitte
- [ ] **Minuten einstellen**: Kannst du die Lesezeit einstellen?
- [ ] **Timer läuft**: Läuft der Timer korrekt?
- [ ] **Timer pausieren**: Funktioniert die Pause?
- [ ] **Notification**: Bekommst du eine Benachrichtigung, wenn der Timer abläuft?
- [ ] **Lese-Kompass öffnet sich**: Öffnet sich automatisch der Lese-Kompass?

### 4. Lese-Kompass (Verständnis-Validierung)

- [ ] **Fotoaufnahme**: Kannst du ein Foto vom Buch machen?
- [ ] **OCR-Erkennung**: Wird der Text erkannt?
- [ ] **Fragen-Generierung**: 
  - Werden Fragen zum Text generiert?
  - Sind die Fragen sinnvoll?
- [ ] **Antworten**: Kannst du die Fragen beantworten?
- [ ] **Feedback**: Bekommst du Feedback zu deinen Antworten?

### 5. Einstellungen

#### 5.1 Lesezeit-Verhältnis
- [ ] **Verhältnis ändern**: Kannst du das Verhältnis (z.B. 1:2) ändern?
- [ ] **Speichern**: Wird die Einstellung gespeichert?

#### 5.2 Aktivitäten verwalten
- [ ] **Neue Aktivität**: Kannst du eine neue Aktivität hinzufügen?
- [ ] **Emoji wählen**: Funktioniert die Emoji-Auswahl?
- [ ] **Verhältnis einstellen**: Kannst du ein individuelles Verhältnis setzen?
- [ ] **Aktivität löschen**: Kannst du Aktivitäten wieder löschen?

#### 5.3 Ziele verwalten
- [ ] **Neues Ziel**: Kannst du ein neues Leseziel erstellen?
- [ ] **Ziel-Details**: Titel, Beschreibung, Emoji, Zielwert?
- [ ] **Fortschritt**: Wird der Fortschritt angezeigt?

#### 5.4 Benachrichtigungen
- [ ] **Status sehen**: Wird der Notification-Status angezeigt?
- [ ] **Test-Benachrichtigung**: Funktioniert die Test-Benachrichtigung?
- [ ] **Einzelne Typen steuern**:
  - [ ] Timer-Benachrichtigungen an/aus
  - [ ] Erinnerungs-Benachrichtigungen an/aus
  - [ ] Ziel-Benachrichtigungen an/aus
  - [ ] Meilenstein-Benachrichtigungen an/aus
- [ ] **Einstellungen gespeichert**: Bleiben die Einstellungen nach Reload?

#### 5.5 Eltern-Profil bearbeiten
- [ ] **Name ändern**: Kannst du den Namen ändern?
- [ ] **E-Mail hinzufügen**: Kannst du eine E-Mail hinzufügen?

### 6. Partner-Angebote

- [ ] **Popup öffnet**: Öffnet sich das Affiliate-Popup?
- [ ] **Kategorien**: Werden verschiedene Partner-Kategorien angezeigt?
- [ ] **Links funktionieren**: Öffnen sich die Partner-Links?

### 7. Buch-Empfehlungen

- [ ] **Nach Lesezeit**: Öffnet sich das Popup nach einer Lesesession?
- [ ] **Altersgerechte Bücher**: Werden passende Bücher empfohlen?
- [ ] **Affiliate-Links**: Funktionieren die Links zu Amazon?

## 🔄 App zurücksetzen

Du möchtest die App komplett zurücksetzen und von vorne testen?

1. Gehe zu **Einstellungen** (rechter Tab)
2. Scrolle nach unten
3. Klicke auf **"App zurücksetzen (Test)"**
4. Klicke erneut zur Bestätigung
5. Die App lädt neu und startet im Onboarding

## 🐛 Bug-Report

Wenn du einen Fehler findest, notiere bitte:

1. **Was hast du gemacht?** (Schritt-für-Schritt)
2. **Was sollte passieren?**
3. **Was ist stattdessen passiert?**
4. **Screenshot** (falls möglich)
5. **Browser & Gerät** (z.B. Chrome auf iPhone 13)

### Bekannte Einschränkungen:

- **iOS Safari**: Push-Benachrichtigungen funktionieren nur ab iOS 16.4+ und erfordern "Zum Home-Bildschirm hinzufügen"
- **Offline-Modus**: OCR und Fragengenerierung benötigen Internetverbindung
- **API-Limits**: OpenRouter API hat kostenlose Limits (funktioniert aber mit Fallback-Fragen)

## 💡 Test-Szenarien

### Szenario 1: Einzelnes Kind (Max, 8 Jahre)
1. Wähle "Ein Kind"
2. Name: "Max"
3. Starte 30-Minuten-Timer
4. Mache Foto von Kinderbuch-Seite
5. Beantworte Verständnisfragen

### Szenario 2: Mehrere Kinder (Emma & Noah)
1. Wähle "Mehrere Kinder"
2. Füge "Emma" und "Noah" hinzu
3. Wechsle zwischen Profilen
4. Teste Timer für beide Kinder
5. Vergleiche Statistiken

### Szenario 3: Erwachsener Leser
1. Wähle "Erwachsener"
2. Erstelle eigene Aktivitäten (z.B. "YouTube: 1:1")
3. Setze Leseziele (z.B. "52 Bücher im Jahr")
4. Teste Lese-Kompass mit Roman

### Szenario 4: Benachrichtigungs-Präferenzen
1. Gehe zu Einstellungen → Benachrichtigungen
2. Deaktiviere "Erinnerungen"
3. Lass Timer ablaufen → Benachrichtigung sollte kommen
4. Prüfe, dass keine Erinnerungs-Benachrichtigungen kommen

## 📊 Performance testen

- [ ] **Lädt die App schnell?**
- [ ] **Ist die Navigation flüssig?**
- [ ] **Gibt es Ruckler oder Verzögerungen?**
- [ ] **Funktioniert alles auf dem Smartphone?**
- [ ] **Ist das Design responsive?**

## 🎨 Design-Feedback

- [ ] **Farben**: Gefallen dir die türkis-grünen Farben?
- [ ] **Schriften**: Sind die Texte gut lesbar?
- [ ] **Layout**: Ist alles übersichtlich?
- [ ] **Animationen**: Sind die Animationen angenehm?
- [ ] **Icons**: Sind die Icons verständlich?

## 📝 Allgemeines Feedback

- **Was gefällt dir besonders gut?**
- **Was könnte verbessert werden?**
- **Würdest du die App nutzen?**
- **Würdest du die App weiterempfehlen?**
- **Fehlt dir eine Funktion?**

## 🙏 Vielen Dank!

Dein Feedback hilft uns, LessScreen zu verbessern und eine großartige App für Familien zu entwickeln!

---

**Support:** Bei Fragen oder Problemen melde dich gerne!

**Version:** 1.0.0-rc1 (Testphase)
**Datum:** 23. Oktober 2025
