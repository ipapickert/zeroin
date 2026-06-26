---
name: prd
description: Macht aus dem aktuellen Gespräch ein PRD-Dokument und legt es unter docs/ ab. Nutzen, wenn aus einem Grill-Interview oder der laufenden Konversation ein PRD entstehen soll.
---

Dieser Skill nimmt den aktuellen Gesprächsverlauf und dein Wissen über das zeroin-Projekt und erzeugt daraus ein PRD (Product Requirements Document). **Interviewe mich nicht** und stelle keine neuen Fragen, sondern fasse zusammen, was du bereits weißt. Das Interview ist vorher passiert (siehe Skill `grill-me`).

## Vorgehen

1. Falls noch nicht geschehen, erkunde kurz das Projekt, um den aktuellen Stand zu verstehen. Nutze durchgängig die Begriffe aus dem Projekt (deutsche UI-Begriffe, englische Code- und Datenbank-Keys) und beachte die Hauskonventionen aus `CLAUDE.md` und `AGENTS.md`.

2. Skizziere kurz die **betroffenen Bausteine** des Vorhabens: welche Tabelle(n) in `src/db/schema.ts`, welche Server Actions in `src/actions/`, welche UI-Komponenten in `src/components/`, ob die Label-Map (`src/lib/labels.ts`) berührt wird. Prüfe mit mir, ob diese Liste meinen Erwartungen entspricht, bevor du das PRD schreibst.

3. Schreibe das PRD mit der Vorlage unten auf Deutsch und speichere es als `docs/PRD-<feature>.md` (Kurzname des Features, z. B. `docs/PRD-filter-suche.md`). Lege den Ordner `docs/` an, falls er noch nicht existiert. Sag mir am Ende den Dateipfad und bitte mich, das Dokument gegenzulesen.

<prd-vorlage>

## Problembeschreibung (Problem Statement)

Das Problem aus Sicht der Nutzer.

## Lösung (Solution)

Die Lösung aus Sicht der Nutzer.

## User Stories

Eine nummerierte Liste von User Stories im Format:

1. Als <Rolle> möchte ich <Funktion>, damit <Nutzen>.

Beispiel:

1. Als Werker möchte ich die Fehlerliste nach Status filtern, damit ich nur die offenen Fehler sehe.

Die Liste soll alle Aspekte des Features abdecken und nummeriert sein, damit der Plan sich später auf einzelne Stories beziehen kann.

## Entscheidungen (Implementation Decisions)

Die dauerhaften Entscheidungen, die im Interview getroffen wurden: Schema-Änderungen, Verhalten, Umgang mit Randfällen, ob etwas in der URL steht, welche Status-Werte es gibt, und so weiter. Hebe besonders die Stellen hervor, an denen wir bewusst von einer Empfehlung abgewichen sind.

Keine konkreten Dateipfade oder Code-Schnipsel. Die veralten zu schnell.

## Prüfungen (Tests)

zeroin hat zwei eingebaute Prüfungen mit hohem Signal: die TypeScript-Typen und `pnpm lint`. Halte fest, dass diese nach jeder Phase grün sein müssen. Eine automatisierte Test-Suite gibt es noch nicht; falls für dieses Feature eine sinnvoll wäre, notiere es hier.

## Out of Scope

Was ausdrücklich NICHT gebaut wird. Dieser Abschnitt hält den Agenten davon ab, ungefragt Extras zu bauen, und ist genauso wichtig wie der Rest.

## Weitere Notizen

Alles Übrige, was für das Feature wichtig ist.

</prd-vorlage>
