"use client";

import { TriangleAlert } from "lucide-react";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { OVERDUE_STYLE } from "@/lib/status-styles";

/**
 * Warn-Popup auf der Detailseite. Öffnet sich beim Aufruf der Seite von selbst;
 * die Seite rendert es nur, wenn der Fehler überfällig ist.
 */
export function OverdueWarningDialog({
  dueDate,
  overdueLabel,
}: {
  /** Fälligkeit, bereits formatiert, z. B. "17.11.2026". */
  dueDate: string;
  /** Text aus dueInfo, z. B. "3 Tage überfällig". */
  overdueLabel: string;
}) {
  return (
    <AlertDialog defaultOpen>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogMedia className={OVERDUE_STYLE.media}>
            <TriangleAlert className={OVERDUE_STYLE.text} />
          </AlertDialogMedia>
          <AlertDialogTitle>Dieser Fehler ist überfällig</AlertDialogTitle>
          <AlertDialogDescription>
            Die Fälligkeit war am {dueDate} ({overdueLabel}). Bitte kümmere
            dich darum oder passe das Fälligkeitsdatum an.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Verstanden</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
