# zeroin – Fehler- und Maßnahmen-Tracker

Ein lokales Werkzeug, um **Fehler (defects)** zu erfassen, ihren Status zu
verfolgen und – in späteren Ausbaustufen – Ursachen, Maßnahmen, Fotos und
Auswertungen zu ergänzen. Die App läuft komplett lokal: kein Cloud-Dienst, kein
externer Datenbankserver, keine Anmeldung.

> Dieses Repository ist das Beispielprojekt eines Claude-Code-Kurses. Es startet
> als lauffähige Basis (**Stufe 0**) und wird im Kursverlauf erweitert.

## Funktionsumfang (Stufe 0)

- Fehlerliste mit Titel, Kategorie, Status, Priorität, Verantwortlich, Fälligkeit
- Fehler **anlegen, ansehen, bearbeiten und löschen** (CRUD)
- Deutsche Oberfläche; englische Enum-Keys werden über eine **Label-Map** auf
  deutsche Texte abgebildet (`open` → „offen" usw.)
- Realistische **Beispieldaten** (36 Fehler) per Seed-Skript

## Tech-Stack

- [Next.js 16](https://nextjs.org) (App Router) + React 19, TypeScript
- [SQLite](https://www.sqlite.org) (dateibasiert) mit [Drizzle ORM](https://orm.drizzle.team)
- [Tailwind CSS v4](https://tailwindcss.com) + [shadcn/ui](https://ui.shadcn.com)

## Voraussetzungen

- Node.js 20 oder neuer
- npm

## Setup

```bash
# 1. Abhängigkeiten installieren
npm install

# 2. Datenbank anlegen (Migration anwenden)
npm run db:migrate

# 3. Beispieldaten einspielen
npm run db:seed

# 4. Dev-Server starten
npm run dev
```

Danach die App unter **http://localhost:3000** öffnen (die Startseite leitet auf
die Fehlerliste `/defects` weiter).

> Eine `.env` ist **nicht erforderlich**. Die Datenbank wird als Datei unter
> `data/zeroin.db` angelegt. Den Pfad kann man optional über `DATABASE_URL`
> ändern (siehe `.env.example`).

## Nützliche Befehle

| Befehl                | Beschreibung                                            |
| --------------------- | ------------------------------------------------------- |
| `npm run dev`         | Dev-Server starten                                      |
| `npm run build`       | Production-Build erstellen                              |
| `npm run lint`        | ESLint ausführen                                        |
| `npm run db:generate` | SQL-Migration aus dem Schema erzeugen                   |
| `npm run db:migrate`  | Migrationen auf die Datenbank anwenden                  |
| `npm run db:seed`     | Datenbank leeren und mit Beispieldaten füllen           |
| `npm run db:reset`    | `db:migrate` + `db:seed` in einem Schritt               |
| `npm run db:studio`   | Drizzle Studio (Datenbank im Browser ansehen)           |

## Projektstruktur (Auszug)

```
src/
  app/
    defects/            # Liste
    defects/new/        # Anlegen
    defects/[id]/       # Detailansicht
    defects/[id]/edit/  # Bearbeiten
  actions/defects.ts    # Server Actions (create/update/delete) + Validierung
  db/
    schema.ts           # Drizzle-Schema (Tabelle `defects`)
    index.ts            # Datenbank-Client (better-sqlite3)
    migrate.ts          # Migrationsskript
    seed.ts             # Beispieldaten
  lib/
    labels.ts           # Label-Map: Enum-Keys -> deutsche UI-Texte
    format.ts           # Datumsformatierung
  components/
    defects/            # Formular, Badges, Löschen-Dialog
    ui/                 # shadcn/ui-Komponenten
drizzle/                # generierte SQL-Migrationen
data/                   # lokale SQLite-Datei (nicht im Git)
```

## Konventionen

- **Code & Datenbank durchgehend Englisch**, **Oberfläche Deutsch**.
- Enum-Keys sind Englisch; die deutsche Anzeige läuft über `src/lib/labels.ts`.
- Lokal only, keine Authentifizierung. Klarheit vor Cleverness – das Repo ist
  Lehrmaterial.

Mehr Kontext für die Arbeit mit Claude Code steht in [`CLAUDE.md`](./CLAUDE.md).
