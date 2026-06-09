import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";

/**
 * Password hashing with Node's built-in `crypto` — no external dependency.
 *
 * The stored value has the form `salt:hash` (both hex). We never keep the plain
 * password. `scrypt` is a slow, memory-hard hash, which is what you want for
 * passwords. There is no login yet, so `verifyPassword` is here for completeness
 * and for a later course stage.
 */

const KEY_LENGTH = 64;

/** Returns a `salt:hash` string ready to store in `users.password_hash`. */
export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, KEY_LENGTH).toString("hex");
  return `${salt}:${hash}`;
}

/** Checks a plain password against a stored `salt:hash` value. */
export function verifyPassword(password: string, stored: string): boolean {
  const [salt, hash] = stored.split(":");
  if (!salt || !hash) return false;
  const hashBuffer = Buffer.from(hash, "hex");
  const candidate = scryptSync(password, salt, KEY_LENGTH);
  return (
    hashBuffer.length === candidate.length &&
    timingSafeEqual(hashBuffer, candidate)
  );
}
