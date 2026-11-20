"use client";

import { useActionState } from "react";
import {
  findSimilarDefects,
  type SimilarDefectsState,
} from "@/actions/similar-defects";
import { Button } from "@/components/ui/button";

/**
 * Button „Ähnliche Fehler suchen": ruft die Server Action auf und zeigt
 * die Antwort des KI-Modells schlicht darunter an.
 */
export function SimilarDefects({ defectId }: { defectId: number }) {
  const [state, formAction, pending] = useActionState<
    SimilarDefectsState,
    FormData
  >(findSimilarDefects, {});

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="defectId" value={defectId} />

      <Button type="submit" variant="outline" disabled={pending}>
        {pending ? "Suche läuft…" : "Ähnliche Fehler suchen"}
      </Button>

      {state.answer ? (
        <p className="whitespace-pre-wrap text-sm leading-relaxed">
          {state.answer}
        </p>
      ) : null}
    </form>
  );
}
