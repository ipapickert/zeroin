import { type Defect, type Priority, STATUS_VALUES } from "@/db/schema";

/**
 * Sorting for the defects table (list view).
 *
 * The sort lives in the URL (`?sort=priority&dir=asc`), so it survives a
 * reload and can be shared as a link. Without a sort the list keeps its
 * default order: newest first.
 *
 * "asc" always means "the most useful order first": titles A–Z, open before
 * done, high priority before low, earliest due date first. Empty values
 * (no assignee, no due date) always go to the end, in both directions.
 *
 * Rows with the same value are ordered by a fixed second criterion per
 * column (see SECONDARY_KEY), then by "newest first".
 */

export const SORT_KEYS = [
  "title",
  "category",
  "status",
  "priority",
  "assignee",
  "dueAt",
] as const;

export type SortKey = (typeof SORT_KEYS)[number];
export type SortDirection = "asc" | "desc";
export type DefectSort = { key: SortKey; direction: SortDirection } | null;

/** Reads `sort` and `dir` from the URL; anything unknown means "no sort". */
export function parseDefectSort(sort: unknown, dir: unknown): DefectSort {
  if (!SORT_KEYS.includes(sort as SortKey)) return null;
  return {
    key: sort as SortKey,
    direction: dir === "desc" ? "desc" : "asc",
  };
}

/** Next state when a column header is clicked: none → asc → desc → none. */
export function nextDefectSort(current: DefectSort, key: SortKey): DefectSort {
  if (current?.key !== key) return { key, direction: "asc" };
  if (current.direction === "asc") return { key, direction: "desc" };
  return null;
}

// High priority first, so "asc" puts the important defects on top.
const PRIORITY_RANK: Record<Priority, number> = {
  high: 0,
  medium: 1,
  low: 2,
};

type SortValue = string | number | null;

/** The value a column is sorted by; `null` means "empty". */
function sortValue(defect: Defect, key: SortKey): SortValue {
  switch (key) {
    case "title":
      return defect.title;
    case "category":
      return defect.category;
    case "assignee":
      return defect.assignee?.trim() || null;
    case "status":
      return STATUS_VALUES.indexOf(defect.status);
    case "priority":
      return PRIORITY_RANK[defect.priority];
    case "dueAt":
      return defect.dueAt ? defect.dueAt.getTime() : null;
  }
}

function compareValues(a: SortValue, b: SortValue): number {
  if (typeof a === "string" && typeof b === "string") {
    return a.localeCompare(b, "de", { sensitivity: "base" });
  }
  return (a as number) - (b as number);
}

/**
 * Compares two defects by one column. `factor` is 1 (asc) or -1 (desc).
 * Empty values always go last, regardless of direction.
 */
function compareByKey(
  a: Defect,
  b: Defect,
  key: SortKey,
  factor: 1 | -1,
): number {
  const valueA = sortValue(a, key);
  const valueB = sortValue(b, key);

  if (valueA === null && valueB === null) return 0;
  if (valueA === null) return 1;
  if (valueB === null) return -1;
  return compareValues(valueA, valueB) * factor;
}

/**
 * Second criterion for rows with the same value in the sorted column.
 * It always runs in its own "useful" order (high priority first, earliest
 * due date first) and does not flip with the main direction, so the
 * important defects stay on top.
 */
const SECONDARY_KEY: Record<SortKey, SortKey | null> = {
  title: null,
  category: "priority",
  status: "priority",
  assignee: "priority",
  dueAt: "priority",
  priority: "dueAt",
};

/**
 * Returns a sorted copy of `defects`: by the chosen column, then by the
 * column's second criterion, then "newest first" (the default order).
 */
export function sortDefects(defects: Defect[], sort: DefectSort): Defect[] {
  if (!sort) return defects;
  const factor = sort.direction === "asc" ? 1 : -1;
  const secondaryKey = SECONDARY_KEY[sort.key];

  return [...defects].sort((a, b) => {
    const main = compareByKey(a, b, sort.key, factor);
    if (main !== 0) return main;

    if (secondaryKey) {
      const secondary = compareByKey(a, b, secondaryKey, 1);
      if (secondary !== 0) return secondary;
    }

    return b.createdAt.getTime() - a.createdAt.getTime();
  });
}
