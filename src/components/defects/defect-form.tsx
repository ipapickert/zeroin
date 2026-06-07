"use client";

import Link from "next/link";
import { useActionState } from "react";
import type { DefectFormState } from "@/actions/defects";
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
import { Textarea } from "@/components/ui/textarea";
import type { Defect } from "@/db/schema";
import {
  PRIORITY_LABELS,
  PRIORITY_OPTIONS,
  STATUS_LABELS,
  STATUS_OPTIONS,
} from "@/lib/labels";
import { toDateInputValue } from "@/lib/format";

type DefectAction = (
  state: DefectFormState,
  formData: FormData,
) => Promise<DefectFormState>;

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="text-sm text-destructive">{message}</p>;
}

export function DefectForm({
  action,
  defect,
  submitLabel,
}: {
  action: DefectAction;
  defect?: Defect;
  submitLabel: string;
}) {
  const [state, formAction, pending] = useActionState<
    DefectFormState,
    FormData
  >(action, {});
  const errors = state.errors ?? {};

  return (
    <form action={formAction} className="space-y-6">
      {defect ? <input type="hidden" name="id" value={defect.id} /> : null}

      <div className="space-y-2">
        <Label htmlFor="title">Titel</Label>
        <Input
          id="title"
          name="title"
          defaultValue={defect?.title ?? ""}
          placeholder="Kurzer, eindeutiger Titel des Fehlers"
          aria-invalid={Boolean(errors.title)}
        />
        <FieldError message={errors.title} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Beschreibung</Label>
        <Textarea
          id="description"
          name="description"
          defaultValue={defect?.description ?? ""}
          placeholder="Was ist passiert? Wie äußert sich der Fehler?"
          rows={5}
        />
        <FieldError message={errors.description} />
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="category">Kategorie</Label>
          <Input
            id="category"
            name="category"
            defaultValue={defect?.category ?? ""}
            placeholder="z. B. Mechanik, Software, Lieferant"
            aria-invalid={Boolean(errors.category)}
          />
          <FieldError message={errors.category} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="assignee">Verantwortlich</Label>
          <Input
            id="assignee"
            name="assignee"
            defaultValue={defect?.assignee ?? ""}
            placeholder="Name (optional)"
          />
          <FieldError message={errors.assignee} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select
            name="status"
            defaultValue={defect?.status ?? "open"}
            items={STATUS_LABELS}
          >
            <SelectTrigger id="status" className="w-full">
              <SelectValue placeholder="Status wählen" />
            </SelectTrigger>
            <SelectContent>
              {STATUS_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FieldError message={errors.status} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="priority">Priorität</Label>
          <Select
            name="priority"
            defaultValue={defect?.priority ?? "medium"}
            items={PRIORITY_LABELS}
          >
            <SelectTrigger id="priority" className="w-full">
              <SelectValue placeholder="Priorität wählen" />
            </SelectTrigger>
            <SelectContent>
              {PRIORITY_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FieldError message={errors.priority} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="dueAt">Fällig am</Label>
          <Input
            id="dueAt"
            name="dueAt"
            type="date"
            defaultValue={toDateInputValue(defect?.dueAt)}
          />
          <FieldError message={errors.dueAt} />
        </div>
      </div>

      {state.message ? (
        <p className="text-sm text-destructive">{state.message}</p>
      ) : null}

      <div className="flex gap-3">
        <Button type="submit" disabled={pending}>
          {pending ? "Speichern…" : submitLabel}
        </Button>
        <Button
          variant="outline"
          nativeButton={false}
          render={
            <Link href={defect ? `/defects/${defect.id}` : "/defects"} />
          }
        >
          Abbrechen
        </Button>
      </div>
    </form>
  );
}
