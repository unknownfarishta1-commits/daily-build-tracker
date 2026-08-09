import { Link } from "@tanstack/react-router";
import { Logo } from "./Logo";
import { useAppState } from "@/lib/challenge-state";

export function SiteHeader() {
  const { state } = useAppState();
  
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-5">
        <Link 
          to={state.isLoggedIn ? "/dashboard" : "/"} 
          aria-label="ABTalks home" 
          className="flex items-center"
        >
          <Logo className="h-5" />
        </Link>
        <nav className="flex items-center gap-4">
          <a
            href="#how"
            className="hidden rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground sm:inline-flex"
          >
            How it works
          </a>
          <div className="flex items-center gap-2">
            {!state.isLoggedIn ? (
              <Link
                to="/login"
                className="hidden h-9 items-center rounded-lg px-3.5 text-sm font-medium text-foreground transition-colors hover:bg-secondary sm:inline-flex"
              >
                Sign In
              </Link>
            ) : null}
            <Link
              to="/dashboard"
              className="inline-flex h-9 items-center rounded-lg bg-primary px-3.5 text-sm font-medium text-primary-foreground transition-transform hover:-translate-y-px active:translate-y-0"
            >
              {state.isLoggedIn ? "Open dashboard" : "Get Started"}
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}

export function SiteFooter() {
  const { state } = useAppState();
  
  return (
    <footer className="border-t border-border px-5 py-10">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Link to={state.isLoggedIn ? "/dashboard" : "/"} className="flex items-center">
          <Logo className="h-5" />
        </Link>
        <p className="text-xs text-muted-foreground">
          ABTalks 60-Day Challenge · Built for Indian college students · Demo data only
        </p>
      </div>
    </footer>
  );
}
