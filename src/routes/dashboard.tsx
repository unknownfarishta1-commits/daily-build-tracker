import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Check,
  ChevronRight,
  Circle,
  Clock,
  Flame,
  Github,
  Linkedin,
  Lock,
  RotateCcw,
  Sparkles,
  TriangleAlert,
  UserRoundPen,
} from "lucide-react";
import { Logo } from "@/components/Logo";
import { ProgressBar, SegmentedProgress } from "@/components/ProgressBar";
import { ScenarioSwitcher } from "@/components/ScenarioSwitcher";
import { achievements, getChallenge, recentTitles, TOTAL_DAYS } from "@/data/mockData";
import { deriveStudent, useAppState } from "@/lib/challenge-state";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — ABTalks 60-Day Challenge" },
      {
        name: "description",
        content:
          "Track your streak, today's mission, proof of work and achievements across the ABTalks 60-day build challenge.",
      },
      { property: "og:title", content: "Your ABTalks Dashboard" },
      {
        property: "og:description",
        content: "Streak, daily mission and public proof of work in one mobile-first screen.",
      },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const { state, hydrated } = useAppState();
  const student = deriveStudent(state);
  const challenge = getChallenge(student.currentDay);
  const submission = state.submissions[String(student.currentDay)];
  const proofs = [
    { label: "GitHub Repository", icon: Github, done: Boolean(submission?.repo) },
    { label: "GitHub Commit", icon: Github, done: Boolean(submission?.commit) },
    { label: "LinkedIn Post", icon: Linkedin, done: Boolean(submission?.linkedin) },
  ];
  const proofDone = proofs.filter((p) => p.done).length;
  const isFirstDay = student.currentDay === 1 && student.completedDays === 0;

  return (
    <div className="min-h-screen pb-14">
      <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur">
        <div className="mx-auto grid h-14 max-w-3xl grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-5">
          <Link to="/" aria-label="ABTalks home" className="flex min-w-0 items-center">
            <Logo className="h-5" />
          </Link>
          <div className="flex shrink-0 items-center gap-2">
            <span className="hidden text-xs text-muted-foreground sm:inline">
              {student.profileComplete ? student.track : "Track not set"}
            </span>
            <span
              className="grid h-9 w-9 place-items-center rounded-full bg-primary/20 text-sm font-semibold text-primary"
              aria-hidden="true"
            >
              {student.initials}
            </span>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-3xl space-y-3.5 px-5 pt-5">
        {/* Greeting */}
        <section className="animate-rise">
          <h1 className="text-2xl font-semibold">
            {greeting()}, {student.displayName} 👋
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {isFirstDay
              ? "Your journey starts today. One small build is all you need."
              : student.missedDay
                ? "You slipped a day. Today is the reset."
                : "Keep the streak alive."}
          </p>
        </section>

        {!student.profileComplete && (
          <section className="surface animate-rise flex flex-col gap-3 border-primary/40 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex min-w-0 gap-3">
              <UserRoundPen className="mt-0.5 h-4.5 w-4.5 shrink-0 text-primary" />
              <div className="min-w-0">
                <h2 className="text-sm font-semibold">Welcome, Builder</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Complete your profile to personalise your challenge experience.
                </p>
              </div>
            </div>
            <button className="min-h-11 shrink-0 rounded-xl bg-primary px-4 text-sm font-medium text-primary-foreground transition-transform hover:-translate-y-px">
              Complete Profile
            </button>
          </section>
        )}

        {student.missedDay && (
          <section className="surface animate-rise border-warning/40 p-4">
            <div className="flex gap-3">
              <TriangleAlert className="mt-0.5 h-4.5 w-4.5 shrink-0 text-warning" />
              <div className="min-w-0">
                <h2 className="text-sm font-semibold">You missed Day {student.missedDay}</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Your streak can recover. Complete today's shorter recovery build to get back on
                  track.
                </p>
              </div>
            </div>
            <Link
              to="/day/$day"
              params={{ day: String(student.missedDay) }}
              className="mt-3 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-warning/40 bg-warning/10 px-4 text-sm font-medium text-warning transition-colors hover:bg-warning/15"
            >
              <RotateCcw className="h-4 w-4" /> Recover Streak
            </Link>
          </section>
        )}

        {/* Streak */}
        <section className="surface glow-accent animate-rise overflow-hidden p-5">
          <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4">
            <div className="min-w-0">
              <p className="eyebrow">Current streak</p>
              <p className="mt-1.5 flex items-baseline gap-2 font-display text-4xl font-semibold">
                <Flame
                  className={`h-7 w-7 shrink-0 ${student.streak > 0 ? "text-warning" : "text-muted-foreground"}`}
                />
                {student.streak}
                <span className="text-base font-medium text-muted-foreground">
                  {student.streak === 1 ? "day" : "days"}
                </span>
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                {student.streak === 0
                  ? "Ship today to light it up."
                  : student.streak < 7
                    ? "You're building momentum."
                    : "This is the habit now. Protect it."}
              </p>
            </div>
            <span className="shrink-0 rounded-lg border border-border px-2.5 py-1.5 font-mono text-xs text-muted-foreground">
              Day {student.currentDay}/{TOTAL_DAYS}
            </span>
          </div>

          <div className="mt-5 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Challenge progress</span>
              <span className="font-mono">
                {student.completedDays} / {TOTAL_DAYS} · {student.progress}%
              </span>
            </div>
            <SegmentedProgress completed={student.completedDays} total={TOTAL_DAYS} />
          </div>
        </section>

        {/* Momentum Coach */}
        <MomentumCoach
          streak={student.streak}
          submitted={student.todaySubmitted}
          missed={Boolean(student.missedDay)}
          firstDay={isFirstDay}
        />

        {/* Today's mission */}
        <section className="surface animate-rise p-5">
          <div className="flex items-center justify-between">
            <p className="eyebrow">Today's mission · Day {student.currentDay}</p>
            {student.todaySubmitted && (
              <span className="flex items-center gap-1 rounded-md bg-success/15 px-2 py-1 text-[0.7rem] font-medium text-success">
                <Check className="h-3 w-3" /> Done
              </span>
            )}
          </div>
          <h2 className="mt-3 text-xl font-semibold">{challenge.title}</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            {challenge.description}
          </p>
          <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
            <Clock className="h-3.5 w-3.5" /> Estimated time
            <span className="font-mono text-foreground">{challenge.estimatedTime}</span>
          </div>
          <Link
            to="/day/$day"
            params={{ day: String(student.currentDay) }}
            className="mt-4 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 text-[0.95rem] font-medium text-primary-foreground transition-transform hover:-translate-y-0.5 active:translate-y-0"
          >
            {student.todaySubmitted ? "Review today's build" : "Continue Challenge"}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </section>

        {/* Proof status */}
        <section className="surface animate-rise p-5">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold">Today's proof</h2>
            <span className="font-mono text-xs text-muted-foreground">
              {proofDone} / {proofs.length} complete
            </span>
          </div>
          <ul className="mt-3 space-y-2">
            {proofs.map((p) => (
              <li
                key={p.label}
                className="flex items-center justify-between rounded-lg bg-elevated px-3 py-2.5"
              >
                <span className="flex min-w-0 items-center gap-2.5 text-sm">
                  <p.icon className="h-4 w-4 shrink-0 text-muted-foreground" />
                  <span className="truncate">{p.label}</span>
                </span>
                {p.done ? (
                  <span className="flex shrink-0 items-center gap-1.5 text-xs font-medium text-success">
                    <Check className="h-3.5 w-3.5" /> Submitted
                  </span>
                ) : (
                  <span className="flex shrink-0 items-center gap-1.5 text-xs text-muted-foreground">
                    <Circle className="h-3 w-3" /> Pending
                  </span>
                )}
              </li>
            ))}
          </ul>
          <ProgressBar
            value={(proofDone / proofs.length) * 100}
            tone="success"
            className="mt-3"
          />
        </section>

        {/* Achievements */}
        <section className="animate-rise">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-sm font-semibold">Achievements</h2>
            <span className="font-mono text-xs text-muted-foreground">
              {achievements.filter((a) => student.completedDays >= a.unlockAt).length} /{" "}
              {achievements.length}
            </span>
          </div>
          <ul className="-mx-5 mt-3 flex snap-x gap-2.5 overflow-x-auto px-5 pb-1.5">
            {achievements.map((a) => {
              const unlocked = student.completedDays >= a.unlockAt;
              return (
                <li
                  key={a.id}
                  className={`w-[132px] shrink-0 snap-start rounded-xl border p-3.5 ${
                    unlocked
                      ? "border-border-strong bg-card"
                      : "border-dashed border-border bg-transparent opacity-55"
                  }`}
                >
                  <span className="text-xl" aria-hidden="true">
                    {unlocked ? a.icon : <Lock className="h-4.5 w-4.5 text-muted-foreground" />}
                  </span>
                  <p className="mt-2 text-sm leading-tight font-semibold">{a.label}</p>
                  <p className="mt-1 text-[0.7rem] text-muted-foreground">
                    {unlocked ? a.detail : `Day ${a.unlockAt}`}
                  </p>
                </li>
              );
            })}
          </ul>
        </section>

        {/* Recent activity */}
        <section className="surface animate-rise p-5">
          <h2 className="text-sm font-semibold">Recent activity</h2>
          {student.completedDays === 0 ? (
            <p className="mt-3 rounded-lg border border-dashed border-border px-3 py-6 text-center text-sm text-muted-foreground">
              Nothing here yet. Your first completed day shows up right after you submit.
            </p>
          ) : (
            <ul className="mt-3 divide-y divide-border">
              {recentDays(student.completedDays, student.missedDay).map((d) => (
                <li key={d.day} className="flex items-center justify-between gap-3 py-2.5">
                  <span className="min-w-0">
                    <span className="font-mono text-xs text-muted-foreground">
                      Day {String(d.day).padStart(2, "0")}
                    </span>
                    <span className="block truncate text-sm">
                      {recentTitles[d.day] ?? `Day ${d.day} build`}
                    </span>
                  </span>
                  <span
                    className={`flex shrink-0 items-center gap-1.5 text-xs font-medium ${
                      d.missed ? "text-warning" : "text-success"
                    }`}
                  >
                    {d.missed ? (
                      <>
                        <TriangleAlert className="h-3.5 w-3.5" /> Missed
                      </>
                    ) : (
                      <>
                        <Check className="h-3.5 w-3.5" /> Completed
                      </>
                    )}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>

        <ScenarioSwitcher />

        <p className="px-1 pt-1 text-center text-xs text-muted-foreground">
          {hydrated ? "Progress saved on this device." : "Loading your progress…"}
        </p>
      </main>
    </div>
  );
}

function recentDays(completed: number, missed?: number) {
  const last = missed ? missed : completed;
  const out: { day: number; missed: boolean }[] = [];
  for (let d = last; d > 0 && out.length < 4; d--) {
    out.push({ day: d, missed: d === missed });
  }
  return out;
}

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

function MomentumCoach({
  streak,
  submitted,
  missed,
  firstDay,
}: {
  streak: number;
  submitted: boolean;
  missed: boolean;
  firstDay: boolean;
}) {
  let body: string;
  if (firstDay) {
    body =
      "Day 1 is the only one that requires courage. Ship something small tonight and the streak takes over from there.";
  } else if (missed) {
    body =
      "One missed day isn't a broken habit — it's a data point. The recovery build takes 25 minutes and puts you back on the board.";
  } else if (submitted) {
    body = `Logged. That's ${streak} days straight. Close the laptop — tomorrow's brief unlocks at 6 AM.`;
  } else if (streak >= 13) {
    body = `You're on a ${streak}-day streak. One more build tomorrow unlocks your "2 Week Builder" badge. Keep going.`;
  } else {
    body = `You're on a ${streak}-day streak — your best run yet. Builders who cross day 14 finish the challenge 3× more often.`;
  }

  return (
    <section className="animate-rise rounded-xl border border-primary/30 bg-primary/[0.07] p-4">
      <p className="flex items-center gap-2 text-xs font-semibold tracking-wide text-primary">
        <Sparkles className="h-3.5 w-3.5" /> Momentum Coach
      </p>
      <p className="mt-2 text-sm leading-relaxed">{body}</p>
      <p className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
        Tuned to your streak, not a generic tip <ChevronRight className="h-3 w-3" />
      </p>
    </section>
  );
}
