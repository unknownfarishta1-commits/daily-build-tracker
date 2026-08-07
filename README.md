# ABTalks — 60-Day Challenge

A premium, mobile-first frontend for the ABTalks 60-day coding challenge.

## Problem statement summary

ABTalks runs a 60-day coding challenge for Indian college students. Students pick a track,
build something every day, and maintain a public learning streak by submitting a GitHub
commit and a LinkedIn post. The product worked but had never been properly designed. Most
students open it on a phone, late at night, after college — so the experience is designed
at 390px first and scaled up.

## Route map

```
/
/dashboard
/day/12
```

All routes work on direct URL access (server-rendered by TanStack Start). `/day/:day`
accepts any day from 1–60; day 1, 11 and 12 have fully authored briefs, others fall back
to a generic-but-valid brief so the UI never breaks.

## Features

- **Landing** — hero, 4-step "how it works", live dashboard preview, why-60-days, final CTA.
- **Dashboard** — greeting, streak card with 60-segment progress, Momentum Coach, today's
  mission, proof status, achievements rail (locked/unlocked), recent activity.
- **Challenge Day** — mission brief, requirements, skills, three validated proof inputs,
  live proof checklist, loading state, success screen.
- **Momentum Coach** (thoughtful feature) — a contextual card that rewrites itself based on
  streak length, whether today is already submitted, whether a day was missed, and whether
  it's day 1. It names the next badge you'll unlock instead of showing a static tip.
- **Edge states** — first day (0 streak, 0%, no fake achievements), missed day (recovery
  task, non-punitive tone), empty profile ("Welcome, Builder" + complete-profile prompt).
  A **Demo states** switcher at the bottom of the dashboard toggles between them.
- **Persistence** — submissions and the selected demo state are stored in `localStorage`
  (`abtalks.state.v1`); progress, streak and checklists derive from that.

## Tech stack

React 19 · TanStack Start (Vite) · TypeScript · Tailwind CSS v4 · lucide-react ·
local mock data · localStorage. No auth, no backend, no database.

## Local setup

```bash
bun install
bun run dev     # http://localhost:8080
```

## Deployment

```bash
bun run build
```

Deploy the build output to any Node/edge host (the project targets an edge worker runtime).
On Lovable, press **Publish**.

## Design decisions

- **One accent, used sparingly.** Electric violet for actions and progress, green only for
  completed states, amber only for the missed-day warning. Everything else is near-black
  surfaces and muted gray text.
- **Tokens, not ad-hoc colors.** All colors, radii, shadows and fonts live in
  `src/styles.css` as oklch tokens; components only use semantic classes.
- **Typography** — Space Grotesk for headings (tight tracking), Inter for body, JetBrains
  Mono for numeric/meta labels so counters read like a developer tool.
- **Mobile-first** — 20px side padding, ≥44px tap targets, single-column stacking,
  `grid-cols-[minmax(0,1fr)_auto]` header rows with `min-w-0`/`truncate` so nothing clips
  or scrolls horizontally at 390px. Desktop uses centered max-width containers and
  multi-column grids rather than stretched mobile cards.
- **Motion is subtle** — 0.4s rise/pop easings on mount, 1–2px lifts on press, animated
  progress widths. Nothing blocks interaction.

## Data

`src/data/mockData.ts` holds challenges, student scenarios, achievements and recent
activity. `src/lib/challenge-state.ts` owns localStorage, derived progress and URL
validation.
