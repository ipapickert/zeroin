import { LayoutGrid, List } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export type DefectView = "board" | "list";

const options = [
  { view: "board", label: "Board", icon: LayoutGrid },
  { view: "list", label: "Liste", icon: List },
] as const;

export function ViewToggle({ view }: { view: DefectView }) {
  return (
    <div className="inline-flex rounded-lg border bg-card p-1">
      {options.map((option) => {
        const active = view === option.view;
        return (
          <Link
            key={option.view}
            href={`/defects?view=${option.view}`}
            scroll={false}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
              active
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            <option.icon className="size-4" />
            {option.label}
          </Link>
        );
      })}
    </div>
  );
}
