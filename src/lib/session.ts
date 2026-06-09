import { createHmac, timingSafeEqual } from "node:crypto";
import type { Role } from "@/db/schema";

/**
 * Stateless, signed-cookie sessions — no session table, no dependency.
 *
 * The cookie value is `payload.signature`, where `payload` is the base64url of
 * a small JSON object ({ userId, role, exp }) and `signature` is its HMAC. The
 * signature makes the cookie tamper-proof: change the payload and the HMAC no
 * longer matches. This file is pure (only `node:crypto`) so it can be imported
 * from `proxy.ts`; cookie reading/writing lives in `src/lib/auth.ts`.
 */

export const SESSION_COOKIE = "session";
export const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days, in seconds

// Dev fallback so the app runs without a .env. Set SESSION_SECRET for real use.
const SECRET = process.env.SESSION_SECRET ?? "zeroin-dev-secret-change-me";

export type SessionData = { userId: number; role: Role };

function sign(payload: string): string {
  return createHmac("sha256", SECRET).update(payload).digest("base64url");
}

/** Builds a signed cookie value for the given session, with a 7-day expiry. */
export function encodeSession(data: SessionData): string {
  const body = { ...data, exp: Date.now() + SESSION_MAX_AGE * 1000 };
  const payload = Buffer.from(JSON.stringify(body)).toString("base64url");
  return `${payload}.${sign(payload)}`;
}

/** Verifies a cookie value and returns the session, or null if invalid/expired. */
export function verifySession(
  token: string | undefined | null,
): SessionData | null {
  if (!token) return null;

  const [payload, signature] = token.split(".");
  if (!payload || !signature) return null;

  // Constant-time signature check.
  const given = Buffer.from(signature);
  const expected = Buffer.from(sign(payload));
  if (given.length !== expected.length || !timingSafeEqual(given, expected))
    return null;

  try {
    const data = JSON.parse(Buffer.from(payload, "base64url").toString()) as
      | (SessionData & { exp: number })
      | null;
    if (!data || typeof data.exp !== "number" || data.exp < Date.now())
      return null;
    return { userId: data.userId, role: data.role };
  } catch {
    return null;
  }
}
