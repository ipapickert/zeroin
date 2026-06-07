import type { Status } from "@/db/schema";

/** German date formatting helpers for the UI. */

const dateFormatter = new Intl.DateTimeFormat("de-DE", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});

/** Formats a date as e.g. "07.06.2026". Returns "–" for empty values. */
export function formatDate(value: Date | null | undefined): string {
  if (!value) return "–";
  return dateFormatter.format(value);
}

const MS_PER_DAY = 24 * 60 * 60 * 1000;

function startOfDay(date: Date): number {
  return new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
  ).getTime();
}

export type DueInfo = {
  /** Short German label, e.g. "in 3 Tagen fällig" or "2 Tage überfällig". */
  label: string;
  /** True only when past due AND the defect is not done. */
  overdue: boolean;
};

/**
 * Human-friendly due-date label relative to today. A defect counts as overdue
 * only if its due date is in the past and it is not yet done.
 */
export function dueInfo(
  dueAt: Date | null | undefined,
  status: Status,
): DueInfo {
  if (!dueAt) return { label: "kein Datum", overdue: false };

  const diffDays = Math.round(
    (startOfDay(dueAt) - startOfDay(new Date())) / MS_PER_DAY,
  );

  if (status === "done") {
    return { label: `fällig war ${formatDate(dueAt)}`, overdue: false };
  }
  if (diffDays < 0) {
    const n = Math.abs(diffDays);
    return { label: `${n} ${n === 1 ? "Tag" : "Tage"} überfällig`, overdue: true };
  }
  if (diffDays === 0) return { label: "heute fällig", overdue: false };
  if (diffDays === 1) return { label: "morgen fällig", overdue: false };
  return { label: `in ${diffDays} Tagen fällig`, overdue: false };
}

/** Formats a Date as "YYYY-MM-DD" for <input type="date"> default values. */
export function toDateInputValue(value: Date | null | undefined): string {
  if (!value) return "";
  const year = value.getFullYear();
  const month = String(value.getMonth() + 1).padStart(2, "0");
  const day = String(value.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}
