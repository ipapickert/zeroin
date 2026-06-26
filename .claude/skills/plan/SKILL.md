---
name: plan
description: Macht aus einem PRD oder Plan einen Tracer-Bullet-Phasenplan und legt ihn unter docs/ ab. Nutzen, wenn ein großes Feature in lauffähige Phasen zerlegt werden soll.
---

Zerlege ein Vorhaben in einen **Multi-Phase-Plan mit Tracer Bullets** und speichere ihn als `docs/PLAN-<feature>.md`. Statt Tickets in einem externen Tracker entsteht eine Markdown-Datei im Projekt, die jedes `/clear` überlebt.

## Vorgehen

### 1. Kontext sammeln

Arbeite mit dem, was schon im Gespräch steht. Wenn ich dir ein PRD übergebe (z. B. `@docs/PRD-massnahmen.md`), lies es vollständig.

### 2. Projekt erkunden (optional)

Falls noch nicht geschehen, erkunde den aktuellen Stand des Codes. Nutze die Projektbegriffe (deutsche UI, englische Code- und Datenbank-Keys) und beachte die Hauskonventionen aus `CLAUDE.md` und `AGENTS.md`.

### 3. Phasen als Tracer Bullets schneiden

Schneide das Vorhaben in **Tracer-Bullet-Phasen**. Jede Phase ist ein **dünner, vertikaler Durchstich** durch alle Schichten von zeroin (Datenbank → Server Action → UI), **kein** horizontaler Schnitt durch nur eine Schicht.

<phasen-regeln>
- Phase 1 ist der dünnste mögliche Durchstich: minimaler Umfang, ruhig hässlich, aber durchgängig und im Browser sichtbar. Beispiel: neue Tabelle anlegen, einen Eintrag erzeugen und am Fehler anzeigen, mehr nicht.
- Jede Phase endet **lauffähig und im Browser testbar** ("Im Browser ist sichtbar, dass ...").
- Spätere Phasen bauen darauf auf: bearbeiten, löschen, Status ändern, dann Feinschliff (Validierung mit deutschen Fehlermeldungen über die Label-Map, leere Zustände).
- Lieber wenige Phasen (drei sind oft eine gute Größe) als viele kleinteilige. Wenn es zu viele werden, lege welche zusammen.
- Nimm nur **dauerhafte Entscheidungen** in den Plan auf. **Keine** Implementierungsdetails, keine konkreten Funktionsnamen, kein Code. Die veralten zu schnell und verstopfen den Plan.
</phasen-regeln>

### 4. Plan mit mir reviewen

Zeige mir die vorgeschlagenen Phasen als nummerierte Liste. Pro Phase:

- **Titel**: kurzer, beschreibender Name
- **Was passiert**: das End-zu-End-Verhalten, nicht Schicht für Schicht
- **Akzeptanzkriterien**: was im Browser testbar sein muss
- **Deckt User Stories ab**: welche Stories aus dem PRD (falls vorhanden)

Frag mich:

- Ist Phase 1 wirklich dünn, oder hat sich schon Bearbeiten, Löschen oder Styling eingeschlichen?
- Stimmt die Granularität (zu grob / zu fein)?
- Endet jede Phase mit etwas Testbarem?
- Sollen Phasen zusammengelegt oder weiter geteilt werden?

Iteriere, bis ich den Schnitt freigebe. Der Plan ist ein Vorschlag, kein Vertrag.

### 5. Plan speichern

Schreibe den freigegebenen Plan mit der Vorlage unten nach `docs/PLAN-<feature>.md`. Lege `docs/` an, falls nötig.

<phasen-vorlage>

## Ziel

Ein Satz, was am Ende steht. Verweis auf das PRD (z. B. `docs/PRD-massnahmen.md`).

## Phase 1: <Titel>

**Was passiert:** End-zu-End-Beschreibung des dünnen Durchstichs.

**Akzeptanzkriterien:**
- [ ] Kriterium 1 (im Browser sichtbar)
- [ ] Kriterium 2

**Deckt User Stories ab:** 1, 2

## Phase 2: <Titel>

... gleiche Struktur ...

## Phase 3: <Titel>

... gleiche Struktur ...

</phasen-vorlage>
