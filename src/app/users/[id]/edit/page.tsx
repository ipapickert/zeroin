import { eq } from "drizzle-orm";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { updateUser } from "@/actions/users";
import { UserForm } from "@/components/users/user-form";
import { db } from "@/db";
import { users } from "@/db/schema";
import { requireAdmin } from "@/lib/auth";

export default async function EditUserPage({
  params,
}: PageProps<"/users/[id]/edit">) {
  await requireAdmin();

  const { id } = await params;
  const user = await db.query.users.findFirst({
    where: eq(users.id, Number(id)),
  });

  if (!user) notFound();

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
          Benutzer bearbeiten
        </h1>
      </div>

      <div className="rounded-xl border bg-card p-6 shadow-sm">
        <UserForm action={updateUser} user={user} submitLabel="Speichern" />
      </div>
    </div>
  );
}
