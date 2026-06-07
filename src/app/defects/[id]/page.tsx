import { eq } from "drizzle-orm";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  PriorityBadge,
  StatusBadge,
} from "@/components/defects/defect-badges";
import { DeleteDefectButton } from "@/components/defects/delete-defect-button";
import { Button } from "@/components/ui/button";
import { db } from "@/db";
import { defects } from "@/db/schema";
import { formatDate } from "@/lib/format";

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1">
      <dt className="text-sm text-muted-foreground">{label}</dt>
      <dd className="text-sm">{children}</dd>
    </div>
  );
}

export default async function DefectDetailPage({
  params,
}: PageProps<"/defects/[id]">) {
  const { id } = await params;
  const defect = await db.query.defects.findFirst({
    where: eq(defects.id, Number(id)),
  });

  if (!defect) notFound();

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <Link
          href="/defects"
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          ← Zurück zur Liste
        </Link>
        <div className="mt-2 flex items-start justify-between gap-4">
          <h1 className="text-2xl font-semibold">{defect.title}</h1>
          <div className="flex shrink-0 gap-2">
            <Button
              variant="outline"
              render={<Link href={`/defects/${defect.id}/edit`} />}
            >
              Bearbeiten
            </Button>
            <DeleteDefectButton id={defect.id} />
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <StatusBadge status={defect.status} />
        <PriorityBadge priority={defect.priority} />
      </div>

      <dl className="grid gap-6 rounded-lg border p-6 sm:grid-cols-2">
        <Field label="Kategorie">{defect.category}</Field>
        <Field label="Verantwortlich">{defect.assignee ?? "–"}</Field>
        <Field label="Erstellt am">{formatDate(defect.createdAt)}</Field>
        <Field label="Fällig am">{formatDate(defect.dueAt)}</Field>
        <div className="sm:col-span-2">
          <Field label="Beschreibung">
            {defect.description ? (
              <p className="whitespace-pre-wrap">{defect.description}</p>
            ) : (
              <span className="text-muted-foreground">
                Keine Beschreibung hinterlegt.
              </span>
            )}
          </Field>
        </div>
      </dl>
    </div>
  );
}
