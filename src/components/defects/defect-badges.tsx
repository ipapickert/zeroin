import { Badge } from "@/components/ui/badge";
import type { Priority, Status } from "@/db/schema";
import { priorityLabel, statusLabel } from "@/lib/labels";

/**
 * Plain badges showing the German label for a status / priority key.
 *
 * Note: colouring the priority badges by value is intentionally left as the
 * first course exercise ("Prioritäts-Badges einfärben"), so these stay neutral.
 */

export function StatusBadge({ status }: { status: Status }) {
  return <Badge variant="secondary">{statusLabel(status)}</Badge>;
}

export function PriorityBadge({ priority }: { priority: Priority }) {
  return <Badge variant="outline">{priorityLabel(priority)}</Badge>;
}
