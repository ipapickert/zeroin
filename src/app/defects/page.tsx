import { desc } from "drizzle-orm";
import Link from "next/link";
import {
  PriorityBadge,
  StatusBadge,
} from "@/components/defects/defect-badges";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { db } from "@/db";
import { defects } from "@/db/schema";
import { formatDate } from "@/lib/format";

// Always read the current database state instead of a build-time snapshot.
export const dynamic = "force-dynamic";

export default async function DefectsPage() {
  const rows = await db
    .select()
    .from(defects)
    .orderBy(desc(defects.createdAt));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Fehler</h1>
          <p className="text-sm text-muted-foreground">
            {rows.length} {rows.length === 1 ? "Eintrag" : "Einträge"}
          </p>
        </div>
        <Button nativeButton={false} render={<Link href="/defects/new" />}>
          Neuer Fehler
        </Button>
      </div>

      {rows.length === 0 ? (
        <div className="rounded-lg border border-dashed p-12 text-center text-muted-foreground">
          Noch keine Fehler erfasst. Lege den ersten an oder spiele die
          Beispieldaten ein (<code>npm run db:seed</code>).
        </div>
      ) : (
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Titel</TableHead>
                <TableHead>Kategorie</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Priorität</TableHead>
                <TableHead>Verantwortlich</TableHead>
                <TableHead>Fällig am</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((defect) => (
                <TableRow key={defect.id}>
                  <TableCell className="font-medium">
                    <Link
                      href={`/defects/${defect.id}`}
                      className="hover:underline"
                    >
                      {defect.title}
                    </Link>
                  </TableCell>
                  <TableCell>{defect.category}</TableCell>
                  <TableCell>
                    <StatusBadge status={defect.status} />
                  </TableCell>
                  <TableCell>
                    <PriorityBadge priority={defect.priority} />
                  </TableCell>
                  <TableCell>{defect.assignee ?? "–"}</TableCell>
                  <TableCell>{formatDate(defect.dueAt)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
