import { cn } from "@/lib/utils";

export type DefectCounts = {
  open: number;
  in_progress: number;
  done: number;
  overdue: number;
};

const tiles = [
  { key: "open", label: "Offen", dot: "bg-amber-500" },
  { key: "in_progress", label: "In Bearbeitung", dot: "bg-blue-500" },
  { key: "done", label: "Erledigt", dot: "bg-emerald-500" },
  { key: "overdue", label: "Überfällig", dot: "bg-red-500" },
] as const;

export function DefectStats({ counts }: { counts: DefectCounts }) {
  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {tiles.map((tile) => (
        <div
          key={tile.key}
          className="rounded-xl border bg-card p-4 shadow-sm"
        >
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className={cn("size-2 rounded-full", tile.dot)} />
            {tile.label}
          </div>
          <div className="mt-2 font-display text-3xl font-semibold tabular-nums">
            {counts[tile.key]}
          </div>
        </div>
      ))}
    </div>
  );
}
