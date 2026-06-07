"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/db";
import {
  defects,
  type Priority,
  PRIORITY_VALUES,
  type Status,
  STATUS_VALUES,
} from "@/db/schema";

export type DefectFormState = {
  errors?: Record<string, string>;
  message?: string;
};

type ParsedDefect = {
  title: string;
  description: string | null;
  category: string;
  status: Status;
  priority: Priority;
  assignee: string | null;
  dueAt: Date | null;
};

function str(formData: FormData, key: string): string {
  return String(formData.get(key) ?? "").trim();
}

/**
 * Validates the form fields. Returns either the cleaned values or a map of
 * field -> German error message. Plain, explicit validation; the course
 * introduces Zod later (see the AI capstone in the briefing).
 */
function parseDefectForm(
  formData: FormData,
): { data: ParsedDefect } | { errors: Record<string, string> } {
  const errors: Record<string, string> = {};

  const title = str(formData, "title");
  if (!title) errors.title = "Titel ist erforderlich.";
  else if (title.length > 200)
    errors.title = "Titel darf höchstens 200 Zeichen lang sein.";

  const category = str(formData, "category");
  if (!category) errors.category = "Kategorie ist erforderlich.";
  else if (category.length > 100)
    errors.category = "Kategorie darf höchstens 100 Zeichen lang sein.";

  const status = str(formData, "status") as Status;
  if (!STATUS_VALUES.includes(status)) errors.status = "Ungültiger Status.";

  const priority = str(formData, "priority") as Priority;
  if (!PRIORITY_VALUES.includes(priority))
    errors.priority = "Ungültige Priorität.";

  const dueRaw = str(formData, "dueAt");
  let dueAt: Date | null = null;
  if (dueRaw) {
    const parsed = new Date(dueRaw);
    if (Number.isNaN(parsed.getTime()))
      errors.dueAt = "Ungültiges Datum.";
    else dueAt = parsed;
  }

  if (Object.keys(errors).length > 0) return { errors };

  const description = str(formData, "description");
  const assignee = str(formData, "assignee");

  return {
    data: {
      title,
      category,
      status,
      priority,
      dueAt,
      description: description || null,
      assignee: assignee || null,
    },
  };
}

export async function createDefect(
  _prevState: DefectFormState,
  formData: FormData,
): Promise<DefectFormState> {
  const result = parseDefectForm(formData);
  if ("errors" in result) return { errors: result.errors };

  await db.insert(defects).values(result.data);

  revalidatePath("/defects");
  redirect("/defects");
}

export async function updateDefect(
  _prevState: DefectFormState,
  formData: FormData,
): Promise<DefectFormState> {
  const id = Number(formData.get("id"));
  if (!Number.isInteger(id)) return { message: "Fehler nicht gefunden." };

  const result = parseDefectForm(formData);
  if ("errors" in result) return { errors: result.errors };

  await db.update(defects).set(result.data).where(eq(defects.id, id));

  revalidatePath("/defects");
  revalidatePath(`/defects/${id}`);
  redirect(`/defects/${id}`);
}

export async function deleteDefect(formData: FormData): Promise<void> {
  const id = Number(formData.get("id"));
  if (Number.isInteger(id)) {
    await db.delete(defects).where(eq(defects.id, id));
  }

  revalidatePath("/defects");
  redirect("/defects");
}
