import { mkdirSync } from "node:fs";
import { dirname } from "node:path";
import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import * as schema from "./schema";

/**
 * File-based SQLite. The path defaults to `data/zeroin.db` so the app runs
 * after `git clone` without any `.env`. Override with DATABASE_URL if needed.
 */
export const DB_PATH = process.env.DATABASE_URL ?? "data/zeroin.db";

// Make sure the data/ folder exists before opening the database file.
mkdirSync(dirname(DB_PATH), { recursive: true });

const sqlite = new Database(DB_PATH);
sqlite.pragma("journal_mode = WAL");

export const db = drizzle(sqlite, { schema });
