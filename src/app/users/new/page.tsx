import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { createUser } from "@/actions/users";
import { UserForm } from "@/components/users/user-form";
import { requireAdmin } from "@/lib/auth";

export default async function NewUserPage() {
  await requireAdmin();

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <Link
          href="/users"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Zurück zur Liste
        </Link>
        <h1 className="mt-3 font-display text-2xl font-semibold tracking-tight">
          Neuen Benutzer anlegen
        </h1>
      </div>

      <div className="rounded-xl border bg-card p-6 shadow-sm">
        <UserForm action={createUser} submitLabel="Anlegen" />
      </div>
    </div>
  );
}
