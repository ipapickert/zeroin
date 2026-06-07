"use client";

import { Bug, Target } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/utils";

const nav = [{ href: "/defects", label: "Fehler", icon: Bug }];

function Brand() {
  return (
    <Link href="/defects" className="flex items-center gap-2.5">
      <span className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
        <Target className="size-5" />
      </span>
      <span className="flex flex-col leading-none">
        <span className="font-display text-lg font-semibold tracking-tight">
          zeroin
        </span>
        <span className="text-xs text-muted-foreground">Fehler-Tracker</span>
      </span>
    </Link>
  );
}

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <aside className="sticky top-0 hidden h-svh w-60 shrink-0 flex-col border-r bg-sidebar px-4 py-5 md:flex">
      <Brand />

      <nav className="mt-8 flex flex-1 flex-col gap-1">
        {nav.map((item) => {
          const active = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                active
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              <item.icon className="size-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="flex items-center justify-between border-t pt-4">
        <span className="text-xs text-muted-foreground">lokal · privat</span>
        <ThemeToggle />
      </div>
    </aside>
  );
}

export function MobileTopbar() {
  return (
    <header className="flex items-center justify-between border-b px-4 py-3 md:hidden">
      <Brand />
      <ThemeToggle />
    </header>
  );
}
