"use client";

import Link from "next/link";
import { useActionState } from "react";
import type { UserFormState } from "@/actions/users";
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
import type { User } from "@/db/schema";
import { ROLE_LABELS, ROLE_OPTIONS } from "@/lib/labels";

type UserAction = (
  state: UserFormState,
  formData: FormData,
) => Promise<UserFormState>;

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="text-sm text-destructive">{message}</p>;
}

export function UserForm({
  action,
  user,
  submitLabel,
}: {
  action: UserAction;
  user?: User;
  submitLabel: string;
}) {
  const [state, formAction, pending] = useActionState<UserFormState, FormData>(
    action,
    {},
  );
  const errors = state.errors ?? {};
  const isEdit = Boolean(user);

  return (
    <form action={formAction} className="space-y-6">
      {user ? <input type="hidden" name="id" value={user.id} /> : null}

      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          name="name"
          defaultValue={user?.name ?? ""}
          placeholder="Vor- und Nachname"
          aria-invalid={Boolean(errors.name)}
        />
        <FieldError message={errors.name} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">E-Mail</Label>
        <Input
          id="email"
          name="email"
          type="email"
          defaultValue={user?.email ?? ""}
          placeholder="name@firma.de"
          aria-invalid={Boolean(errors.email)}
        />
        <FieldError message={errors.email} />
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="role">Rolle</Label>
          <Select
            name="role"
            defaultValue={user?.role ?? "user"}
            items={ROLE_LABELS}
          >
            <SelectTrigger id="role" className="w-full">
              <SelectValue placeholder="Rolle wählen" />
            </SelectTrigger>
            <SelectContent>
              {ROLE_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FieldError message={errors.role} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Passwort</Label>
          <Input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            placeholder={
              isEdit ? "Leer lassen zum Beibehalten" : "Mindestens 8 Zeichen"
            }
            aria-invalid={Boolean(errors.password)}
          />
          <FieldError message={errors.password} />
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
          render={<Link href="/users" />}
        >
          Abbrechen
        </Button>
      </div>
    </form>
  );
}
