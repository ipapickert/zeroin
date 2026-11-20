"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { MEASURE_TYPE_VALUES, type MeasureType, measures } from "@/db/schema";

export type MeasureFormState = {
  message?: string;
};

function str(formData: FormData, key: string): string {
  return String(formData.get(key) ?? "").trim();
}

/**
 * Legt eine neue Maßnahme zu einem Fehler an (Phase 1: Durchstich).
 * Die Pflichtfeld-Prüfung mit deutschen Fehlermeldungen kommt erst in Phase 2;
 * hier wird nur abgefangen, was die Datenbank sonst nicht speichern könnte.
 */
export async function createMeasure(
  _prevState: MeasureFormState,
  formData: FormData,
): Promise<MeasureFormState> {
  const defectId = Number(formData.get("defectId"));
  if (!Number.isInteger(defectId)) return { message: "Fehler nicht gefunden." };

  const type = str(formData, "type") as MeasureType;
  if (!MEASURE_TYPE_VALUES.includes(type)) return { message: "Ungültige Art." };

  // Fälligkeitsdatum ist optional; ein leeres Feld wird zu "kein Datum".
  const dueRaw = str(formData, "dueAt");
  const dueDate = dueRaw ? new Date(dueRaw) : null;
  const dueAt = dueDate && !Number.isNaN(dueDate.getTime()) ? dueDate : null;

  const assignee = str(formData, "assignee");

  // Status wird nicht übergeben: neue Maßnahmen starten immer als "offen".
  await db.insert(measures).values({
    defectId,
    title: str(formData, "title"),
    type,
    assignee: assignee || null,
    dueAt,
  });

  // Detailseite neu laden, damit die neue Maßnahme in der Liste erscheint.
  revalidatePath(`/defects/${defectId}`);
  return {};
}
