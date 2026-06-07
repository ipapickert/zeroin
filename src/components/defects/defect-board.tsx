import { DefectCard } from "@/components/defects/defect-card";
import { type Defect, STATUS_VALUES } from "@/db/schema";
import { statusLabel } from "@/lib/labels";
import { STATUS_STYLES } from "@/lib/status-styles";
import { cn } from "@/lib/utils";

/** Kanban board: one column per status. */
export function DefectBoard({ defects }: { defects: Defect[] }) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {STATUS_VALUES.map((status) => {
        const items = defects.filter((d) => d.status === status);
        const style = STATUS_STYLES[status];
        return (
          <section
            key={status}
            className="flex flex-col rounded-xl border bg-muted/30"
          >
            <header
              className={cn(
                "flex items-center justify-between rounded-t-xl border-b px-3.5 py-2.5",
                style.column,
              )}
            >
              <span className="flex items-center gap-2 text-sm font-medium capitalize">
                <span className={cn("size-2 rounded-full", style.dot)} />
                {statusLabel(status)}
              </span>
              <span className="rounded-full bg-background/70 px-2 py-0.5 text-xs font-medium tabular-nums text-muted-foreground">
                {items.length}
              </span>
            </header>

            <div className="flex flex-col gap-2.5 p-2.5">
              {items.length > 0 ? (
                items.map((defect) => (
                  <DefectCard key={defect.id} defect={defect} />
                ))
              ) : (
                <p className="py-10 text-center text-xs text-muted-foreground">
                  Keine Fehler
                </p>
              )}
            </div>
          </section>
        );
      })}
    </div>
  );
}
