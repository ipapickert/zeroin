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
 * Returns a sorted copy of `defects`. Ties are broken by "newest first",
 * the default order of the list.
 */
export function sortDefects(defects: Defect[], sort: DefectSort): Defect[] {
  if (!sort) return defects;
  const factor = sort.direction === "asc" ? 1 : -1;

  return [...defects].sort((a, b) => {
    const valueA = sortValue(a, sort.key);
    const valueB = sortValue(b, sort.key);

    // Empty values always last, regardless of direction.
    if (valueA === null && valueB !== null) return 1;
    if (valueA !== null && valueB === null) return -1;

    if (valueA !== null && valueB !== null) {
      const result = compareValues(valueA, valueB);
      if (result !== 0) return result * factor;
    }
    return b.createdAt.getTime() - a.createdAt.getTime();
  });
}
