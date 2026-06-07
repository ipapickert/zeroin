import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="border-b">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
        <Link href="/defects" className="font-semibold">
          zeroin <span className="text-muted-foreground">· Fehler-Tracker</span>
        </Link>
        <nav className="text-sm text-muted-foreground">
          <Link href="/defects" className="hover:text-foreground">
            Fehler
          </Link>
        </nav>
      </div>
    </header>
  );
}
