import { defineConfig } from "drizzle-kit";

// Keep this path in sync with DB_PATH in src/db/index.ts.
const dbPath = process.env.DATABASE_URL ?? "data/zeroin.db";

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dialect: "sqlite",
  dbCredentials: {
    url: dbPath,
  },
});
