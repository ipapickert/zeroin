import type { Priority, Status } from "@/db/schema";
import { priorityLabel, statusLabel } from "@/lib/labels";
import { PRIORITY_STYLES } from "@/lib/priority-styles";
import { STATUS_STYLES } from "@/lib/status-styles";
import { cn } from "@/lib/utils";

/**
 * Coloured status badge with a leading dot (colours from STATUS_STYLES).
 */
export function StatusBadge({
  status,
  className,
}: {
  status: Status;
  className?: string;
}) {
  const style = STATUS_STYLES[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium",
        style.badge,
        className,
      )}
    >
      <span className={cn("size-1.5 rounded-full", style.dot)} />
      {statusLabel(status)}
    </span>
  );
}

/**
 * Coloured priority badge with a leading dot (colours from PRIORITY_STYLES).
 */
export function PriorityBadge({
  priority,
  className,
}: {
  priority: Priority;
  className?: string;
}) {
  const style = PRIORITY_STYLES[priority];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium",
        style.badge,
        className,
      )}
    >
      <span className={cn("size-1.5 rounded-full", style.dot)} />
      {priorityLabel(priority)}
    </span>
  );
}
