import { useCallback, useEffect, useState } from "react";
import { students, TOTAL_DAYS, type Scenario, type Student } from "@/data/mockData";

export type Submission = {
  repo: string;
  commit: string;
  linkedin: string;
  at: string;
};

export type AppState = {
  scenario: Scenario;
  submissions: Record<string, Submission>;
};

const KEY = "abtalks.state.v1";
const empty: AppState = { scenario: "active", submissions: {} };

const read = (): AppState => {
  if (typeof window === "undefined") return empty;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return empty;
    const parsed = JSON.parse(raw) as Partial<AppState>;
    return {
      scenario: (parsed.scenario as Scenario) ?? "active",
      submissions: parsed.submissions ?? {},
    };
  } catch {
    return empty;
  }
};

const listeners = new Set<(s: AppState) => void>();
let cache: AppState | null = null;

const write = (next: AppState) => {
  cache = next;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    /* storage unavailable — state still lives in memory */
  }
  listeners.forEach((l) => l(next));
};

export function useAppState() {
  const [state, setState] = useState<AppState>(empty);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    cache = cache ?? read();
    setState(cache);
    setHydrated(true);
    const l = (s: AppState) => setState(s);
    listeners.add(l);
    return () => {
      listeners.delete(l);
    };
  }, []);

  const setScenario = useCallback((scenario: Scenario) => {
    write({ ...(cache ?? empty), scenario });
  }, []);

  const submitDay = useCallback((day: number, submission: Omit<Submission, "at">) => {
    const base = cache ?? empty;
    write({
      ...base,
      submissions: {
        ...base.submissions,
        [String(day)]: { ...submission, at: new Date().toISOString() },
      },
    });
  }, []);

  const reset = useCallback(() => write({ ...empty, scenario: (cache ?? empty).scenario }), []);

  return { state, hydrated, setScenario, submitDay, reset };
}

export type DerivedStudent = Student & {
  progress: number;
  todaySubmitted: boolean;
  displayName: string;
};

export function deriveStudent(state: AppState): DerivedStudent {
  const base = students[state.scenario];
  const todaySubmitted = Boolean(state.submissions[String(base.currentDay)]);
  const completedDays = Math.min(base.completedDays + (todaySubmitted ? 1 : 0), TOTAL_DAYS);
  const streak = todaySubmitted ? base.streak + 1 : base.streak;

  return {
    ...base,
    completedDays,
    streak,
    todaySubmitted,
    progress: Math.round((completedDays / TOTAL_DAYS) * 100),
    displayName: base.profileComplete && base.name ? base.name : "Builder",
  };
}

export const isValidUrl = (value: string, host: string) => {
  try {
    const url = new URL(value.trim());
    return (
      (url.protocol === "https:" || url.protocol === "http:") && url.hostname.includes(host)
    );
  } catch {
    return false;
  }
};
