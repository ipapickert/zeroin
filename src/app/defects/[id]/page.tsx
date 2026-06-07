import { eq } from "drizzle-orm";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  PriorityBadge,
  StatusBadge,
} from "@/components/defects/defect-badges";
import { DeleteDefectButton } from "@/components/defects/delete-defect-button";
import { DueLabel } from "@/components/defects/due-label";
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
      <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </dt>
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
    <div className="mx-auto max-w-3xl space-y-6">
      <Link
        href="/defects"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Zurück zur Liste
      </Link>

      <div className="flex items-start justify-between gap-4">
        <div className="space-y-3">
          <h1 className="font-display text-2xl font-semibold tracking-tight">
            {defect.title}
          </h1>
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge status={defect.status} />
            <PriorityBadge priority={defect.priority} />
            <DueLabel dueAt={defect.dueAt} status={defect.status} />
          </div>
        </div>
        <div className="flex shrink-0 gap-2">
          <Button
            variant="outline"
            nativeButton={false}
            render={<Link href={`/defects/${defect.id}/edit`} />}
          >
            Bearbeiten
          </Button>
          <DeleteDefectButton id={defect.id} />
        </div>
      </div>

      <dl className="grid gap-6 rounded-xl border bg-card p-6 shadow-sm sm:grid-cols-2">
        <Field label="Kategorie">{defect.category}</Field>
        <Field label="Verantwortlich">{defect.assignee ?? "–"}</Field>
        <Field label="Erstellt am">{formatDate(defect.createdAt)}</Field>
        <Field label="Fällig am">{formatDate(defect.dueAt)}</Field>
        <div className="sm:col-span-2">
          <Field label="Beschreibung">
            {defect.description ? (
              <p className="whitespace-pre-wrap leading-relaxed">
                {defect.description}
              </p>
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
