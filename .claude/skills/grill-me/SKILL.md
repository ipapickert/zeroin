---
name: grill-me
description: Interviewt dich gnadenlos zu einem Vorhaben, bis ihr ein gemeinsames Bild habt. Nutzen, wenn du ein Feature oder eine Änderung planst, einen Plan auf die Probe stellen willst oder "grill me" sagst.
---

Interviewe mich gnadenlos zu diesem Vorhaben, bis wir ein gemeinsames Verständnis haben. Geh den Entscheidungsbaum Ast für Ast durch und kläre Abhängigkeiten zwischen Entscheidungen einzeln auf.

## Regeln

- Stelle **eine Frage nach der anderen**. Warte meine Antwort ab, bevor du die nächste Frage stellst.
- Gib zu jeder Frage **deine empfohlene Antwort** mit kurzer Begründung an.
- Wenn sich eine Frage durch einen Blick in den Code beantworten lässt, **schau in den Code, statt mich zu fragen**.
- Frag nach Verhalten, Randfällen (Edge Cases) und Umfang. Genau die Dinge, die du sonst stillschweigend selbst entscheiden würdest.
- Es ist ein Dialog, kein Verhör in eine Richtung. Wenn ich dir widerspreche oder eine Gegenfrage stelle, passe deine Empfehlung an.

## Vor den Fragen

Erkunde zuerst kurz das zeroin-Projekt, soweit es das Vorhaben betrifft:

- Die Hauskonventionen in `CLAUDE.md` und `AGENTS.md` (Code und Datenbank Englisch, UI Deutsch, Next.js 16 mit `proxy.ts` statt Middleware, Base UI statt Radix, vor Code die gebündelten Docs unter `node_modules/next/dist/docs/` lesen).
- Die Label-Map in `src/lib/labels.ts` (englische Enum-Keys auf deutsche UI-Texte), wenn UI-Texte im Spiel sind.
- Das Datenbankschema in `src/db/schema.ts`, die Server Actions in `src/actions/` und die betroffenen Komponenten in `src/components/`.

So stellst du Fragen, die zum bestehenden Projekt passen, statt allgemeiner Fragen.

## Am Ende

Fasse das Ergebnis als **kurze Spec** zusammen: wenige Stichpunkte, was gebaut wird, welche Entscheidungen wir getroffen haben und was ausdrücklich nicht dazugehört. Kein langes Dokument. Das Wertvolle ist das Gespräch davor, das jetzt im Kontext liegt.
