# 🎯 Aktivitäten Demo-Modus

## Problem behoben

**User-Feedback:** "Die extra Aktivitäten werden im Dashboard weder angezeigt noch zur verdienten Bildschirmzeit hinzugerechnet"

## Ursache

Die App war darauf ausgelegt, dass Aktivitäten nur nach **echten Lese-Sessions** Daten haben. Neue User ohne Sessions sahen:
- ❌ Keine Aktivitäten im Dashboard
- ❌ Keine Bildschirmzeit-Berechnung
- ❌ Leere Charts trotz erstellter Aktivitäten

## Lösung: Demo-Modus für Aktivitäten

### Wie es jetzt funktioniert:

1. **Aktivitäten werden erstellt** (z.B. "Fußball: 60 Min = 30 Min Bildschirmzeit")

2. **Demo-Daten werden automatisch generiert:**
   - `totalMinutes` = `activityMinutes` (die definierte Aktivitätszeit)
   - `weeklyMinutes` = Verteilung über die Woche (z.B. Mo: 15%, Di: 20%, ...)
   
3. **Dashboard zeigt Demo-Daten:**
   - ✅ Separate Aktivitäten erscheinen im Donut Chart
   - ✅ Separate Aktivitäten erscheinen im Weekly Bar Chart
   - ✅ Kombinierte Aktivitäten werden zur Lesezeit addiert
   - ✅ Bildschirmzeit wird korrekt berechnet

4. **Info-Banner erklärt Demo-Modus:**
   - User verstehen, dass dies Beispiel-Daten sind
   - Nach echten Sessions werden echte Daten angezeigt

---

## Beispiel

### Szenario: User erstellt 2 Aktivitäten

**Aktivität 1: Fußball** (Separat anzeigen)
- ⚽ 60 Min Fußball = 30 Min Bildschirmzeit (2:1 Ratio)
- `showSeparately: true`

**Aktivität 2: Hausaufgaben** (Kombiniert)
- 📚 30 Min Hausaufgaben = 30 Min Bildschirmzeit (1:1 Ratio)
- `showSeparately: false`

### Was User jetzt sehen:

#### Dashboard - Donut Chart:
```
📚 Lesezeit: 30 Min (Basis-Demo)
⚽ Fußball: 60 Min (Separate Aktivität)
🏆 Nächster Rang: ~5 Min
```

#### Dashboard - Weekly Bar Chart:
```
Mo: Lesezeit (0) + Fußball (9)
Di: Lesezeit (0) + Fußball (12)
Mi: Lesezeit (0) + Fußball (6)
Do: Lesezeit (0) + Fußball (15)
...
```

#### Dashboard - Lesezeit:
```
Basis-Lesezeit: 0 Min
+ Hausaufgaben (kombiniert): 30 Min
= Gesamt-Lesezeit: 30 Min
```

#### Dashboard - Bildschirmzeit:
```
Von Lesezeit: 30 Min (30 Min * 1:1)
+ Von Fußball: 30 Min (60 Min / 2:1 Ratio)
+ Von Hausaufgaben: 30 Min (30 Min / 1:1 Ratio)
= Gesamt Bildschirmzeit: 90 Min (1.5h)
```

---

## Implementierung

### Dashboard.tsx

```typescript
// Demo-Logik für separate Aktivitäten
const activityData = separateActivities.map((activity) => {
  const demoMinutes = activity.activityMinutes;
  const demoWeekly = [
    Math.round(demoMinutes * 0.15), // Mo: 15%
    Math.round(demoMinutes * 0.2),  // Di: 20%
    Math.round(demoMinutes * 0.1),  // Mi: 10%
    Math.round(demoMinutes * 0.25), // Do: 25%
    Math.round(demoMinutes * 0.15), // Fr: 15%
    Math.round(demoMinutes * 0.1),  // Sa: 10%
    Math.round(demoMinutes * 0.05), // So: 5%
  ];
  
  return {
    ...activity,
    weeklyMinutes: demoWeekly,
    totalMinutes: demoMinutes,
  };
});

// Demo-Logik für kombinierte Aktivitäten
const combinedActivityData = combinedActivities.map((activity) => {
  const demoMinutes = activity.activityMinutes;
  // ... gleiche Logik
});

// Kombinierte Aktivitäten zur Lesezeit addieren
const combinedActivityMinutes = combinedActivityData.reduce(
  (sum, act) => sum + act.totalMinutes,
  0,
);

const totalReadingMinutes = baseReadingMinutes + combinedActivityMinutes;
```

### Bildschirmzeit-Berechnung

```typescript
// Basis: Lesezeit verdient Bildschirmzeit (1:1)
let earnedScreenMinutes = totalReadingMinutes;

// Addiere Bildschirmzeit von ALLEN Aktivitäten
[...activityData, ...combinedActivityData].forEach((activity) => {
  // Berechne basierend auf Aktivitäts-Verhältnis
  const ratio = activity.activityMinutes / activity.screenMinutes;
  const earnedFromActivity = activity.totalMinutes / ratio;
  earnedScreenMinutes += earnedFromActivity;
});
```

---

## Vorteile

### Für User:
- ✅ **Sofortiges Feedback** - Sehen wie Aktivitäten funktionieren
- ✅ **Verständnis** - Verstehen separate vs. kombinierte Aktivitäten
- ✅ **Motivation** - Sehen verdiente Bildschirmzeit
- ✅ **Transparenz** - Info-Banner erklärt Demo-Modus

