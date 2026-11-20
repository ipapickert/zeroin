"use server";

import Anthropic from "@anthropic-ai/sdk";
import { eq, ne } from "drizzle-orm";
import { db } from "@/db";
import { defects } from "@/db/schema";

export type SimilarDefectsState = {
  answer?: string;
};

// Aktuelles Claude-Modell laut offizieller Modellübersicht (Stand: November 2026).
const MODEL = "claude-sonnet-5-5";

/**
 * Fragt Claude nach Fehlern, die dem aktuellen Fehler ähneln (Phase 1: Durchstich).
 * Läuft nur auf dem Server: Der Schlüssel kommt aus der Umgebung und
 * gelangt nie in den Browser. Antwortformat, Begründungen und
 * Fehlerbehandlung folgen erst in Phase 2 und 3.
 */
export async function findSimilarDefects(
  _prevState: SimilarDefectsState,
  formData: FormData,
): Promise<SimilarDefectsState> {
  const defectId = Number(formData.get("defectId"));
  const defect = await db.query.defects.findFirst({
    where: eq(defects.id, defectId),
  });
  if (!defect) return { answer: "Fehler nicht gefunden." };

  // Alle anderen Fehler sind die Kandidaten für einen Wiederholfehler.
  const otherDefects = await db.query.defects.findMany({
    where: ne(defects.id, defect.id),
  });

  const describe = (d: typeof defect) =>
    `- ${d.title} (Kategorie: ${d.category}): ${d.description ?? "keine Beschreibung"}`;

  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  const message = await client.messages.create({
    model: MODEL,
    max_tokens: 1024,
    messages: [
      {
        role: "user",
        content: [
          "Hier ist ein Fehler aus unserem Fehler-Tracker:",
          describe(defect),
          "",
          "Und hier sind alle anderen Fehler:",
          ...otherDefects.map(describe),
          "",
          "Welche der anderen Fehler sind diesem Fehler ähnlich oder wiederholen ihn?",
          "Antworte nur mit den Titeln, einer pro Zeile.",
        ].join("\n"),
      },
    ],
  });

  // Die Antwort roh als Text übernehmen.
  const answer = message.content
    .map((block) => (block.type === "text" ? block.text : ""))
    .join("");

  return { answer };
}
