---
name: handoff
description: Verdichtet die laufende Arbeit zu einem Übergabe-Dokument, das eine frische Session weiterführen kann. Nutzen, wenn das Context Window voll wird, die Aufgabe aber noch nicht fertig ist, oder du an einem anderen Tag oder einem Kollegen weitergeben willst.
argument-hint: "Worauf soll die nächste Session fokussieren?"
---

Schreibe ein **Übergabe-Dokument**, mit dem eine frische Session genau dort weitermacht, wo diese aufhört. Speichere es als `docs/handoff.md` im Projekt (nicht im temporären Verzeichnis), damit ich es lesen und korrigieren kann.

## Die fünf Zutaten

Das Dokument enthält genau diese fünf Abschnitte:

1. **Ziel** – was insgesamt erreicht werden soll.
2. **Erledigt** – was schon fertig ist.
3. **Offen** – was noch zu tun ist.
4. **Betroffene Dateien** – welche Dateien angefasst werden (mit Pfad).
5. **Entscheidungen** – welche dauerhaften Entscheidungen wir getroffen haben und warum.

## Regeln

- Dopple keine Inhalte, die schon woanders stehen (PRD, Plan, `docs/handoff.md`-Vorgänger, Commits). Verweise stattdessen per Pfad darauf, z. B. "siehe `docs/PRD-massnahmen.md`".
- Schwärze sensible Informationen: API-Keys, Passwörter, persönliche Daten. zeroins API-Key lebt in `.env` und gehört nie in das Dokument.
- Wenn ich dir ein Argument übergebe, behandle es als Beschreibung dessen, worauf die nächste Session fokussieren soll, und richte das Dokument darauf aus.
- Wenn passende mitgelieferte Skills den nächsten Schritt erleichtern (z. B. `plan`, `prd`), nenne sie in einem kurzen Abschnitt "Empfohlene Skills".

## Hinweis

Das Übergabe-Dokument ist ein **Wegwerf-Artikel**: Es lebt nur, bis die Aufgabe fertig ist, dann kann es gelöscht werden. Lies es gegen, bevor du die Session beendest, du bist die Qualitätskontrolle der Übergabe. In der frischen Session genügt dann: "Lies `docs/handoff.md` und setz die Arbeit fort."
