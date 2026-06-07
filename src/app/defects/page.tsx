import { desc } from "drizzle-orm";
import { Plus } from "lucide-react";
import Link from "next/link";
import { DefectBoard } from "@/components/defects/defect-board";
import {
  type DefectCounts,
  DefectStats,
} from "@/components/defects/defect-stats";
import { DefectsTable } from "@/components/defects/defects-table";
import {
  type DefectView,
  ViewToggle,
} from "@/components/defects/view-toggle";
import { Button } from "@/components/ui/button";
import { db } from "@/db";
import { defects } from "@/db/schema";
import { dueInfo } from "@/lib/format";

// Always read the current database state instead of a build-time snapshot.
export const dynamic = "force-dynamic";

export default async function DefectsPage({
  searchParams,
}: PageProps<"/defects">) {
  const { view: viewParam } = await searchParams;
  const view: DefectView = viewParam === "list" ? "list" : "board";

  const rows = await db
    .select()
    .from(defects)
    .orderBy(desc(defects.createdAt));

  const counts: DefectCounts = {
    open: rows.filter((d) => d.status === "open").length,
    in_progress: rows.filter((d) => d.status === "in_progress").length,
    done: rows.filter((d) => d.status === "done").length,
    overdue: rows.filter((d) => dueInfo(d.dueAt, d.status).overdue).length,
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-semibold tracking-tight">
            Fehler
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {rows.length} {rows.length === 1 ? "Eintrag" : "Einträge"} · Überblick
            über alle erfassten Fehler
          </p>
        </div>
        <Button nativeButton={false} render={<Link href="/defects/new" />}>
          <Plus className="size-4" />
          Neuer Fehler
        </Button>
      </div>

      <DefectStats counts={counts} />

      {rows.length === 0 ? (
        <div className="rounded-xl border border-dashed p-12 text-center text-muted-foreground">
          Noch keine Fehler erfasst. Lege den ersten an oder spiele die
          Beispieldaten ein (<code className="font-mono">npm run db:seed</code>).
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex justify-end">
            <ViewToggle view={view} />
          </div>
          {view === "board" ? (
            <DefectBoard defects={rows} />
          ) : (
            <DefectsTable defects={rows} />
          )}
        </div>
      )}
    </div>
  );
}
