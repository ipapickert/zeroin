import { eq } from "drizzle-orm";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { updateDefect } from "@/actions/defects";
import { DefectForm } from "@/components/defects/defect-form";
import { db } from "@/db";
import { defects } from "@/db/schema";

export default async function EditDefectPage({
  params,
}: PageProps<"/defects/[id]/edit">) {
  const { id } = await params;
  const defect = await db.query.defects.findFirst({
    where: eq(defects.id, Number(id)),
  });

  if (!defect) notFound();

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <Link
          href={`/defects/${defect.id}`}
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Zurück zur Detailansicht
        </Link>
        <h1 className="mt-3 font-display text-2xl font-semibold tracking-tight">
          Fehler bearbeiten
        </h1>
      </div>

      <div className="rounded-xl border bg-card p-6 shadow-sm">
        <DefectForm
          action={updateDefect}
          defect={defect}
          submitLabel="Speichern"
        />
      </div>
    </div>
  );
}
