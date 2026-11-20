import { StatusBadge } from "@/components/defects/defect-badges";
import type { Measure } from "@/db/schema";
import { formatDate } from "@/lib/format";
import { measureTypeLabel } from "@/lib/labels";

/**
 * Liste der Maßnahmen eines Fehlers (Phase 1: nur anzeigen).
 * Sortierung, Bearbeiten und Löschen folgen in Phase 2.
 */
export function MeasureList({ measures }: { measures: Measure[] }) {
  if (measures.length === 0) return null;

  return (
    <ul className="divide-y rounded-lg border">
      {measures.map((measure) => (
        <li
          key={measure.id}
          className="flex flex-wrap items-center justify-between gap-3 p-4"
        >
          <div className="space-y-1">
            <p className="text-sm font-medium">{measure.title}</p>
            <p className="text-xs text-muted-foreground">
              {measureTypeLabel(measure.type)} · Verantwortlich:{" "}
              {measure.assignee ?? "–"} · Fällig am: {formatDate(measure.dueAt)}
            </p>
          </div>
          <StatusBadge status={measure.status} />
        </li>
      ))}
    </ul>
  );
}
