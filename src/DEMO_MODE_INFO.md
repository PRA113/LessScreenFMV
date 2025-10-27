# 📚 Demo-Modus - LessScreen ist testbar!

## ✅ Gute Nachrichten!

**Die App funktioniert jetzt auch ohne gültigen OpenRouter API-Key!**

Wenn der OpenRouter Service nicht verfügbar ist (z.B. ungültiger API-Key), schaltet die App automatisch in den **intelligenten Demo-Modus**.

---

## 🎯 Was ist der Demo-Modus?

Der Demo-Modus generiert Fragen **lokal** basierend auf dem erkannten Text, ohne externe KI-Services zu nutzen.

### Funktionen im Demo-Modus:

✅ **OCR funktioniert vollständig** - Text wird korrekt aus Fotos extrahiert  
✅ **3 Fragen werden generiert** - Basierend auf dem erkannten Text  
✅ **Fragen sind kontextbezogen** - Analysieren den gelesenen Text  
✅ **Validierung funktioniert** - Antworten können überprüft werden  
✅ **Bildschirmzeit wird verdient** - Belohnungssystem funktioniert normal  
✅ **Alle anderen Features** - Timer, Dashboard, Aktivitäten etc. funktionieren  

### Was ist anders?

- ⚠️ Fragen sind **regelbasiert** statt KI-generiert
- ⚠️ Weniger kreativ als echte KI-Fragen
- ⚠️ Fragen folgen einem festen Pattern
- ℹ️ Ein **blaues Banner** zeigt an, dass Demo-Modus aktiv ist

---

## 🔍 Wann wird Demo-Modus aktiviert?

Der Demo-Modus springt automatisch ein, wenn:

1. ❌ **OpenRouter API-Key fehlt**
2. ❌ **API-Key ungültig** (Error 401: "User not found")
3. ❌ **Email nicht verifiziert** bei OpenRouter
4. ❌ **OpenRouter Service down** (503, 500)
5. ❌ **Alle Models fehlgeschlagen** (404, 429, etc.)

---

## 🎨 Wie sieht es aus?

### Im Reading Compass:

Wenn Demo-Modus aktiv ist, siehst du:

```
┌─────────────────────────────────────────┐
│ 📚 Demo-Modus aktiv                     │
│                                         │
│ Diese Fragen werden lokal generiert.    │
│ Für KI-basierte Fragen erstelle einen   │
│ gültigen OpenRouter API-Key auf         │
│ openrouter.ai und verifiziere deine     │
│ Email.                                  │
└─────────────────────────────────────────┘
```

### Toast-Benachrichtigung:

```
📚 Demo-Modus
Demo-Modus aktiv: OpenRouter API-Key muss 
konfiguriert werden. Fragen werden lokal 
generiert.
```

---

## 🧪 Testing der App

### Du kannst jetzt alles testen!

**Ohne gültigen OpenRouter API-Key:**

1. ✅ **Onboarding** - Komplett durchlaufen
2. ✅ **Profil erstellen** - Kinder hinzufügen
3. ✅ **Dashboard** - Statistiken ansehen
4. ✅ **Reading Timer** - Lesezeit aufzeichnen
5. ✅ **Reading Compass** - Text scannen & Fragen beantworten (Demo-Modus)
6. ✅ **Aktivitäten** - Custom Aktivitäten mit Ratios
7. ✅ **Bildschirmzeit verdienen** - Belohnungssystem testen
8. ✅ **Offline-Modus** - Fotos in Queue speichern

**Alles funktioniert!** 🎉

---

## 🔧 Wie aktiviere ich echte KI-Fragen?

### Schritt 1: OpenRouter Account

1. Gehe zu: https://openrouter.ai/
2. Klicke "Sign Up" oder "Sign In"
3. Melde dich an mit:
   - Google (empfohlen)
   - GitHub
   - Email/Password

### Schritt 2: Email verifizieren ⚠️ WICHTIG!

**Das ist der häufigste Grund für Fehler!**

1. Checke deine Email-Inbox
2. Finde die Verifikations-Email von OpenRouter
3. Klicke auf den Bestätigungs-Link
4. Email muss verifiziert sein!

**Ohne verifizierte Email:** Error 401 "User not found"

### Schritt 3: API-Key erstellen

1. Gehe zu: https://openrouter.ai/keys
2. Klicke: "Create Key" oder "+ New Key"
3. Name: "LessScreen Production"
4. Klicke: "Create"
5. **Kopiere den Key sofort!** (beginnt mit `sk-or-v1-...`)

### Schritt 4: Key in App setzen

**Im Supabase Dashboard:**

1. Gehe zu: https://supabase.com/dashboard
2. Wähle dein Projekt
3. Settings → Edge Functions → Secrets
4. Finde: `OPENROUTER_API_KEY`
5. Edit → Füge neuen Key ein
6. Save

**Oder verwende das Secret-Tool in Figma Make:**

Das Tool hat ein Eingabefeld für `OPENROUTER_API_KEY` geöffnet.

