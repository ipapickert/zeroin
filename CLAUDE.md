@AGENTS.md

# zeroin – Fehler- und Maßnahmen-Tracker

Ein lokales Werkzeug, um Fehler (defects) zu erfassen, ihren Status zu verfolgen
und später Ursachen, Maßnahmen und Auswertungen zu ergänzen. Dieses Repo ist das
Beispielprojekt eines Claude-Code-Kurses und wird im Kursverlauf schrittweise
erweitert. **Aktueller Stand: Stufe 0 (lauffähige Basis, nur `defects`-CRUD).**

## Tech-Stack

- Next.js 16 (App Router) + React 19, TypeScript
- SQLite (dateibasiert) mit Drizzle ORM, kein Docker / kein externer DB-Server
- Tailwind CSS v4 + shadcn/ui (Preset „base-nova", Komponenten auf Basis von
  `@base-ui/react`, Icons von `lucide-react`)
- Schriften: Space Grotesk (Display/Überschriften, Utility `font-display`) +
  Inter (Fließtext) + Geist Mono. Hell/Dunkel-Umschaltung via `next-themes`.
- Markenfarbe (violett) und semantische Status-Farben in `src/lib/status-styles.ts`
  (offen = amber, in Bearbeitung = blau, erledigt = grün, überfällig = rot)

## Befehle

```bash
npm run dev          # Dev-Server (http://localhost:3000)
npm run build        # Production-Build
npm run lint         # ESLint

npm run db:generate  # SQL-Migration aus dem Schema erzeugen (nach Schemaänderung)
npm run db:migrate   # Migrationen auf die DB anwenden
npm run db:seed      # DB leeren und mit Beispieldaten füllen
npm run db:reset     # migrate + seed in einem Schritt
npm run db:studio    # Drizzle Studio (DB im Browser ansehen)
npm run db:push      # Schema direkt in die DB pushen (ohne Migrationsdatei)
```

Setup nach dem Klonen: `npm install` → `npm run db:migrate` → `npm run db:seed`
→ `npm run dev`. Es ist **keine `.env` nötig**; die DB liegt unter `data/zeroin.db`.
Optional kann `SESSION_SECRET` (Login-Cookie-Signatur) gesetzt werden – ohne
Wert greift ein fester Dev-Fallback. Beispiel-Logins nach dem Seed: jede
Beispiel-E-Mail mit Passwort `passwort123`.

## Projektstruktur

- `src/app/` – App-Router-Seiten
  - `defects/` Übersicht (Board **und** Tabelle, Umschaltung über `?view=board|list`),
    `defects/new` Anlegen, `defects/[id]` Detail, `defects/[id]/edit` Bearbeiten
  - `users/` Übersicht (Tabelle), `users/new` Anlegen, `users/[id]/edit` Bearbeiten
    (manuelle Benutzerverwaltung, keine Registrierung)
  - `login/` Anmeldeseite (eigenes Layout ohne Sidebar)
- `src/proxy.ts` – „Proxy" (in Next.js 16 der neue Name für *middleware*): schützt
  alle Seiten, leitet Nicht-Angemeldete auf `/login` (Cookie-Prüfung, keine DB).
- `src/app/layout.tsx` – App-Shell: Sidebar nur für angemeldete Nutzer (sonst nur
  `children`, z. B. die Login-Seite) + Theme-Provider
- `src/actions/defects.ts`, `src/actions/users.ts`, `src/actions/auth.ts` – Server
  Actions (create / update / delete bzw. login / logout) inkl. Validierung
