const API_BASE = import.meta.env.VITE_API_URL ?? "";

type ApiOptions = RequestInit & { json?: unknown };

async function request<T>(path: string, options: ApiOptions = {}): Promise<T> {
  const { json, headers, ...rest } = options;
  const res = await fetch(`${API_BASE}${path}`, {
    ...rest,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    body: json !== undefined ? JSON.stringify(json) : rest.body,
  });

  const data = await res.json().catch(() => ({ success: false, message: "Invalid response" }));

  if (!res.ok) {
    throw new ApiError(data.message ?? "Request failed", res.status, data);
  }

  return data as T;
}

export class ApiError extends Error {
  status: number;
  data: unknown;

  constructor(message: string, status: number, data: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

export type ApiUser = {
  id: number;
  name: string;
  email: string;
  track: string;
  streak: number;
  completedDays: number;
  totalDays: number;
};

export type DashboardData = {
  student: {
    name: string;
    track: string;
    streak: number;
    completedDays: number;
    totalDays: number;
  };
  today: {
    day: number;
    title: string;
    estimatedTime: string;
    status: string;
  };
  progress: {
    percentage: number;
    completed: number;
    total: number;
  };
  achievements: Array<{
    name: string;
    description: string;
    unlocked: boolean;
    unlockedAt: string | null;
  }>;
  recentActivity: Array<{
    day: number;
    title: string;
    status: string;
    submittedAt: string;
  }>;
};

export type ChallengeDay = {
  day: number;
  title: string;
  description: string;
  estimatedTime: string;
  skills: string[];
  requirements: string[];
};

export type SubmissionData = {
  day: number;
  githubRepository: string;
  githubCommit: string;
  linkedinPost: string;
  status: string;
  submittedAt?: string;
};

export const api = {
  login: (email: string, password: string) =>
    request<{ success: boolean; message: string; user: ApiUser }>("/api/auth/login", {
      method: "POST",
      json: { email, password },
    }),

  logout: () =>
    request<{ success: boolean; message: string }>("/api/auth/logout", { method: "POST" }),

  register: (name: string, email: string, password: string) =>
    request<{ success: boolean; message: string; user: { id: number; name: string; email: string } }>(
      "/api/auth/register",
      { method: "POST", json: { name, email, password } },
    ),

  me: () => request<{ success: boolean; user: ApiUser }>("/api/auth/me"),

  dashboard: () => request<DashboardData>("/api/dashboard"),

  getChallenge: (day: number) => request<ChallengeDay>(`/api/challenges/day/${day}`),

  submitChallenge: (
    day: number,
    payload: { githubRepository: string; githubCommit: string; linkedinPost: string },
  ) =>
    request<{
      success: boolean;
      message: string;
      submission: { day: number; status: string };
      streak: number;
    }>(`/api/challenges/day/${day}/submit`, { method: "POST", json: payload }),

  getSubmission: (day: number) => request<SubmissionData>(`/api/challenges/day/${day}/submission`),
};
