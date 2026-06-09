import { desc } from "drizzle-orm";
import { Plus } from "lucide-react";
import Link from "next/link";
import { UsersTable } from "@/components/users/users-table";
import { Button } from "@/components/ui/button";
import { db } from "@/db";
import { users } from "@/db/schema";
import { requireAdmin } from "@/lib/auth";

// Always read the current database state instead of a build-time snapshot.
export const dynamic = "force-dynamic";

export default async function UsersPage() {
  await requireAdmin();

  const rows = await db.select().from(users).orderBy(desc(users.createdAt));

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-semibold tracking-tight">
            Benutzer
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {rows.length} {rows.length === 1 ? "Benutzer" : "Benutzer"} ·
            Manuell verwaltete Konten
          </p>
        </div>
        <Button nativeButton={false} render={<Link href="/users/new" />}>
          <Plus className="size-4" />
          Neuer Benutzer
        </Button>
      </div>

      {rows.length === 0 ? (
        <div className="rounded-xl border border-dashed p-12 text-center text-muted-foreground">
          Noch keine Benutzer angelegt. Lege den ersten an.
        </div>
      ) : (
        <UsersTable users={rows} />
      )}
    </div>
  );
}
