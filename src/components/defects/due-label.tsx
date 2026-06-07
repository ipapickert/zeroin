import { TriangleAlert } from "lucide-react";
import type { Status } from "@/db/schema";
import { dueInfo } from "@/lib/format";
import { cn } from "@/lib/utils";

/** Relative due-date label; turns red with a warning icon when overdue. */
export function DueLabel({
  dueAt,
  status,
  className,
}: {
  dueAt: Date | null;
  status: Status;
  className?: string;
}) {
  const { label, overdue } = dueInfo(dueAt, status);
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 text-xs",
        overdue
          ? "font-medium text-red-600 dark:text-red-400"
          : "text-muted-foreground",
        className,
      )}
    >
      {overdue ? <TriangleAlert className="size-3.5" /> : null}
      {label}
    </span>
  );
}
