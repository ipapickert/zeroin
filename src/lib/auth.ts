import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";
import { db } from "@/db";
import { type User, users } from "@/db/schema";
import {
  encodeSession,
  SESSION_COOKIE,
  SESSION_MAX_AGE,
  type SessionData,
  verifySession,
} from "@/lib/session";

/**
 * Server-side session helpers built on the signed cookie (see `session.ts`).
 * These use `next/headers` and the database, so they must only run on the
 * server (Server Components, Server Actions) — never in `proxy.ts`.
 */

/** Logs a user in by writing the signed session cookie. */
export async function createSession(data: SessionData): Promise<void> {
  const store = await cookies();
  store.set(SESSION_COOKIE, encodeSession(data), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: SESSION_MAX_AGE,
    path: "/",
  });
}

/** Logs a user out by clearing the session cookie. */
export async function deleteSession(): Promise<void> {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
}

/** Reads and verifies the current session from the cookie, or null. */
export async function getSession(): Promise<SessionData | null> {
  const store = await cookies();
  return verifySession(store.get(SESSION_COOKIE)?.value);
}

/**
 * Loads the logged-in user from the database, or null. Wrapped in React's
 * `cache` so multiple calls in one render (e.g. layout + page) hit the DB once.
 */
export const getCurrentUser = cache(async (): Promise<User | null> => {
  const session = await getSession();
  if (!session) return null;
  const user = await db.query.users.findFirst({
    where: eq(users.id, session.userId),
  });
  return user ?? null;
});

/**
 * Guards admin-only Server Components: redirects to /login when logged out and
 * to /defects when logged in without the admin role. Returns the admin user.
 */
export async function requireAdmin(): Promise<User> {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (user.role !== "admin") redirect("/defects");
  return user;
}
