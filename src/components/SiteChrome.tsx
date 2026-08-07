import { Link } from "@tanstack/react-router";
import { Logo } from "./Logo";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-5">
        <Link to="/" aria-label="ABTalks home" className="flex items-center">
          <Logo className="h-5" />
        </Link>
        <nav className="flex items-center gap-2">
          <a
            href="#how"
            className="hidden rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground sm:inline-flex"
          >
            How it works
          </a>
          <Link
            to="/dashboard"
            className="inline-flex h-9 items-center rounded-lg bg-primary px-3.5 text-sm font-medium text-primary-foreground transition-transform hover:-translate-y-px active:translate-y-0"
          >
            Open dashboard
          </Link>
        </nav>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-border px-5 py-10">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Logo className="h-5" />
        <p className="text-xs text-muted-foreground">
          ABTalks 60-Day Challenge · Built for Indian college students · Demo data only
        </p>
      </div>
    </footer>
  );
}
