import { eq } from "drizzle-orm";
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
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          ← Zurück zur Detailansicht
        </Link>
        <h1 className="mt-2 text-2xl font-semibold">Fehler bearbeiten</h1>
      </div>

      <DefectForm
        action={updateDefect}
        defect={defect}
        submitLabel="Speichern"
      />
    </div>
  );
}
