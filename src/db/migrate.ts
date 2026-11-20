import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { migrate } from "drizzle-orm/better-sqlite3/migrator";
import { mkdirSync } from "node:fs";
import { dirname } from "node:path";

/**
 * Applies the SQL migrations in ./drizzle to the database.
 * Run with `pnpm db:migrate`.
 */
// Same variable as DB_PATH in src/db/index.ts (see the note there).
const dbPath = process.env.ZEROIN_DB_PATH ?? "data/zeroin.db";
mkdirSync(dirname(dbPath), { recursive: true });

const sqlite = new Database(dbPath);
const db = drizzle(sqlite);

migrate(db, { migrationsFolder: "./drizzle" });
sqlite.close();

console.log(`Migrations applied to ${dbPath}`);
