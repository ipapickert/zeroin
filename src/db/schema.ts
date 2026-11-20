import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

/**
 * Enum keys are always English (e.g. `open`, `in_progress`).
 * The German UI labels live in `src/lib/labels.ts` (Label-Map).
 * This keeps the stored value stable while the display text can change.
 */
export const STATUS_VALUES = ["open", "in_progress", "done"] as const;
export const PRIORITY_VALUES = ["low", "medium", "high"] as const;
export const ROLE_VALUES = ["admin", "user", "viewer"] as const;
// Art der Maßnahme: Sofort-, Abstell-, Vorbeugemaßnahme
export const MEASURE_TYPE_VALUES = [
  "immediate",
  "corrective",
  "preventive",
] as const;

export type Status = (typeof STATUS_VALUES)[number];
export type Priority = (typeof PRIORITY_VALUES)[number];
export type Role = (typeof ROLE_VALUES)[number];
export type MeasureType = (typeof MEASURE_TYPE_VALUES)[number];

/**
 * `defects` (Fehler) — the core table of the tracker.
 * Code and database are English throughout; only the UI is German.
 */
export const defects = sqliteTable("defects", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  // Titel
  title: text("title").notNull(),
  // Beschreibung
  description: text("description"),
  // Kategorie (free text, content may be German)
  category: text("category").notNull(),
  // Status: offen / in Bearbeitung / erledigt
  status: text("status", { enum: STATUS_VALUES }).notNull().default("open"),
  // Priorität: niedrig / mittel / hoch
  priority: text("priority", { enum: PRIORITY_VALUES })
    .notNull()
    .default("medium"),
  // Verantwortlich
  assignee: text("assignee"),
  // Erstellt am
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
  // Fällig am
  dueAt: integer("due_at", { mode: "timestamp" }),
});

export type Defect = typeof defects.$inferSelect;
export type NewDefect = typeof defects.$inferInsert;

/**
 * `users` (Benutzer) — manually managed accounts. No registration or login yet;
 * entries are created by hand. The password is never stored in plain text: only
 * a salted hash lives in `password_hash` (see `src/lib/password.ts`).
 */
export const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  // Name
  name: text("name").notNull(),
  // E-Mail (eindeutig)
  email: text("email").notNull().unique(),
  // Salted hash of the password — never the plain text.
  passwordHash: text("password_hash").notNull(),
  // Rolle: Administrator / Benutzer / Betrachter
  role: text("role", { enum: ROLE_VALUES }).notNull().default("user"),
  // Erstellt am
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

/**
 * `measures` (Maßnahmen) — was gegen einen Fehler getan wird.
 * Jede Maßnahme gehört zu genau einem Fehler. Wird der Fehler gelöscht,
 * werden seine Maßnahmen mitgelöscht (onDelete: "cascade").
 * Bewusst nicht `actions` genannt, um Verwechslung mit den Server Actions zu vermeiden.
 */
export const measures = sqliteTable("measures", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  // Zugehöriger Fehler
  defectId: integer("defect_id")
    .notNull()
    .references(() => defects.id, { onDelete: "cascade" }),
  // Titel
  title: text("title").notNull(),
  // Art: Sofortmaßnahme / Abstellmaßnahme / Vorbeugemaßnahme
  type: text("type", { enum: MEASURE_TYPE_VALUES }).notNull(),
  // Status: offen / in Bearbeitung / erledigt (dieselben Werte wie beim Fehler)
  status: text("status", { enum: STATUS_VALUES }).notNull().default("open"),
  // Verantwortlich (freier Text, auch für Kollegen ohne Konto)
  assignee: text("assignee"),
  // Erstellt am
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
  // Fällig am
  dueAt: integer("due_at", { mode: "timestamp" }),
});

export type Measure = typeof measures.$inferSelect;
export type NewMeasure = typeof measures.$inferInsert;
