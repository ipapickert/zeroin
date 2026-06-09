"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { type Role, ROLE_VALUES, users } from "@/db/schema";
import { getCurrentUser } from "@/lib/auth";
import { hashPassword } from "@/lib/password";

export type UserFormState = {
  errors?: Record<string, string>;
  message?: string;
};

type ParsedUser = {
  name: string;
  email: string;
  role: Role;
  /** Plain password from the form, or null when left unchanged on edit. */
  password: string | null;
};

function str(formData: FormData, key: string): string {
  return String(formData.get(key) ?? "").trim();
}

/** User management is admin-only. Mirrors the page-level `requireAdmin` guard. */
async function isAdmin(): Promise<boolean> {
  const current = await getCurrentUser();
  return current?.role === "admin";
}

const NOT_ADMIN_MESSAGE = "Nur Administratoren dürfen Benutzer verwalten.";

// Simple e-mail check — good enough for a teaching project (Zod comes later).
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Validates the user form. Returns either cleaned values or a map of
 * field -> German error message. `requirePassword` is true when creating
 * (a new user must have a password); on edit an empty password means "keep".
 */
function parseUserForm(
  formData: FormData,
  { requirePassword }: { requirePassword: boolean },
): { data: ParsedUser } | { errors: Record<string, string> } {
  const errors: Record<string, string> = {};

  const name = str(formData, "name");
  if (!name) errors.name = "Name ist erforderlich.";
  else if (name.length > 100)
    errors.name = "Name darf höchstens 100 Zeichen lang sein.";

  const email = str(formData, "email").toLowerCase();
  if (!email) errors.email = "E-Mail ist erforderlich.";
  else if (!EMAIL_PATTERN.test(email))
    errors.email = "Bitte eine gültige E-Mail-Adresse angeben.";

  const role = str(formData, "role") as Role;
  if (!ROLE_VALUES.includes(role)) errors.role = "Ungültige Rolle.";

  const password = str(formData, "password");
  if (requirePassword && !password)
    errors.password = "Passwort ist erforderlich.";
  else if (password && password.length < 8)
    errors.password = "Passwort muss mindestens 8 Zeichen lang sein.";

  if (Object.keys(errors).length > 0) return { errors };

  return {
    data: { name, email, role, password: password || null },
  };
}

/** Maps a SQLite UNIQUE-constraint violation on `email` to a field error. */
function isDuplicateEmailError(error: unknown): boolean {
  return (
    error instanceof Error &&
    error.message.includes("UNIQUE") &&
    error.message.includes("users.email")
  );
}

export async function createUser(
  _prevState: UserFormState,
  formData: FormData,
): Promise<UserFormState> {
  if (!(await isAdmin())) return { message: NOT_ADMIN_MESSAGE };

  const result = parseUserForm(formData, { requirePassword: true });
  if ("errors" in result) return { errors: result.errors };

  const { name, email, role, password } = result.data;

  try {
    await db.insert(users).values({
      name,
      email,
      role,
      // password is guaranteed non-null here (requirePassword: true).
      passwordHash: hashPassword(password as string),
    });
  } catch (error) {
    if (isDuplicateEmailError(error))
      return { errors: { email: "Diese E-Mail-Adresse wird bereits verwendet." } };
    throw error;
  }

  revalidatePath("/users");
  redirect("/users");
}

export async function updateUser(
  _prevState: UserFormState,
  formData: FormData,
): Promise<UserFormState> {
  if (!(await isAdmin())) return { message: NOT_ADMIN_MESSAGE };

  const id = Number(formData.get("id"));
  if (!Number.isInteger(id)) return { message: "Benutzer nicht gefunden." };

  const result = parseUserForm(formData, { requirePassword: false });
  if ("errors" in result) return { errors: result.errors };

  const { name, email, role, password } = result.data;

  // Only overwrite the hash when a new password was entered.
  const values = {
    name,
    email,
    role,
    ...(password ? { passwordHash: hashPassword(password) } : {}),
  };

  try {
    await db.update(users).set(values).where(eq(users.id, id));
  } catch (error) {
    if (isDuplicateEmailError(error))
      return { errors: { email: "Diese E-Mail-Adresse wird bereits verwendet." } };
    throw error;
  }

  revalidatePath("/users");
  redirect("/users");
}

export async function deleteUser(formData: FormData): Promise<void> {
  if (!(await isAdmin())) redirect("/defects");

  const id = Number(formData.get("id"));
  if (Number.isInteger(id)) {
    await db.delete(users).where(eq(users.id, id));
  }

  revalidatePath("/users");
  redirect("/users");
}
