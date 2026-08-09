export type Challenge = {
  day: number;
  title: string;
  tagline: string;
  description: string;
  requirements: string[];
  estimatedTime: string;
  skills: string[];
  type: "BUILD" | "SHIP" | "REFACTOR";
};

export type Scenario = "active" | "firstDay" | "missedDay" | "emptyProfile";

export type Student = {
  name: string;
  handle: string;
  track: string;
  initials: string;
  streak: number;
  longestStreak: number;
  completedDays: number;
  totalDays: number;
  currentDay: number;
  missedDay?: number;
  profileComplete: boolean;
};

export const TOTAL_DAYS = 60;

export const challenges: Challenge[] = [
  {
    day: 12,
    title: "Build a Weather Dashboard",
    tagline: "Turn an API into a useful product.",
    description:
      "Build a responsive weather dashboard that lets users search for a city and view its current conditions. Handle the loading and error paths as carefully as the happy path — that's what separates a demo from a product.",
    requirements: [
      "City search with keyboard submit",
      "Current temperature and feels-like",
      "Weather condition + matching icon",
      "Loading and error states",
      "Responsive layout down to 360px",
    ],
    estimatedTime: "60–90 min",
    skills: ["API Integration", "Async JavaScript", "Error Handling", "Responsive UI"],
    type: "BUILD",
  },
  {
    day: 1,
    title: "Ship Your Developer Profile",
    tagline: "Day one is a commit, not a course.",
    description:
      "Create a single-page profile site with your name, track, and the goal you're chasing for the next 60 days. Push it to GitHub and post it publicly. Small build, real proof.",
    requirements: [
      "One page, deployed or pushed",
      "Your name, track and 60-day goal",
      "Clean README in the repo",
    ],
    estimatedTime: "30–45 min",
    skills: ["Git Basics", "HTML & CSS", "Writing in Public"],
    type: "SHIP",
  },
  {
    day: 11,
    title: "Recovery Build: Tip Splitter",
    tagline: "A short build to get back on the board.",
    description:
      "A compact recovery task. Build a tip splitter that takes a bill, a tip percentage and a number of people, and shows the per-person total live as you type.",
    requirements: ["Live calculation", "Input validation", "Mobile-first layout"],
    estimatedTime: "25–40 min",
    skills: ["State Handling", "Form Inputs", "Number Formatting"],
    type: "BUILD",
  },
];

export const fallbackChallenge = (day: number): Challenge => ({
  day,
  title: `Day ${day} Build`,
  tagline: "One focused build. Ship the proof.",
  description:
    "Pick the scoped brief for today from your track, build it end to end, and submit your GitHub and LinkedIn proof before midnight.",
  requirements: ["Working core feature", "Clean, readable code", "Responsive layout"],
  estimatedTime: "60–90 min",
  skills: ["Problem Solving", "Clean Code", "Responsive UI"],
  type: "BUILD",
});

export const getChallenge = (day: number): Challenge =>
  challenges.find((c) => c.day === day) ?? fallbackChallenge(day);

export const students: Record<Scenario, Student> = {
  active: {
    name: "Dhammjit",
    handle: "@dhammjit",
    track: "Full Stack Development",
    initials: "DJ",
    streak: 7,
    longestStreak: 12,
    completedDays: 17,
    totalDays: TOTAL_DAYS,
    currentDay: 17,
    profileComplete: true,
  },
  firstDay: {
    name: "Dhammjit",
    handle: "@dhammjit",
    track: "Full Stack Development",
    initials: "DJ",
    streak: 0,
    longestStreak: 0,
    completedDays: 0,
    totalDays: TOTAL_DAYS,
    currentDay: 1,
    profileComplete: true,
  },
  missedDay: {
    name: "Dhammjit",
    handle: "@dhammjit",
    track: "Full Stack Development",
    initials: "DJ",
    streak: 0,
    longestStreak: 12,
    completedDays: 16,
    totalDays: TOTAL_DAYS,
    currentDay: 17,
    missedDay: 16,
    profileComplete: true,
  },
  emptyProfile: {
    name: "",
    handle: "",
    track: "",
    initials: "B",
    streak: 7,
    longestStreak: 12,
    completedDays: 17,
    totalDays: TOTAL_DAYS,
    currentDay: 17,
    profileComplete: false,
  },
};

export type LeaderboardEntry = {
  rank: number;
  name: string;
  initials: string;
  streak: number;
  progress: number;
};

export const leaderboard: LeaderboardEntry[] = [
  { rank: 1, name: "Aarav Sharma", initials: "AS", streak: 45, progress: 85 },
  { rank: 2, name: "Isha Patel", initials: "IP", streak: 42, progress: 82 },
  { rank: 3, name: "Dhammjit", initials: "DJ", streak: 7, progress: 28 },
  { rank: 4, name: "Rohan Gupta", initials: "RG", streak: 38, progress: 75 },
  { rank: 5, name: "Sneha Reddy", initials: "SR", streak: 35, progress: 70 },
];

export type Achievement = {
  id: string;
  icon: string;
  label: string;
  detail: string;
  unlockAt: number;
};

export const achievements: Achievement[] = [
  { id: "first", icon: "🏆", label: "First Build", detail: "Shipped day 1", unlockAt: 1 },
  { id: "week", icon: "🔥", label: "7 Day Streak", detail: "One full week", unlockAt: 7 },
  { id: "ten", icon: "💻", label: "10 Projects", detail: "Portfolio forming", unlockAt: 10 },
  { id: "fortnight", icon: "⚡", label: "2 Week Builder", detail: "14 days shipped", unlockAt: 14 },
  { id: "half", icon: "🚀", label: "Halfway There", detail: "30 days done", unlockAt: 30 },
  { id: "finish", icon: "🎖️", label: "60 Day Finisher", detail: "Challenge complete", unlockAt: 60 },
];

export const recentTitles: Record<number, string> = {
  11: "Recovery Build: Tip Splitter",
  10: "Expense Tracker with Charts",
  9: "Markdown Note Editor",
  8: "REST API with Express",
  7: "Responsive Pricing Page",
  6: "Quiz App with Timer",
};
