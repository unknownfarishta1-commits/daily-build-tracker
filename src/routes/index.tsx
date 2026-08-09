import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Check,
  Compass,
  Github,
  Hammer,
  Layers,
  Linkedin,
  Share2,
} from "lucide-react";
import { SiteFooter, SiteHeader } from "@/components/SiteChrome";
import { ProgressBar } from "@/components/ProgressBar";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Daily Build Tracker — 60 Days. 60 Builds. One Strong Portfolio." },
      {
        name: "description",
        content:
          "A 60-day build challenge for Indian college students. Ship one project a day and prove it with GitHub commits and LinkedIn posts.",
      },
      { property: "og:title", content: "Daily Build Tracker — 60 Days. 60 Builds." },
      {
        property: "og:description",
        content:
          "Stop watching tutorials. Start building every day, with public proof on GitHub and LinkedIn.",
      },
    ],
  }),
  component: Landing,
});

const steps = [
  {
    n: "01",
    icon: Compass,
    title: "Pick a Track",
    body: "Full stack, frontend, Python or DSA. Choose what you actually want to learn.",
  },
  {
    n: "02",
    icon: Hammer,
    title: "Build Every Day",
    body: "One scoped, practical challenge each day. Most take 60–90 minutes.",
  },
  {
    n: "03",
    icon: Share2,
    title: "Share Your Proof",
    body: "Submit a GitHub commit and a LinkedIn post. Your work stays public.",
  },
  {
    n: "04",
    icon: Layers,
    title: "Build Your Portfolio",
    body: "Finish with 60 days of visible, dated, reviewable work.",
  },
];

const reasons = [
  ["Consistency beats intensity", "A daily 90 minutes compounds faster than weekend marathons."],
  ["Real projects, not tutorials", "Every day ends in something that runs."],
  ["Public proof of work", "Your commits and posts are timestamped receipts."],
  ["A GitHub that looks alive", "60 days of green is the first thing recruiters scroll to."],
  ["A LinkedIn people follow", "Daily builds turn your feed into a portfolio."],
  ["Portfolio you can defend", "You built it, so you can explain it in an interview."],
];

