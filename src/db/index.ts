import { mkdirSync } from "node:fs";
import { dirname } from "node:path";
import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import * as schema from "./schema";

/**
 * File-based SQLite. The path defaults to `data/zeroin.db` so the app runs
 * after `git clone` without any `.env`. Override with ZEROIN_DB_PATH if needed.
 *
 * Deliberately NOT `DATABASE_URL`: many hosts set that variable for their own
 * (e.g. Postgres) database, and zeroin would then open a SQLite file named
 * after that connection string.
 */
export const DB_PATH = process.env.ZEROIN_DB_PATH ?? "data/zeroin.db";

// Make sure the data/ folder exists before opening the database file.
mkdirSync(dirname(DB_PATH), { recursive: true });

const sqlite = new Database(DB_PATH);
sqlite.pragma("journal_mode = WAL");

export const db = drizzle(sqlite, { schema });
