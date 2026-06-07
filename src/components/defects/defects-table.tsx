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

/** Refined data table of defects. */
export function DefectsTable({ defects }: { defects: Defect[] }) {
  return (
    <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead>Titel</TableHead>
            <TableHead>Kategorie</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Priorität</TableHead>
            <TableHead>Verantwortlich</TableHead>
            <TableHead>Fälligkeit</TableHead>
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
