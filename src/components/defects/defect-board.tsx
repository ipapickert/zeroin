"use client";

import { startTransition, useOptimistic, useState } from "react";
import { moveDefect } from "@/actions/defects";
import { DefectCard } from "@/components/defects/defect-card";
import { type Defect, type Status, STATUS_VALUES } from "@/db/schema";
import { statusLabel } from "@/lib/labels";
import { STATUS_STYLES } from "@/lib/status-styles";
import { cn } from "@/lib/utils";

/**
 * Kanban board: one column per status. Cards can be dragged between columns
 * to change their status (native HTML5 drag & drop, no extra library).
 */
export function DefectBoard({ defects }: { defects: Defect[] }) {
  // A dropped card moves instantly; once the server action revalidates
  // `/defects`, the optimistic state resets to the fresh server data.
  const [items, applyMove] = useOptimistic(
    defects,
    (state, move: { id: number; status: Status }) =>
      state.map((d) => (d.id === move.id ? { ...d, status: move.status } : d)),
  );
  const [draggingId, setDraggingId] = useState<number | null>(null);
  const [overStatus, setOverStatus] = useState<Status | null>(null);

  function handleDrop(status: Status) {
    const id = draggingId;
    setDraggingId(null);
    setOverStatus(null);
    if (id == null) return;

    const defect = items.find((d) => d.id === id);
    if (!defect || defect.status === status) return;

    startTransition(async () => {
      applyMove({ id, status });
      await moveDefect(id, status);
    });
  }

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {STATUS_VALUES.map((status) => {
        const columnItems = items.filter((d) => d.status === status);
        const style = STATUS_STYLES[status];
        const isOver = overStatus === status;
        return (
          <section
            key={status}
            onDragOver={(e) => {
              e.preventDefault();
              if (overStatus !== status) setOverStatus(status);
            }}
            onDragLeave={(e) => {
              // Only clear when the cursor truly leaves the column.
              if (!e.currentTarget.contains(e.relatedTarget as Node)) {
                setOverStatus((s) => (s === status ? null : s));
              }
            }}
            onDrop={() => handleDrop(status)}
            className={cn(
              "flex flex-col rounded-xl border bg-muted/30 transition-colors",
              isOver && "border-primary/50 bg-primary/5",
            )}
          >
            <header
              className={cn(
                "flex items-center justify-between rounded-t-xl border-b px-3.5 py-2.5",
                style.column,
              )}
            >
              <span className="flex items-center gap-2 text-sm font-medium capitalize">
                <span className={cn("size-2 rounded-full", style.dot)} />
                {statusLabel(status)}
              </span>
              <span className="rounded-full bg-background/70 px-2 py-0.5 text-xs font-medium tabular-nums text-muted-foreground">
                {columnItems.length}
              </span>
            </header>

            <div className="flex flex-col gap-2.5 p-2.5">
              {columnItems.length > 0 ? (
                columnItems.map((defect) => (
                  <div
                    key={defect.id}
                    draggable
                    onDragStart={() => setDraggingId(defect.id)}
                    onDragEnd={() => {
                      setDraggingId(null);
                      setOverStatus(null);
                    }}
                    className={cn(
                      "cursor-grab active:cursor-grabbing",
                      draggingId === defect.id && "opacity-50",
                    )}
                  >
                    <DefectCard defect={defect} />
                  </div>
                ))
              ) : (
                <p className="py-10 text-center text-xs text-muted-foreground">
                  Keine Fehler
                </p>
              )}
            </div>
          </section>
        );
      })}
    </div>
  );
}
