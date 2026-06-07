import {
  type Priority,
  PRIORITY_VALUES,
  type Status,
  STATUS_VALUES,
} from "@/db/schema";

/**
 * Label-Map: English enum keys -> German UI text.
 *
 * The database always stores the English key (e.g. `open`). Everything the
 * user sees goes through these maps (e.g. `open` -> "offen"). Separating the
 * stored key from its display text is a deliberate teaching example.
 */

export const STATUS_LABELS: Record<Status, string> = {
  open: "offen",
  in_progress: "in Bearbeitung",
  done: "erledigt",
};

export const PRIORITY_LABELS: Record<Priority, string> = {
  low: "niedrig",
  medium: "mittel",
  high: "hoch",
};

export function statusLabel(status: Status): string {
  return STATUS_LABELS[status];
}

export function priorityLabel(priority: Priority): string {
  return PRIORITY_LABELS[priority];
}

/** Options for <select> inputs: { value: englishKey, label: germanText }. */
export const STATUS_OPTIONS = STATUS_VALUES.map((value) => ({
  value,
  label: STATUS_LABELS[value],
}));

export const PRIORITY_OPTIONS = PRIORITY_VALUES.map((value) => ({
  value,
  label: PRIORITY_LABELS[value],
}));
