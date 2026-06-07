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

/** Formats a Date as "YYYY-MM-DD" for <input type="date"> default values. */
export function toDateInputValue(value: Date | null | undefined): string {
  if (!value) return "";
  const year = value.getFullYear();
  const month = String(value.getMonth() + 1).padStart(2, "0");
  const day = String(value.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}
