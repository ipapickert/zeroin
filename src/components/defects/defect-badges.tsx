import { Badge } from "@/components/ui/badge";
import type { Priority, Status } from "@/db/schema";
import { priorityLabel, statusLabel } from "@/lib/labels";
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
 * Priority badge — intentionally neutral. Colouring it by value is the first
 * course exercise ("Prioritäts-Badges einfärben"), so it stays plain here.
 */
export function PriorityBadge({ priority }: { priority: Priority }) {
  return <Badge variant="outline">{priorityLabel(priority)}</Badge>;
}
