"use client";

import { useActionState } from "react";
import { createMeasure, type MeasureFormState } from "@/actions/measures";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MEASURE_TYPE_LABELS, MEASURE_TYPE_OPTIONS } from "@/lib/labels";

/**
 * Schlichtes Formular, um zu einem Fehler eine neue Maßnahme anzulegen.
 * Nach dem Speichern leert React das Formular automatisch.
 */
export function MeasureForm({ defectId }: { defectId: number }) {
  const [state, formAction, pending] = useActionState<
    MeasureFormState,
    FormData
  >(createMeasure, {});

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="defectId" value={defectId} />

      <div className="space-y-2">
        <Label htmlFor="measure-title">Titel</Label>
        <Input
          id="measure-title"
          name="title"
          placeholder="Was wird gegen den Fehler getan?"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="measure-type">Art</Label>
          <Select
            name="type"
            defaultValue="immediate"
            items={MEASURE_TYPE_LABELS}
          >
            <SelectTrigger id="measure-type" className="w-full">
              <SelectValue placeholder="Art wählen" />
            </SelectTrigger>
            <SelectContent>
              {MEASURE_TYPE_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="measure-assignee">Verantwortlich</Label>
          <Input
            id="measure-assignee"
            name="assignee"
            placeholder="Name (optional)"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="measure-dueAt">Fällig am</Label>
          <Input id="measure-dueAt" name="dueAt" type="date" />
        </div>
      </div>

      {state.message ? (
        <p className="text-sm text-destructive">{state.message}</p>
      ) : null}

      <Button type="submit" disabled={pending}>
        {pending ? "Speichern…" : "Maßnahme anlegen"}
      </Button>
    </form>
  );
}
