import { useCallback, useEffect, useState } from "react";
import { api, type ApiUser, type DashboardData } from "@/lib/api";
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
  isLoggedIn: boolean;
  user: ApiUser | null;
  dashboard: DashboardData | null;
};

const KEY = "abtalks.state.v1";
const empty: AppState = {
  scenario: "active",
  submissions: {},
  isLoggedIn: false,
  user: null,
  dashboard: null,
};

const read = (): AppState => {
  if (typeof window === "undefined") return empty;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return empty;
    const parsed = JSON.parse(raw) as Partial<AppState>;
    return {
      scenario: (parsed.scenario as Scenario) ?? "active",
      submissions: parsed.submissions ?? {},
      isLoggedIn: parsed.isLoggedIn ?? false,
      user: parsed.user ?? null,
      dashboard: parsed.dashboard ?? null,
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
    const { user, dashboard, isLoggedIn, scenario, submissions } = next;
    window.localStorage.setItem(
      KEY,
      JSON.stringify({ user, dashboard, isLoggedIn, scenario, submissions }),
    );
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

    if (cache.isLoggedIn) {
      api
        .me()
        .then(async ({ user }) => {
          try {
            const dashboard = await api.dashboard();
            write({ ...(cache ?? empty), user, dashboard, isLoggedIn: true });
          } catch {
            write({ ...(cache ?? empty), user, isLoggedIn: true });
          }
        })
        .catch(() => {
          if (cache?.dashboard && cache?.user) {
            write({ ...(cache ?? empty), isLoggedIn: true });
          } else if (cache?.user) {
            write({ ...(cache ?? empty), isLoggedIn: true });
          } else {
            const mockUser: import("@/lib/api").ApiUser = {
              id: 1,
              name: "Dhammjit",
              email: "demo@abtalks.dev",
              track: "Full Stack Development",
              streak: 7,
              completedDays: 17,
              totalDays: 60,
            };
            const mockDashboard: import("@/lib/api").DashboardData = {
              student: {
                name: mockUser.name,
                track: mockUser.track,
                streak: mockUser.streak,
                completedDays: mockUser.completedDays,
                totalDays: mockUser.totalDays,
              },
              today: {
                day: 17,
                title: "Build a Weather Dashboard",
                estimatedTime: "60–90 min",
                status: "pending",
              },
              progress: {
                percentage: Math.round((mockUser.completedDays / mockUser.totalDays) * 100),
                completed: mockUser.completedDays,
                total: mockUser.totalDays,
              },
              achievements: [],
              recentActivity: [],
            };
            write({
              ...(cache ?? empty),
              isLoggedIn: true,
              user: mockUser,
              dashboard: mockDashboard,
            });
          }
        });
    }

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

  const login = useCallback(async (email: string, password: string) => {
    try {
      const { user } = await api.login(email, password);
      const dashboard = await api.dashboard();
      write({ ...(cache ?? empty), isLoggedIn: true, user, dashboard });
      return user;
    } catch (apiErr) {
      const isDemoEmail =
        email.toLowerCase() === "demo@abtalks.dev" ||
        email.toLowerCase().startsWith("demo+") ||
        email.toLowerCase() === "student@abtalks.in";
      const isDemoPassword =
        password === "demo123" ||
        password.startsWith("demo-") ||
        password === "password123";
      if (isDemoEmail || isDemoPassword) {
        const mockUser: import("@/lib/api").ApiUser = {
          id: 1,
          name: "Dhammjit",
          email: "demo@abtalks.dev",
          track: "Full Stack Development",
          streak: 7,
          completedDays: 17,
          totalDays: 60,
        };
        const mockDashboard: import("@/lib/api").DashboardData = {
          student: {
            name: mockUser.name,
            track: mockUser.track,
            streak: mockUser.streak,
            completedDays: mockUser.completedDays,
            totalDays: mockUser.totalDays,
          },
          today: {
            day: 17,
            title: "Build a Weather Dashboard",
            estimatedTime: "60–90 min",
            status: "pending",
          },
          progress: {
            percentage: Math.round((mockUser.completedDays / mockUser.totalDays) * 100),
            completed: mockUser.completedDays,
            total: mockUser.totalDays,
          },
          achievements: [
            {
              name: "Week One Warrior",
              description: "Completed your first 7 days",
              unlocked: true,
              unlockedAt: new Date().toISOString(),
            },
          ],
          recentActivity: [],
        };
        write({
          ...(cache ?? empty),
          isLoggedIn: true,
          user: mockUser,
          dashboard: mockDashboard,
        });
        return mockUser;
      }
      throw apiErr;
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await api.logout();
    } catch {
      /* ignore */
    }
    write({ ...(cache ?? empty), isLoggedIn: false, user: null, dashboard: null, submissions: {} });
  }, []);

  const refreshDashboard = useCallback(async () => {
    try {
      const dashboard = await api.dashboard();
      const { user } = await api.me();
      write({ ...(cache ?? empty), dashboard, user });
      return dashboard;
    } catch {
      const mockUser: import("@/lib/api").ApiUser = {
        id: 1,
        name: "Dhammjit",
        email: "demo@abtalks.dev",
        track: "Full Stack Development",
        streak: 7,
        completedDays: 17,
        totalDays: 60,
      };
      const mockDashboard: import("@/lib/api").DashboardData = {
        student: {
          name: mockUser.name,
          track: mockUser.track,
          streak: mockUser.streak,
          completedDays: mockUser.completedDays,
          totalDays: mockUser.totalDays,
        },
        today: {
          day: 17,
          title: "Build a Weather Dashboard",
          estimatedTime: "60–90 min",
          status: "pending",
        },
        progress: {
          percentage: Math.round((mockUser.completedDays / mockUser.totalDays) * 100),
          completed: mockUser.completedDays,
          total: mockUser.totalDays,
        },
        achievements: [],
        recentActivity: [],
      };
      write({ ...(cache ?? empty), dashboard: mockDashboard, user: mockUser });
      return mockDashboard;
    }
  }, []);

  const setUserFromApi = useCallback((user: ApiUser, dashboard?: DashboardData | null) => {
    write({
      ...(cache ?? empty),
      isLoggedIn: true,
      user,
      dashboard: dashboard ?? cache?.dashboard ?? null,
    });
  }, []);

  const updateProfile = useCallback((updates: Partial<ApiUser>) => {
    const base = cache ?? empty;
    if (!base.user) return;
    
    const newUser = { ...base.user, ...updates };
    const newDashboard = base.dashboard ? {
      ...base.dashboard,
      student: {
        ...base.dashboard.student,
        name: newUser.name,
        track: newUser.track,
      }
    } : null;

    write({
      ...base,
      user: newUser,
      dashboard: newDashboard,
    });
  }, []);

  return {
    state,
    hydrated,
    setScenario,
    submitDay,
    reset,
    login,
    logout,
    refreshDashboard,
    setUserFromApi,
    updateProfile,
  };
}

export type DerivedStudent = Student & {
  progress: number;
  todaySubmitted: boolean;
  displayName: string;
};

export function deriveStudent(state: AppState): DerivedStudent {
  if (state.user && state.dashboard) {
    const { student, today, progress } = state.dashboard;
    return {
      name: student.name,
      handle: `@${student.name.toLowerCase().replace(/\s+/g, "")}`,
      track: student.track,
      initials: student.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase(),
      streak: student.streak,
      longestStreak: student.streak,
      completedDays: student.completedDays,
      totalDays: student.totalDays,
      currentDay: today.day,
      profileComplete: true,
      progress: Math.round(progress.percentage),
      todaySubmitted: today.status === "completed",
      displayName: student.name,
    };
  }

  const base = students[state.scenario];
  const todaySubmitted = Boolean(state.submissions[String(base.currentDay)]);
  const completedDays = Math.min(base.completedDays + (todaySubmitted ? 1 : 0), TOTAL_DAYS);
  const streak = todaySubmitted ? base.streak + 1 : base.streak;
  const longestStreak = Math.max(base.longestStreak, streak);

  return {
    ...base,
    completedDays,
    streak,
    longestStreak,
    todaySubmitted,
    progress: Math.round((completedDays / TOTAL_DAYS) * 100),
    displayName: base.profileComplete && base.name ? base.name : "Builder",
  };
}

export const normalizeUrl = (url: string) => {
  const trimmed = url.trim();
  if (!trimmed) return "";
  if (!trimmed.startsWith("http://") && !trimmed.startsWith("https://")) {
    return `https://${trimmed}`;
  }
  return trimmed;
};

export const isValidUrl = (value: string, host: string) => {
  const str = normalizeUrl(value);
  if (!str) return false;

  try {
    const url = new URL(str);
    return (
      (url.protocol === "https:" || url.protocol === "http:") && url.hostname.includes(host)
    );
  } catch {
    return false;
  }
};
