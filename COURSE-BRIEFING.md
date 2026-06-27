# zeroin – Handover Briefing for the Video Course Design

> Purpose of this document: a self-contained handover for an AI (or person) who
> will design a **Claude Code video course** around this repository. It describes
> (1) what the system is and how it is built, and (2) every course idea and
> exercise we have already defined. Nothing here needs prior knowledge of the
> repo.

---

## 1. What this project is

**zeroin** is a local **defect & action tracker** ("Fehler- und Maßnahmen-Tracker").
A team can record defects (Fehler), follow their status, and — in later stages —
add root causes, corrective actions, photos, and analytics.

It is deliberately built as **teaching material for a Claude Code course**. The
repo starts as a runnable baseline and is extended step by step across the
course. **Clarity is valued over cleverness** — every file is meant to be read
and understood by learners.

Key framing facts:

- **Real-world domain:** quality management in manufacturing (the company behind
  it, Pickert, makes quality/MES software). Seed data is realistic German
  factory defects (gap dimensions, paint inclusions, loose screws, supplier
  parts, firmware aborts, etc.).
- **Bilingual by design — and this is itself a teaching point:** all **code and
  database are English** (tables, columns, enum keys, variables, file names),
  but the **entire UI is German**. The bridge between them is a single
  **Label-Map** (`src/lib/labels.ts`) that maps English enum keys to German
  display text (`open` → „offen"). German text is never stored in the DB.
- **100 % local:** no cloud, no Docker, no external DB server, no deployment.
  SQLite file on disk. External AI APIs are only introduced in later course
  stages (key kept locally in `.env`).
- **Audience language:** the course and app UI are **German**; this briefing is
  in English for the course designer.

---

## 2. Tech stack

| Layer        | Choice |
| ------------ | ------ |
| Framework    | **Next.js 16** (App Router) + **React 19**, TypeScript |
| Database     | **SQLite** (file-based, `data/zeroin.db`) via **Drizzle ORM** + `better-sqlite3` |
| Styling      | **Tailwind CSS v4** + **shadcn/ui** (preset "base-nova") |
| UI primitives| **`@base-ui/react`** (NOT Radix) — important nuance, see below |
| Icons        | `lucide-react` |
| Fonts        | Space Grotesk (display/headings, `font-display`), Inter (body), Geist Mono |
| Theming      | `next-themes` (light/dark toggle) |
| Toasts       | `sonner` |
| Auth         | Hand-rolled: signed-cookie session, Node `crypto` password hashing (no library) |

> ⚠️ **Critical environment note (already enforced in `AGENTS.md`):** This is
> **Next.js 16**, which has breaking changes vs. what most models "remember."
> The repo instructs agents to **read the bundled docs in
> `node_modules/next/dist/docs/` before writing code.** Two concrete gotchas the
> course will hit:
> - **"middleware" is renamed to "proxy"** in Next.js 16. The file is
>   `src/proxy.ts` and exports a `proxy()` function (+ `config.matcher`).
> - **base-ui, not Radix:** to merge a component with another element use
>   `render={<Element />}` (NOT `asChild`). When a `Button` renders as a link,
>   also set `nativeButton={false}`, e.g.
>   `<Button nativeButton={false} render={<Link href="…" />}>Text</Button>`.

---

## 3. Commands

```bash
pnpm dev          # Dev server (http://localhost:3000)
pnpm build        # Production build
pnpm lint         # ESLint

pnpm db:generate  # Generate SQL migration from schema (after schema change)
pnpm db:migrate   # Apply migrations
pnpm db:seed      # Wipe + reseed example data
pnpm db:reset     # migrate + seed in one step
pnpm db:studio    # Drizzle Studio (browse DB in browser)
pnpm db:push      # Push schema straight to DB (no migration file)
```

**Setup after clone:** `pnpm install` → `pnpm db:migrate` → `pnpm db:seed`
→ `pnpm dev`. No `.env` required. Optional `SESSION_SECRET` for the login
cookie signature; without it a fixed dev fallback is used. After seeding, every
demo email logs in with password **`passwort123`**.

---

## 4. Architecture & project structure

```
src/
  app/                      # App Router pages
    page.tsx                # redirects to /defects
    layout.tsx              # App shell: sidebar (only when logged in) + theme provider
    login/                  # Login page (own layout, no sidebar)
    defects/                # List — Board AND Table, switched via ?view=board|list
      new/                  # Create
      [id]/                 # Detail
      [id]/edit/            # Edit
    users/                  # User list (table)  — ADMIN ONLY
      new/                  # Create user
      [id]/edit/            # Edit user
  proxy.ts                  # Next.js 16 "proxy" (ex-middleware): gates whole app behind login
  actions/
    defects.ts              # Server Actions: create/update/delete + manual validation
    users.ts                # Server Actions: user CRUD (admin-guarded)
    auth.ts                 # Server Actions: login / logout
  db/
    schema.ts               # Drizzle schema (defects, users) + enum value arrays + types
    index.ts                # DB client (better-sqlite3)
    migrate.ts              # Migration runner
    seed.ts                 # ~36 realistic defects + 3 demo users
  lib/
    labels.ts               # ★ Label-Map: English enum keys → German UI text
    format.ts               # Date formatting (de-DE)
    status-styles.ts        # Semantic colors per status (badge/dot/column/text)
    password.ts             # scrypt salt:hash, no plain text (Node crypto)
    session.ts              # Pure signed-cookie (HMAC) — importable from proxy.ts, no DB
    auth.ts                 # Cookie read/write + getCurrentUser() + requireAdmin() (server only)
    utils.ts                # cn() etc.
  components/
    app-sidebar.tsx, theme-provider.tsx, theme-toggle.tsx
    defects/                # form, badges, board, card, table, stats, due-label, view-toggle, delete dialog
    users/                  # form, table, role-badge, delete dialog
    auth/                   # login-form
    ui/                     # shadcn/ui (base-ui based) — don't heavily hand-edit
drizzle/                    # generated SQL migrations
data/                       # local SQLite file (git-ignored)
```

### How the layers fit together (the mental model the course should teach)

1. **Proxy (`src/proxy.ts`)** runs before every matched route. It only checks the
   **signed cookie** (no DB call) and redirects: logged-out → `/login`,
   logged-in visiting `/login` → `/defects`. This is why session verification is
   split into a **pure** module (`session.ts`, only `node:crypto`) usable in the
   proxy, vs. **`auth.ts`** which uses `next/headers` + DB and is server-only.
2. **Server Components** render pages and call `getCurrentUser()` (React-`cache`d
   so layout + page hit the DB once) for the real user.
3. **Server Actions** (`"use server"`) perform all mutations, then
   `revalidatePath(...)` + `redirect(...)`. Forms use the `useActionState`
   pattern with a `FormState` return type carrying field-level German errors.
4. **Validation is manual and explicit** today (plain functions returning a
   `{ data } | { errors }` union). **Zod is intentionally deferred** to a later
   stage so learners feel the pain first.

---

## 5. Data model

**`defects`** (the core table):
`id`, `title`, `description?`, `category` (free text, may be German),
`status` (`open` | `in_progress` | `done`, default `open`),
`priority` (`low` | `medium` | `high`, default `medium`),
`assignee?`, `created_at` (unixepoch default), `due_at?`.
Future stages add `actions` (corrective measures) and `photos`.

**`users`** (manually managed accounts — no public registration):
`id`, `name`, `email` (unique), `password_hash` (`salt:hash`, scrypt, never plain
text), `role` (`admin` | `user` | `viewer`, default `user`), `created_at`.

Enum value arrays (`STATUS_VALUES`, `PRIORITY_VALUES`, `ROLE_VALUES`) and TS types
live in `schema.ts` and are reused by validation and by the Label-Map.

---

## 6. Conventions (the "house style" the course should reinforce)

- **Code & DB English, UI German**, always. German display only via
  `src/lib/labels.ts`. Never store German text in the DB.
- **UI labels are plain language — no jargon** (no "Ishikawa", "Pareto", etc.).
- **Auth model:** simple email/password + signed session cookie. **No
  registration** — accounts created manually under `/users`. **User management
  is admin-only** (`requireAdmin()` page guard + `isAdmin()` guard inside the
  actions; non-admins redirected to `/defects`). Roles `user`/`viewer` having
  finer permissions is a **later exercise**.
- **Mutations via Server Actions**, then `revalidatePath` (+ `redirect`).
- **Simple, readable code** — the repo is teaching material.
- **Security niceties already modeled** (good things to highlight on camera):
  constant-time HMAC/hash comparison (`timingSafeEqual`), identical
  "email or password wrong" message to avoid account enumeration, `httpOnly` +
  `sameSite` cookies, UNIQUE-constraint violation mapped to a friendly field
  error.

---

## 7. Current state of the repo (important for sequencing the course)

The committed history is:

```
5798a97 Rework palette to Pickert brand (red #cc0000 + charcoal/gray)
65ad058 Redesign UI: SaaS shell, Kanban board, fonts, colors, dark mode
cf1ce34 docs(CLAUDE): Base UI render/nativeButton convention for link buttons
91d5372 Fix Base UI Button console error on link-style buttons
3b853c1 Stufe 0: lauffähige Basis des Fehler-Trackers (defects-CRUD)
```

**Mismatch to be aware of:** `CLAUDE.md` and `README.md` still describe the project
as **"Stufe 0 — defects CRUD only, no auth."** But the **working tree already
contains a full, uncommitted authentication + user-management layer** (login,
proxy gate, sessions, password hashing, `/users` admin CRUD, role badges) plus a
DB migration `0001` adding the `users` table. In other words: **auth is built but
not yet committed/documented as an official stage.**

This is actually a *gift* for course design: the auth feature can be presented as
a complete worked example, **or** rewound and rebuilt on camera as a course stage.
The designer should decide whether "add authentication" is a *demonstrated
solution* or a *student exercise*.

---

## 8. Course ideas & exercises already defined

These are the extension points we've already scoped. They are intentionally left
open in the code so they make real exercises. CLAUDE.md calls them "Stufen"
(stages).

### Stage 1 — small, self-contained warm-ups
- **Color the priority badges.** `PriorityBadge` is currently neutral/un-colored
  on purpose; status already has a full semantic color system in
  `src/lib/status-styles.ts` to copy the pattern from. (low/medium/high.)
- **Make the list sortable.** The table currently has a fixed sort
  (`created_at` descending). Add user-controlled sorting.

### Later stages — explicitly named as future work
- **Filter & search** over the defect list.
- **Actions / corrective measures (`actions` table)** — the "Maßnahmen" half of
  the app name; add the table, relations, UI.
- **Photos (`photos` table)** — attach images to a defect.
- **Dashboard / analytics** — charts and KPIs over the defect data (note: a seed
  defect literally is "Dashboard loads very slowly", a nice hook).
- **Role-based permissions for `user` / `viewer`** — currently only `admin` is
  actually gated (user management). Flesh out what `user` and `viewer` may do.
- **Zod validation** — replace the hand-written validators in
  `actions/defects.ts` / `actions/users.ts`. The code comments explicitly say
  "Zod comes later" — the migration from manual → schema validation is a planned
  teaching moment.
- **Authentication** — see §7; either already-done showcase or a rebuild
  exercise.
- **AI features ("AI-Wiederholfehler" / recurring-defect detection)** — the
  capstone direction. External AI APIs become allowed in later stages, key kept
  locally in `.env`. The natural pitch: use an LLM to spot recurring/duplicate
  defects, cluster root causes, or suggest corrective actions. (If built, use the
  latest Claude models — e.g. Opus 4.8 / Sonnet 4.6 — via the Anthropic SDK.)

### Cross-cutting Claude-Code teaching themes this repo is purpose-built for
- **Working against unfamiliar/breaking framework versions** — the Next.js 16
  "read the docs first" discipline (`AGENTS.md`), proxy-vs-middleware,
  base-ui-vs-Radix. Great for teaching how to make Claude verify instead of
  hallucinate.
- **Using `CLAUDE.md` / `AGENTS.md` to steer the agent** — the repo already
  demonstrates project memory, conventions, and "deliberately not implemented"
  notes that keep an agent from over-building.
- **The Label-Map pattern** (English keys ↔ German UI) — a clean, reusable lesson
  in separating stored values from presentation.
- **Server Actions + revalidation + progressive enhancement** in modern Next.js.
- **Hand-rolled auth** as a security teaching unit (hashing, signed cookies,
  timing-safe comparisons, enumeration-safe error messages).
- **Migrations & seeding workflow** with Drizzle (generate → migrate → seed).

---

## 9. Quick-start checklist for the course designer

1. Clone, `pnpm install`, `pnpm db:migrate`, `pnpm db:seed`, `pnpm dev`.
2. Log in with any seeded email (e.g. `anna.becker@example.com`, an **admin**) /
   `passwort123`. Non-admins: `tobias.mayer@…` (user), `sandra.klein@…` (viewer).
3. Explore `/defects` (toggle `?view=board` vs `?view=list`), `/defects/new`,
   a detail page, and (as admin) `/users`.
4. Read `CLAUDE.md` + `AGENTS.md` first — they encode the rules any on-camera
   Claude session must follow.
5. Decide the official stage boundaries: confirm whether **auth** is presented as
   done or rebuilt, and pick which Stage-1 warm-ups open the course.

---

*Files worth opening first when designing lessons:* `src/lib/labels.ts`,
`src/db/schema.ts`, `src/actions/defects.ts`, `src/proxy.ts`,
`src/lib/session.ts`, `src/lib/status-styles.ts`, `CLAUDE.md`, `AGENTS.md`.
