import { Badge } from "@/components/ui/badge";
import type { Role } from "@/db/schema";
import { roleLabel } from "@/lib/labels";

/** Neutral badge showing the German role label. */
export function RoleBadge({ role }: { role: Role }) {
  return <Badge variant="outline">{roleLabel(role)}</Badge>;
}
