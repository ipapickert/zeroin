import Link from "next/link";
import { createDefect } from "@/actions/defects";
import { DefectForm } from "@/components/defects/defect-form";

export default function NewDefectPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <Link
          href="/defects"
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          ← Zurück zur Liste
        </Link>
        <h1 className="mt-2 text-2xl font-semibold">Neuen Fehler anlegen</h1>
      </div>

      <DefectForm action={createDefect} submitLabel="Anlegen" />
    </div>
  );
}
