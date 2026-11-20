import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import Link from "next/link";
import { PriorityBadge, StatusBadge } from "@/components/defects/defect-badges";
import { DueLabel } from "@/components/defects/due-label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Defect } from "@/db/schema";
import {
  type DefectSort,
  nextDefectSort,
  type SortKey,
} from "@/lib/defect-sort";
import { cn } from "@/lib/utils";

const COLUMNS: { key: SortKey; label: string }[] = [
  { key: "title", label: "Titel" },
  { key: "category", label: "Kategorie" },
  { key: "status", label: "Status" },
  { key: "priority", label: "Priorität" },
  { key: "assignee", label: "Verantwortlich" },
  { key: "dueAt", label: "Fälligkeit" },
];

/** URL of the list view with the given sort (none = default order). */
function sortHref(sort: DefectSort): string {
  if (!sort) return "/defects?view=list";
  return `/defects?view=list&sort=${sort.key}&dir=${sort.direction}`;
}

/** Column header that sorts the table when clicked. */
function SortableHead({
  column,
  sort,
}: {
  column: { key: SortKey; label: string };
  sort: DefectSort;
}) {
  const active = sort?.key === column.key;
  const Icon = !active
    ? ArrowUpDown
    : sort.direction === "asc"
      ? ArrowUp
      : ArrowDown;

  return (
    <TableHead
      aria-sort={
        active
          ? sort.direction === "asc"
            ? "ascending"
            : "descending"
          : undefined
      }
    >
      <Link
        href={sortHref(nextDefectSort(sort, column.key))}
        scroll={false}
        className={cn(
          "inline-flex items-center gap-1 transition-colors hover:text-foreground",
          active && "text-foreground",
        )}
      >
        {column.label}
        <Icon
          className={cn("size-3.5", active ? "text-primary" : "opacity-40")}
        />
      </Link>
    </TableHead>
  );
}

/** Refined data table of defects; column headers sort the list. */
export function DefectsTable({
  defects,
  sort,
}: {
  defects: Defect[];
  sort: DefectSort;
}) {
  return (
    <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            {COLUMNS.map((column) => (
              <SortableHead key={column.key} column={column} sort={sort} />
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {defects.map((defect) => (
            <TableRow key={defect.id} className="group">
              <TableCell className="font-medium">
                <Link
                  href={`/defects/${defect.id}`}
                  className="transition-colors group-hover:text-primary"
                >
                  {defect.title}
                </Link>
              </TableCell>
              <TableCell className="text-muted-foreground">
                {defect.category}
              </TableCell>
              <TableCell>
                <StatusBadge status={defect.status} />
              </TableCell>
              <TableCell>
                <PriorityBadge priority={defect.priority} />
              </TableCell>
              <TableCell className="text-muted-foreground">
                {defect.assignee ?? "–"}
              </TableCell>
              <TableCell>
                <DueLabel dueAt={defect.dueAt} status={defect.status} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