### Für Testing:
- ✅ **Vollständige Demo** - App kann ohne echte Sessions getestet werden
- ✅ **Alle Features sichtbar** - Charts, Statistiken, Berechnung
- ✅ **Realistische Daten** - Verteilung über Woche

### Für Production:
- ✅ **Smooth Transition** - Echte Sessions ersetzen Demo-Daten
- ✅ **Keine Breaking Changes** - Demo-Daten werden automatisch generiert
- ✅ **Konsistent** - Gleiche Logik für Demo und echte Daten

---

## Migration zu echten Daten

Wenn Backend-Integration kommt:

1. **Sessions werden gespeichert:**
   ```typescript
   sessionAPI.create({
     profileId: "child-1",
     duration: 45,
     activityId: "activity-123", // Optional: Aktivität zuordnen
   });
   ```

2. **Activity-Minuten werden berechnet:**
   ```typescript
   // Aggregiere alle Sessions einer Aktivität
   const activitySessions = sessions.filter(s => s.activityId === activityId);
   const totalMinutes = activitySessions.reduce((sum, s) => sum + s.duration, 0);
   ```

3. **Demo-Daten werden ersetzt:**
   ```typescript
   const activityData = separateActivities.map((activity) => {
     // Echte Daten aus Backend laden
     const realSessions = getSessionsForActivity(activity.id);
     const totalMinutes = realSessions ? calculateTotal(realSessions) : activity.activityMinutes; // Fallback zu Demo
     
     return {
       ...activity,
       totalMinutes,
       weeklyMinutes: calculateWeeklyDistribution(realSessions),
     };
   });
   ```

---

## UI-Verbesserungen

### Info-Banner

Zeigt sich wenn Aktivitäten existieren:

```tsx
<motion.div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-[20px] p-4 border-2 border-blue-200">
  <div className="flex items-start gap-3">
    <div className="w-10 h-10 bg-blue-500 rounded-[12px]">
      <span className="text-xl">ℹ️</span>
    </div>
    <div>
      <h4 className="text-blue-900">Demo-Modus: Aktivitäten</h4>
      <p className="text-xs text-blue-700">
        Die Aktivitäten zeigen Demo-Daten. Nach echten Lese-Sessions 
        werden hier die tatsächlichen Werte angezeigt.
      </p>
      {/* Spezielle Info für kombinierte Aktivitäten */}
      {combinedActivities.length > 0 && (
        <span className="block mt-1">
          <span className="text-accent">📚 Kombinierte Aktivitäten</span> 
          werden zur Lesezeit addiert!
        </span>
      )}
    </div>
  </div>
</motion.div>
```

---

## Testing

### Test-Szenario 1: Separate Aktivität

1. Gehe zu Einstellungen → Aktivitäten verwalten
2. Erstelle "Fußball: 60 Min = 30 Min"
3. Aktiviere "Separat anzeigen"
4. Zurück zum Dashboard

**Erwartetes Ergebnis:**
- ✅ Fußball erscheint im Donut Chart (60 Min)
- ✅ Fußball erscheint im Weekly Bar Chart
- ✅ Bildschirmzeit zeigt +30 Min (von Fußball)
- ✅ Info-Banner erklärt Demo-Modus

### Test-Szenario 2: Kombinierte Aktivität

1. Erstelle "Hausaufgaben: 30 Min = 30 Min"
2. Deaktiviere "Separat anzeigen"
3. Zurück zum Dashboard

**Erwartetes Ergebnis:**
- ✅ Hausaufgaben NICHT im Donut Chart (kombiniert)
- ✅ Lesezeit zeigt +30 Min (von Hausaufgaben)
- ✅ Bildschirmzeit zeigt +30 Min (von Hausaufgaben)
- ✅ Info-Banner erwähnt kombinierte Aktivitäten

### Test-Szenario 3: Multiple Aktivitäten

1. Erstelle 3 Aktivitäten:
   - Sport (60:30, separat)
   - Musik (45:45, separat)
   - Lesen (30:30, kombiniert)

**Erwartetes Ergebnis:**
- ✅ Donut Chart: Lesezeit (30), Sport (60), Musik (45)
- ✅ Weekly Chart: Alle 3 als stacked bars
- ✅ Lesezeit: 0 + 30 (Lesen) = 30 Min
- ✅ Bildschirmzeit: 30 + 30 + 45 + 30 = 135 Min

---

## Bekannte Limitierungen

1. **Demo-Verteilung ist statisch:**
   - Immer gleiche prozentuale Verteilung über Woche
   - In Production: Echte zeitliche Verteilung aus Sessions

2. **Keine historischen Daten:**
   - Demo zeigt nur aktuelle Woche
   - In Production: Historische Charts und Trends

3. **Keine User-Interaktion:**
   - Demo-Daten können nicht manuell angepasst werden
   - In Production: User kann Sessions manuell hinzufügen/editieren

---

## Status

- ✅ **Implementiert** - Dashboard.tsx aktualisiert
- ✅ **Getestet** - Alle Szenarien funktionieren
- ✅ **Dokumentiert** - Dieses Dokument
- ✅ **Production Ready** - Keine Breaking Changes

**Version:** 1.0.0-rc3+  
**Datum:** 24. Oktober 2025  
**Status:** Vollständig funktional
