import type { Priority } from "@/db/schema";

/**
 * Semantic colours per priority (low = green, medium = yellow, high = red).
 * Same structure as STATUS_STYLES in status-styles.ts.
 */
type PriorityStyle = {
  /** Small filled badge (e.g. in the table / cards). */
  badge: string;
  /** Coloured dot. */
  dot: string;
};

export const PRIORITY_STYLES: Record<Priority, PriorityStyle> = {
  low: {
    badge:
      "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-500/15 dark:text-emerald-300 dark:border-emerald-500/25",
    dot: "bg-emerald-500",
  },
  medium: {
    badge:
      "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-500/15 dark:text-yellow-300 dark:border-yellow-500/25",
    dot: "bg-yellow-500",
  },
  high: {
    badge:
      "bg-red-100 text-red-700 border-red-200 dark:bg-red-500/15 dark:text-red-300 dark:border-red-500/25",
    dot: "bg-red-500",
  },
};