- `src/db/` – Drizzle: `schema.ts`, `index.ts` (DB-Client), `migrate.ts`, `seed.ts`
- `src/lib/labels.ts` – **Label-Map**: englische Enum-Keys → deutsche UI-Texte
- `src/lib/format.ts` – Datumsformatierung (de-DE)
- `src/lib/password.ts` – Passwort-Hashing mit Node-`crypto` (`scrypt`, kein Klartext)
- `src/lib/session.ts` – signiertes Session-Cookie (HMAC, rein, ohne DB/`next/headers`,
  daher in `proxy.ts` nutzbar); `src/lib/auth.ts` – Cookie lesen/schreiben +
  `getCurrentUser()` (DB), nur serverseitig
- `src/components/defects/`, `src/components/users/`, `src/components/auth/` –
  fachliche Komponenten (Formular, Badges, Löschen-Dialog, Login-Formular)
- `src/components/ui/` – shadcn/ui-Komponenten (nicht manuell stark umbauen).
  Diese basieren auf `@base-ui/react`, **nicht** auf Radix: zum Verschmelzen mit
  einem anderen Element `render={<Element />}` verwenden (kein `asChild`). Wird
  ein `Button` als Link gerendert, zusätzlich `nativeButton={false}` setzen, z. B.
  `<Button nativeButton={false} render={<Link href="…" />}>Text</Button>`.
- `drizzle/` – generierte SQL-Migrationen
- `data/` – lokale SQLite-Datei (git-ignoriert)

## Konventionen

- **Code und Datenbank durchgehend Englisch** (Tabellen, Spalten, Enum-Keys,
  Variablen, Datei-/Funktionsnamen). **Die UI ist Deutsch.**
- **Enum-Keys sind Englisch**, die deutsche Anzeige läuft ausschließlich über die
  Label-Map in `src/lib/labels.ts` (z. B. `open` → „offen"). Niemals den
  deutschen Text in der DB speichern.
- UI-Labels in Klartext, **keine Fachbegriffe** (kein „Ishikawa", „Pareto" etc.).
- Lokal only: keine Cloud, kein Deployment. (Externe AI-APIs sind erst in
  späteren Kursstufen erlaubt, Key dann lokal in `.env`.)
- **Authentifizierung:** einfacher E-Mail/Passwort-Login mit signiertem
  Session-Cookie. Es gibt **keine Registrierung** – Konten werden manuell unter
  `/users` angelegt. Die Benutzerverwaltung (`/users` und die zugehörigen Server
  Actions) ist **nur für `admin`** zugänglich (`requireAdmin()` in `src/lib/auth.ts`
  + Guard in den Actions; Nicht-Admins werden auf `/defects` umgeleitet). Weitere
  rollenbasierte Rechte (`user`/`viewer`) sind eine spätere Übung.
- Einfacher, gut lesbarer Code – das Repo ist Lehrmaterial. Klarheit vor Cleverness.
- Datenmutationen über Server Actions; nach Mutationen `revalidatePath` + ggf.
  `redirect`. Validierung aktuell manuell in `src/actions/defects.ts` (Zod kommt
  bewusst erst in einer späteren Kursstufe).

## Datenmodell

**`defects`:** `id`, `title`, `description?`, `category`, `status` (`open` |
`in_progress` | `done`), `priority` (`low` | `medium` | `high`), `assignee?`,
`created_at`, `due_at?`. Spätere Stufen ergänzen `actions` (Maßnahmen) und
`photos` (Fotos).

**`users`:** `id`, `name`, `email` (eindeutig), `password_hash` (nie Klartext,
siehe `src/lib/password.ts`), `role` (`admin` | `user` | `viewer`), `created_at`.
Manuell gepflegt – noch kein Login/keine Registrierung.

## Bewusst NICHT umgesetzt (= Kursübungen)

Damit die folgenden Aufgaben echte Übungen bleiben, sind sie absichtlich offen:

- **Stufe 1:** Prioritäts-Badges einfärben (`PriorityBadge` ist neutral),
  Liste sortierbar machen (aktuell feste Sortierung nach `created_at` absteigend).
- Filter/Suche, Maßnahmen, Fotos, Dashboard, AI-Wiederholfehler – alles spätere Stufen.
