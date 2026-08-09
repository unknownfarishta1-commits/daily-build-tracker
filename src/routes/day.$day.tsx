import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Circle,
  Clock,
  Github,
  Linkedin,
  Loader2,
  Target,
} from "lucide-react";
import { ProgressBar } from "@/components/ProgressBar";
import { TOTAL_DAYS, getChallenge, fallbackChallenge } from "@/data/mockData";
import { deriveStudent, isValidUrl, normalizeUrl, useAppState } from "@/lib/challenge-state";
import { api, type ChallengeDay } from "@/lib/api";

export const Route = createFileRoute("/day/$day")({
  head: ({ params }) => ({
    meta: [
      { title: `Day ${params.day} — ABTalks` },
      { name: "description", content: "60-day coding challenge" },
    ],
  }),
  component: ChallengeDay,
});

type Status = "idle" | "loading" | "done";

function ChallengeDay() {
  const { day: dayParam } = Route.useParams();
  const navigate = useNavigate();
  const parsed = Number(dayParam);
  const day = Number.isFinite(parsed) ? Math.min(Math.max(Math.trunc(parsed), 1), TOTAL_DAYS) : 1;

  const { state, hydrated, submitDay, refreshDashboard } = useAppState();
  const [challenge, setChallenge] = useState<ChallengeDay | null>(null);
  const [loadError, setLoadError] = useState("");
  const [repo, setRepo] = useState("");
  const [commit, setCommit] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [touched, setTouched] = useState(false);

  const student = deriveStudent(state);

  useEffect(() => {
    if (hydrated && !state.isLoggedIn) {
      navigate({ to: "/login" });
    }
  }, [hydrated, state.isLoggedIn, navigate]);

  useEffect(() => {
    if (!state.isLoggedIn) return;
    setChallenge(null);
    setLoadError("");
    setStatus("idle");

    const resolvedSubmission = state.submissions[String(day)];

    api
      .getChallenge(day)
      .then(setChallenge)
      .catch(() => {
        const fc = getChallenge(day);
        const mock: ChallengeDay = {
          day,
          title: fc.title,
          description: fc.description,
          estimatedTime: fc.estimatedTime,
          skills: fc.skills,
          requirements: fc.requirements,
        };
        setChallenge(mock);
      });

    api
      .getSubmission(day)
      .then((sub) => {
        setRepo(sub.githubRepository);
        setCommit(sub.githubCommit);
        setLinkedin(sub.linkedinPost);
        if (sub.status === "completed") setStatus("done");
      })
      .catch(() => {
        if (resolvedSubmission) {
          setRepo(resolvedSubmission.repo);
          setCommit(resolvedSubmission.commit);
          setLinkedin(resolvedSubmission.linkedin);
        } else {
          setRepo("");
          setCommit("");
          setLinkedin("");
        }
      });
  }, [day, state.isLoggedIn, state.submissions]);

  if (!hydrated || !state.isLoggedIn || !challenge) {
    return (
      <div className="min-h-screen bg-[#0a0a0b] flex items-center justify-center">
        {loadError ? (
          <p className="text-destructive text-sm">{loadError}</p>
        ) : (
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        )}
      </div>
    );
  }

  const validRepo = isValidUrl(repo, "github.com");
  const validCommit = isValidUrl(commit, "github.com");
  const validLinkedin = isValidUrl(linkedin, "linkedin.com");
  const checklist = [
    { label: "GitHub Repository", ok: validRepo },
    { label: "GitHub Commit", ok: validCommit },
    { label: "LinkedIn Post", ok: validLinkedin },
  ];
  const complete = checklist.filter((c) => c.ok).length;
  const allValid = complete === checklist.length;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);
    if (!allValid || status === "loading") return;
    setStatus("loading");
    const normalizedRepo = normalizeUrl(repo);
    const normalizedCommit = normalizeUrl(commit);
    const normalizedLinkedin = normalizeUrl(linkedin);

    try {
      await api.submitChallenge(day, {
        githubRepository: normalizedRepo,
        githubCommit: normalizedCommit,
        linkedinPost: normalizedLinkedin,
      });
      submitDay(day, { repo: normalizedRepo, commit: normalizedCommit, linkedin: normalizedLinkedin });
      await refreshDashboard();
      setStatus("done");
    } catch {
      submitDay(day, { repo: normalizedRepo, commit: normalizedCommit, linkedin: normalizedLinkedin });
      try {
        await refreshDashboard();
      } catch {
        /* ignore */
      }
      setStatus("done");
    }
  };

  if (status === "done") {
    return (
      <SuccessScreen
        day={day}
        streak={student.streak}
        onBack={() => navigate({ to: "/dashboard" })}
      />
    );
  }

  return (
    <div className="min-h-screen pb-16">
      <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur">
        <div className="mx-auto max-w-2xl px-5">
          <div className="grid h-14 grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
            <Link
              to="/dashboard"
              className="-ml-2 inline-flex min-h-10 min-w-0 items-center gap-1.5 rounded-lg px-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4 shrink-0" />
              <span className="truncate">Back to Dashboard</span>
            </Link>
            <span className="shrink-0 font-mono text-xs text-muted-foreground">
              Day {day} / {TOTAL_DAYS}
            </span>
          </div>
          <ProgressBar value={(day / TOTAL_DAYS) * 100} className="mb-2 h-1" />
        </div>
      </header>

      <main className="mx-auto max-w-2xl space-y-3.5 px-5 pt-6">
        <section className="animate-rise">
          <span className="rounded-md bg-primary/15 px-2 py-1 font-mono text-[0.65rem] tracking-widest text-primary">
            BUILD
          </span>
          <h1 className="mt-3 text-[1.75rem] leading-tight font-semibold">{challenge.title}</h1>
          <p className="mt-2 text-sm text-muted-foreground">Day {day} of the 60-day challenge</p>
          <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
            <Clock className="h-3.5 w-3.5" />
            <span className="font-mono text-foreground">{challenge.estimatedTime}</span>
          </div>
        </section>

        <section className="surface animate-rise p-5">
          <h2 className="flex items-center gap-2 text-sm font-semibold">
            <Target className="h-4 w-4 text-primary" /> Your mission
          </h2>
          <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">
            {challenge.description}
          </p>
          <p className="eyebrow mt-5">Your app should include</p>
          <ul className="mt-2.5 space-y-2">
            {challenge.requirements.map((r) => (
              <li key={r} className="flex gap-2.5 text-sm">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                <span className="min-w-0">{r}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="surface animate-rise p-5">
          <h2 className="text-sm font-semibold">You'll practice</h2>
          <ul className="mt-3 flex flex-wrap gap-2">
            {challenge.skills.map((s) => (
              <li
                key={s}
                className="rounded-lg border border-border bg-elevated px-3 py-1.5 text-xs"
              >
                {s}
              </li>
            ))}
          </ul>
        </section>

        <form onSubmit={handleSubmit} noValidate className="space-y-3.5">
          <section className="animate-rise pt-3">
            <h2 className="text-xl font-semibold">Submit your proof</h2>
            <p className="mt-1 text-sm text-muted-foreground">Show the world what you built.</p>
          </section>

          <section className="surface animate-rise p-5">
            <h3 className="flex items-center gap-2 text-sm font-semibold">
              <Github className="h-4 w-4" /> GitHub
            </h3>
            <Field
              id="repo"
              label="Repository URL"
              hint="Paste the link to your project repository."
              placeholder="https://github.com/you/weather-dashboard"
              value={repo}
              onChange={setRepo}
              valid={validRepo}
              touched={touched}
              error="Enter a valid github.com URL."
              okLabel="Repository connected"
            />
            <Field
              id="commit"
              label="Commit URL"
              hint="Link the commit that contains today's work."
              placeholder="https://github.com/you/weather-dashboard/commit/9f2c1a"
              value={commit}
              onChange={setCommit}
              valid={validCommit}
              touched={touched}
              error="Enter a valid github.com commit URL."
              okLabel="Commit verified"
              className="mt-5"
            />
          </section>

          <section className="surface animate-rise p-5">
            <h3 className="flex items-center gap-2 text-sm font-semibold">
              <Linkedin className="h-4 w-4" /> LinkedIn
            </h3>
            <Field
              id="linkedin"
              label="Post URL"
              hint="Share your build publicly, then add your post link here."
              placeholder="https://linkedin.com/posts/you-day12"
              value={linkedin}
              onChange={setLinkedin}
              valid={validLinkedin}
              touched={touched}
              error="Enter a valid linkedin.com post URL."
              okLabel="Post linked"
            />
          </section>

          <section className="surface animate-rise p-5">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold">Proof checklist</h3>
              <span className="font-mono text-xs text-muted-foreground">
                {complete} / {checklist.length} complete
              </span>
            </div>
            <ul className="mt-3 space-y-2">
              {checklist.map((c) => (
                <li key={c.label} className="flex items-center gap-2.5 text-sm">
                  {c.ok ? (
                    <Check className="animate-pop h-4 w-4 shrink-0 text-success" />
                  ) : (
                    <Circle className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                  )}
                  <span className={c.ok ? "" : "text-muted-foreground"}>{c.label}</span>
                </li>
              ))}
            </ul>
            <ProgressBar
              value={(complete / checklist.length) * 100}
              tone="success"
              className="mt-4"
            />
          </section>

          {touched && !allValid && (
            <p role="alert" className="px-1 text-sm text-destructive">
              Add all three valid links before submitting.
            </p>
          )}

          <button
            type="submit"
            disabled={status === "loading"}
            aria-disabled={!allValid}
            className={`inline-flex min-h-13 w-full items-center justify-center gap-2 rounded-xl px-5 text-[0.95rem] font-medium transition-all ${
              allValid
                ? "bg-primary text-primary-foreground hover:-translate-y-0.5 active:translate-y-0"
                : "bg-secondary text-muted-foreground"
            }`}
          >
            {status === "loading" ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Recording proof…
              </>
            ) : (
              <>
                Submit Day {day} <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </form>
      </main>
    </div>
  );
}

function Field({
  id,
  label,
  hint,
  placeholder,
  value,
  onChange,
  valid,
  touched,
  error,
  okLabel,
  className = "",
}: {
  id: string;
  label: string;
  hint: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  valid: boolean;
  touched: boolean;
  error: string;
  okLabel: string;
  className?: string;
}) {
  const showError = touched && !valid && value.trim().length > 0;
  return (
    <div className={className}>
      <label htmlFor={id} className="block text-sm font-medium">
        {label}
      </label>
      <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
      <input
        id={id}
        type="url"
        inputMode="url"
        autoComplete="off"
        spellCheck={false}
        placeholder={placeholder}
        value={value}
        aria-invalid={showError}
        aria-describedby={`${id}-status`}
        onChange={(e) => onChange(e.target.value)}
        className={`mt-2.5 min-h-12 w-full rounded-xl border bg-elevated px-3.5 text-sm transition-colors outline-none placeholder:text-muted-foreground/60 focus:border-primary ${
          showError ? "border-destructive" : valid ? "border-success/60" : "border-input"
        }`}
      />
      <p id={`${id}-status`} className="mt-2 min-h-4 text-xs">
        {valid ? (
          <span className="flex items-center gap-1.5 text-success">
            <Check className="h-3.5 w-3.5" /> {okLabel}
          </span>
        ) : showError ? (
          <span className="text-destructive">{error}</span>
        ) : (
          <span className="sr-only">Not submitted yet</span>
        )}
      </p>
    </div>
  );
}

function SuccessScreen({
  day,
  streak,
  onBack,
}: {
  day: number;
  streak: number;
  onBack: () => void;
}) {
  return (
    <div className="glow-accent flex min-h-screen items-center justify-center px-5 py-16">
      <div className="animate-rise w-full max-w-sm text-center">
        <div className="animate-pop mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-success/15 text-3xl">
          🎉
        </div>
        <h1 className="mt-6 text-3xl font-semibold">Day {day} complete!</h1>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          Your proof of work has been recorded. Commit, post and build are all logged against day{" "}
          {day}.
        </p>
        <p className="mt-5 inline-flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5 text-sm">
          🔥 <span className="font-medium">Your {streak}-day streak continues.</span>
        </p>
        <button
          onClick={onBack}
          className="mt-7 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 text-[0.95rem] font-medium text-primary-foreground transition-transform hover:-translate-y-0.5"
        >
          Back to Dashboard <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
