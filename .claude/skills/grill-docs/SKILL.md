---
name: grill-docs
description: Grill-Interview, das deinen Plan zusätzlich gegen den Code, die Hauskonventionen und die gebündelten Next.js-16-Docs prüft. Nutzen, wenn ein Vorhaben technisch heikel ist und gegen das bestehende Projekt abgesichert werden soll.
---

<was-zu-tun>

Interviewe mich gnadenlos zu diesem Vorhaben, bis wir ein gemeinsames Verständnis haben. Geh den Entscheidungsbaum Ast für Ast durch und kläre Abhängigkeiten einzeln.

- Stelle **eine Frage nach der anderen** und warte meine Antwort ab.
- Gib zu jeder Frage deine empfohlene Antwort mit kurzer Begründung an.
- Wenn sich eine Frage durch einen Blick in den Code oder die Docs beantworten lässt, schau nach, statt mich zu fragen.

</was-zu-tun>

<warum-dieser-skill>

`grill-docs` ist die technische Variante von `grill-me`. Zusätzlich zum reinen Interview gleichst du das Vorhaben aktiv gegen das ab, was zeroin schon festgelegt hat: den Code, die Hauskonventionen und die echten Framework-Docs. So gehst du nicht mit falschen Annahmen ins Bauen.

</warum-dieser-skill>

<wogegen-pruefen>

## 1. Gegen die Hauskonventionen prüfen

Die verbindlichen Regeln stehen in `CLAUDE.md` und `AGENTS.md`. Halte das Vorhaben dagegen und sprich Konflikte sofort an:

- **Code und Datenbank Englisch, UI Deutsch.** Wenn im Gespräch deutsche Begriffe als Datenbank-Keys oder Variablennamen auftauchen, weise darauf hin und schlag englische Keys vor.
- **Label-Map ist die einzige Brücke.** Deutsche UI-Texte kommen ausschließlich aus `src/lib/labels.ts`, nie aus der Datenbank. Sobald neue Status, Felder oder Auswahlwerte im Spiel sind, frag, wie die Label-Map ergänzt wird.

## 2. Gegen die Sprache des Projekts prüfen

Wenn ich einen unscharfen oder überladenen Begriff benutze, schlag einen präzisen, festen Begriff vor. "Du sagst 'Eintrag', meinst du einen Fehler (`defect`) oder eine Maßnahme (`action`)? Das sind verschiedene Dinge." Nutze die Begriffe, die das Datenmodell in `src/db/schema.ts` schon vorgibt.

## 3. Gegen den Code prüfen

Wenn ich behaupte, wie etwas funktioniert, prüfe, ob der Code das hergibt. Bei einem Widerspruch sprich ihn an: "Du sagst, das Board soll auch gefiltert werden, aber die Filter-Logik sitzt in der Tabellen-Komponente. Sollen Board und Tabelle dieselbe Filterung teilen?"

## 4. Gegen die echten Docs prüfen

zeroin läuft auf **Next.js 16**, das gegenüber dem, woran sich Modelle "erinnern", Breaking Changes hat. Bevor du eine technische Frage aus dem Gedächtnis beantwortest, lies die gebündelten Docs unter `node_modules/next/dist/docs/`. Zwei Stolperfallen, die hier oft auftauchen:

- **"middleware" heißt jetzt "proxy".** Die Datei ist `src/proxy.ts` mit einer `proxy()`-Funktion und `config.matcher`.
- **Base UI statt Radix.** Zum Verschmelzen zweier Komponenten `render={<Element />}` (nicht `asChild`). Rendert ein `Button` als Link, zusätzlich `nativeButton={false}` setzen.

## 5. Mit konkreten Szenarien testen

Wenn es um Beziehungen im Datenmodell geht, denk dir konkrete Szenarien aus, die Randfälle ausleuchten: "Was passiert mit den Maßnahmen, wenn der zugehörige Fehler gelöscht wird?" So zwingst du die Entscheidung an die Grenzen.

</wogegen-pruefen>

## Am Ende

Fasse das Ergebnis als kurze Spec zusammen: was gebaut wird, welche Konventionen betroffen sind (besonders Label-Map und Next.js-16-Eigenheiten) und was ausdrücklich nicht dazugehört. Wenn daraus ein großes Feature wird, ist der nächste Schritt der Skill `prd`.
