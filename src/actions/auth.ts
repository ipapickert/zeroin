"use server";

import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { users } from "@/db/schema";
import { createSession, deleteSession } from "@/lib/auth";
import { verifyPassword } from "@/lib/password";

export type LoginFormState = {
  error?: string;
};

export async function login(
  _prevState: LoginFormState,
  formData: FormData,
): Promise<LoginFormState> {
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: "Bitte E-Mail und Passwort eingeben." };
  }

  const user = await db.query.users.findFirst({
    where: eq(users.email, email),
  });

  // Same message whether the e-mail is unknown or the password is wrong — this
  // avoids revealing which accounts exist.
  if (!user || !verifyPassword(password, user.passwordHash)) {
    return { error: "E-Mail oder Passwort ist falsch." };
  }

  await createSession({ userId: user.id, role: user.role });
  redirect("/defects");
}

export async function logout(): Promise<void> {
  await deleteSession();
  redirect("/login");
}
