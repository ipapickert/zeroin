import Link from "next/link";
import { PriorityBadge } from "@/components/defects/defect-badges";
import { DueLabel } from "@/components/defects/due-label";
import type { Defect } from "@/db/schema";

/** A single defect as a board card. */
export function DefectCard({ defect }: { defect: Defect }) {
  return (
    <Link
      href={`/defects/${defect.id}`}
      className="group block rounded-xl border bg-card p-3.5 shadow-sm transition-all hover:border-primary/40 hover:shadow-md"
    >
      <h3 className="line-clamp-2 font-medium leading-snug transition-colors group-hover:text-primary">
        {defect.title}
      </h3>

      <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
        <span className="rounded-md bg-muted px-1.5 py-0.5 text-xs text-muted-foreground">
          {defect.category}
        </span>
        <PriorityBadge priority={defect.priority} />
      </div>

      <div className="mt-3 flex items-center justify-between gap-2 border-t pt-2.5">
        <span className="truncate text-xs text-muted-foreground">
          {defect.assignee ?? "–"}
        </span>
        <DueLabel dueAt={defect.dueAt} status={defect.status} />
      </div>
    </Link>
  );
}
