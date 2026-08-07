import { useAppState } from "@/lib/challenge-state";
import type { Scenario } from "@/data/mockData";

const options: { id: Scenario; label: string }[] = [
  { id: "active", label: "Active streak" },
  { id: "firstDay", label: "Day 1" },
  { id: "missedDay", label: "Missed day" },
  { id: "emptyProfile", label: "No profile" },
];

export function ScenarioSwitcher() {
  const { state, setScenario, reset } = useAppState();

  return (
    <section className="surface p-4" aria-label="Demo state switcher">
      <div className="flex items-center justify-between gap-3">
        <p className="eyebrow">Demo states</p>
        <button
          onClick={reset}
          className="rounded-md px-2 py-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
        >
          Reset progress
        </button>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {options.map((o) => {
          const active = state.scenario === o.id;
          return (
            <button
              key={o.id}
              onClick={() => setScenario(o.id)}
              aria-pressed={active}
              className={`min-h-9 rounded-lg border px-3 text-xs font-medium transition-colors ${
                active
                  ? "border-primary bg-primary/15 text-foreground"
                  : "border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              {o.label}
            </button>
          );
        })}
      </div>
    </section>
  );
}
