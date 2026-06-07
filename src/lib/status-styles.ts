import type { Status } from "@/db/schema";

/**
 * Semantic colours per status. Used by badges, the board columns and dots.
 * (Priority colouring is intentionally left out — that is the first course
 * exercise, see CLAUDE.md.)
 */
type StatusStyle = {
  /** Small filled badge (e.g. in the table / cards). */
  badge: string;
  /** Coloured dot. */
  dot: string;
  /** Subtle tint for a board column header. */
  column: string;
  /** Accent text colour. */
  text: string;
};

export const STATUS_STYLES: Record<Status, StatusStyle> = {
  open: {
    badge:
      "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-500/15 dark:text-amber-300 dark:border-amber-500/25",
    dot: "bg-amber-500",
    column: "bg-amber-50 dark:bg-amber-500/10",
    text: "text-amber-600 dark:text-amber-400",
  },
  in_progress: {
    badge:
      "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-500/15 dark:text-blue-300 dark:border-blue-500/25",
    dot: "bg-blue-500",
    column: "bg-blue-50 dark:bg-blue-500/10",
    text: "text-blue-600 dark:text-blue-400",
  },
  done: {
    badge:
      "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-500/15 dark:text-emerald-300 dark:border-emerald-500/25",
    dot: "bg-emerald-500",
    column: "bg-emerald-50 dark:bg-emerald-500/10",
    text: "text-emerald-600 dark:text-emerald-400",
  },
};