### Schritt 5: App neu laden

1. Schließe die App komplett
2. Öffne sie neu
3. Teste Reading Compass
4. ✅ Kein blaues Demo-Banner mehr!
5. ✅ Toast: "3 Fragen generiert!" (ohne Demo-Modus Warnung)

---

## 💰 Kosten für OpenRouter

**Gute Nachrichten: 100% KOSTENLOS!**

Die App nutzt ausschließlich **Free Models**:

- ✅ `mistralai/mistral-7b-instruct:free` - Kostenlos
- ✅ `meta-llama/llama-3.2-3b-instruct:free` - Kostenlos
- ✅ `google/gemma-2-9b-it:free` - Kostenlos
- ✅ `qwen/qwen-2-7b-instruct:free` - Kostenlos

**Kein Credit-System, keine Kosten, keine Kreditkarte nötig!**

Rate Limits:
- 🕐 5 Scans pro Stunde
- 📅 20 Scans pro Tag

Das reicht für normale Nutzung und Testing!

---

## 🐛 Troubleshooting

### Problem: Immer noch Demo-Modus trotz API-Key

**Checkliste:**

- [ ] Email bei OpenRouter verifiziert?
- [ ] API-Key korrekt kopiert? (mit `sk-or-v1-` am Anfang)
- [ ] Keine Leerzeichen vor/nach dem Key?
- [ ] Environment Variable in Supabase/Vercel gesetzt?
- [ ] App neu geladen nach Key-Update?

### Problem: Fehler 401 "User not found"

**Lösung:** Email nicht verifiziert!

1. Login bei openrouter.ai
2. Checke Account Settings
3. Verifiziere Email
4. Erstelle neuen API-Key (alter könnte ungültig sein)
5. Update in Supabase

### Problem: Fehler 503 "Service Unavailable"

**Lösung:** OpenRouter Model wird geladen

- Warte 20-30 Sekunden
- Versuche erneut
- Oder: Demo-Modus nutzen (funktioniert sofort!)

---

## 📊 Vergleich: Demo vs. KI

| Feature | Demo-Modus | Mit OpenRouter KI |
|---------|-----------|------------------|
| OCR Text-Erkennung | ✅ | ✅ |
| Fragen generieren | ✅ (lokal) | ✅ (KI) |
| Anzahl Fragen | 3 | 3 |
| Schwierigkeitsgrade | ✅ | ✅ |
| Antwort-Validierung | ✅ | ✅ |
| Bildschirmzeit verdienen | ✅ | ✅ |
| Qualität der Fragen | ⭐⭐⭐ Gut | ⭐⭐⭐⭐⭐ Exzellent |
| Kreativität | Regelbasiert | KI-kreativ |
| Geschwindigkeit | Sofort | 5-15 Sekunden |
| Offline verfügbar | ✅ | ❌ (Queue) |
| Kosten | Kostenlos | Kostenlos |

---

## ✅ Fazit

**Die App ist vollständig testbar - mit oder ohne OpenRouter!**

### Für Testing & Development:
👉 **Nutze Demo-Modus** - Alles funktioniert sofort!

### Für Production & beste Erfahrung:
👉 **Richte OpenRouter ein** - KI-Fragen sind deutlich besser!

### Für Vercel Deployment:
👉 **Beides funktioniert** - Deploy mit oder ohne OpenRouter Key!

---

## 🚀 Nächste Schritte

### Option A: Mit Demo-Modus testen
1. ✅ **Nichts zu tun!** App funktioniert bereits
2. ✅ **Teste alle Features** ohne Setup
3. ✅ **Deploy auf Vercel** - Demo-Modus funktioniert in Production
4. ℹ️ User sehen blaues Banner im Reading Compass

### Option B: OpenRouter einrichten
1. ✅ **Account erstellen** - openrouter.ai
2. ✅ **Email verifizieren** - Wichtig!
3. ✅ **API-Key erstellen** - Keys-Seite
4. ✅ **In Supabase setzen** - Environment Variable
5. ✅ **Testen** - Kein Banner mehr, bessere Fragen

### Empfehlung für Production:
**Starte mit Demo-Modus, upgrade später zu OpenRouter!**

So kannst du die App sofort deployen und später die KI-Features aktivieren, wenn du bereit bist.

---

## 📞 Support

**Demo-Modus funktioniert nicht?**

Das sollte nicht passieren, da er keine externe Abhängigkeiten hat.

Prüfe:
- Browser-Console auf JavaScript-Fehler
- Network-Tab: Ist `/make-server-e4c1b088/generate-questions` erreichbar?
- Supabase Edge Function deployed?

**OpenRouter Setup Probleme?**

Siehe: `/OPENROUTER_API_KEY_FIX.md` für detaillierte Anleitung.

---

**Version:** 1.0.0-rc1  
**Feature:** Intelligenter Demo-Modus Fallback  
**Status:** ✅ READY FOR TESTING  
**Deployment:** ✅ Production-ready mit oder ohne OpenRouter