function Landing() {
  return (
    <div className="min-h-screen">
      <SiteHeader />

      <main>
        {/* Hero */}
        <section className="glow-accent relative overflow-hidden px-5 pt-14 pb-16 sm:pt-20">
          <div className="mx-auto max-w-6xl">
            <div className="animate-rise flex flex-col items-start gap-6 lg:flex-row lg:items-center lg:gap-16">
              <div className="w-full lg:flex-1">
                <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-xs text-muted-foreground">
                  <span className="h-1.5 w-1.5 rounded-full bg-success" />
                  Cohort 07 · open for Indian college students
                </span>

                <h1 className="mt-5 text-[2.6rem] leading-[1.03] font-semibold sm:text-6xl">
                  60 Days.
                  <br />
                  60 Builds.
                  <br />
                  <span className="text-primary">One strong portfolio.</span>
                </h1>

                <p className="mt-5 max-w-xl text-[0.975rem] leading-relaxed text-muted-foreground">
                  Stop watching tutorials. Start building every day. ABTalks gives you one
                  practical build a day and holds you to it — you prove each one with a GitHub
                  commit and a LinkedIn post.
                </p>

                <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                  <Link
                    to="/login"
                    className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-primary px-6 text-[0.95rem] font-medium text-primary-foreground shadow-[0_10px_30px_-12px_oklch(0.63_0.21_274_/_0.9)] transition-transform hover:-translate-y-0.5 active:translate-y-0"
                  >
                    Start the Challenge <ArrowRight className="h-4 w-4" />
                  </Link>
                  <a
                    href="#how"
                    className="inline-flex min-h-12 items-center justify-center rounded-xl border border-border-strong px-6 text-[0.95rem] font-medium transition-colors hover:bg-secondary"
                  >
                    See How It Works
                  </a>
                </div>

                <dl className="mt-9 grid max-w-md grid-cols-3 gap-3">
                  {[
                    ["60", "Days"],
                    ["1", "Build / day"],
                    ["2", "Public proofs"],
                  ].map(([v, l]) => (
                    <div key={l} className="surface px-3 py-3">
                      <dt className="font-display text-xl font-semibold">{v}</dt>
                      <dd className="eyebrow mt-0.5">{l}</dd>
                    </div>
                  ))}
                </dl>
              </div>

              {/* Product preview */}
              <div className="w-full lg:w-[360px]">
                <PreviewCard />
              </div>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section id="how" className="scroll-mt-16 border-t border-border px-5 py-14">
          <div className="mx-auto max-w-6xl">
            <p className="eyebrow">How it works</p>
            <h2 className="mt-2 text-2xl font-semibold sm:text-3xl">
              Four steps. Then it's just showing up.
            </h2>
            <ul className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {steps.map((s) => (
                <li key={s.n} className="surface p-5 transition-colors hover:border-border-strong">
                  <div className="flex items-center justify-between">
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-primary/15 text-primary">
                      <s.icon className="h-4.5 w-4.5" />
                    </span>
                    <span className="font-mono text-xs text-muted-foreground">{s.n}</span>
                  </div>
                  <h3 className="mt-4 text-base font-semibold">{s.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Why 60 days */}
        <section className="border-t border-border px-5 py-14">
          <div className="mx-auto max-w-6xl">
            <p className="eyebrow">Why 60 days</p>
            <h2 className="mt-2 max-w-2xl text-2xl font-semibold sm:text-3xl">
              Long enough to change how you work. Short enough to finish.
            </h2>
            <ul className="mt-7 grid gap-x-8 gap-y-5 sm:grid-cols-2 lg:grid-cols-3">
              {reasons.map(([title, body]) => (
                <li key={title} className="flex gap-3 border-t border-border pt-4">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                  <div className="min-w-0">
                    <h3 className="text-sm font-semibold">{title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{body}</p>
                  </div>
                </li>
              ))}
            </ul>
            <p className="mt-8 text-xs text-muted-foreground">
              No job guarantees. Just a body of work that speaks before you do.
            </p>
          </div>
        </section>

        {/* Final CTA */}
        <section className="px-5 pb-16">
          <div className="glow-accent mx-auto max-w-6xl overflow-hidden rounded-2xl border border-border bg-card px-6 py-12 text-center">
            <h2 className="text-2xl font-semibold sm:text-4xl">Your first build starts today.</h2>
            <p className="mx-auto mt-3 max-w-md text-sm text-muted-foreground">
              Day 1 takes 30 minutes. The hard part is starting — everything after that is just the
              streak.
            </p>
            <Link
              to="/day/$day"
              params={{ day: "1" }}
              className="mt-7 inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-primary px-7 text-[0.95rem] font-medium text-primary-foreground transition-transform hover:-translate-y-0.5 active:translate-y-0"
            >
              Start Day 1 <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}

function PreviewCard() {
  return (
    <div className="surface animate-rise overflow-hidden p-5 shadow-2xl shadow-primary/10 border-primary/20">
      <div className="flex items-center justify-between">
        <span className="eyebrow text-primary">Day 17 / 60</span>
        <span className="rounded-md bg-primary/15 px-2 py-1 font-mono text-[0.65rem] tracking-widest text-primary">
          ACTIVE
        </span>
      </div>

      <h3 className="mt-3 text-xl font-semibold">60-Day Challenge</h3>
      <p className="mt-1 text-sm text-muted-foreground">Keep your streak alive, Dhammjit!</p>

      <div className="mt-5">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Challenge progress</span>
          <span className="font-mono text-foreground font-bold">28%</span>
        </div>
        <div className="h-2 w-full rounded-full bg-secondary mt-2 overflow-hidden">
          <div className="h-full bg-primary rounded-full" style={{ width: '28%' }} />
        </div>
      </div>

      <ul className="mt-5 space-y-2">
        {[
          { icon: Github, label: "GitHub commit", status: "Submitted" },
          { icon: Linkedin, label: "LinkedIn post", status: "Submitted" },
        ].map((row) => (
          <li
            key={row.label}
            className="flex items-center justify-between rounded-lg bg-secondary/50 px-3 py-2.5"
          >
            <span className="flex items-center gap-2.5 text-sm">
              <row.icon className="h-4 w-4 text-muted-foreground" />
              {row.label}
            </span>
            <span className="flex items-center gap-1.5 text-xs font-medium text-success">
              <Check className="h-3.5 w-3.5" /> {row.status}
            </span>
          </li>
        ))}
      </ul>

      <div className="mt-4 flex items-center gap-2 rounded-lg border border-border px-3 py-2.5 text-xs text-muted-foreground bg-secondary/30">
        🔥 <span className="text-foreground font-bold">7-day streak</span> · 12 longest
      </div>
    </div>
  );
}
