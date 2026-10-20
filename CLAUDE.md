# What Did I Lift

## Goal

A minimalistic training log app so that I can track my workouts and my progress. It should be something really simple to start, easy to grow later.

Later, when needed:

- Auth (Supabase Auth) + `user_id` columns with row-level security
- Charts (Recharts) for progress
- A calendar look

## Stack

- **Frontend:** Vite + React + TypeScript
- **Styling:** Tailwind CSS
- **Backend/DB:** Supabase (hosted Postgres, auto REST API via supabase-js, auth available later) — no server code to write
- **Hosting:** any static host (Vercel / Netlify / GitHub Pages), free tier

## Data model

```
workout_day      (id, date)
workout          (id, day_id, name)
exercise         (id, name)                 -- reusable catalog
workout_exercise (id, workout_id, exercise_id)
set              (id, workout_exercise_id, set_number, reps, weight)
```

Each set is its own row, recorded in the order performed (`set_number`). No warm-up flag — warm-ups are simply the earlier sets. Set count is derived.

## Architectural principles

- Follow clean code conventions.

### Structure

- **Feature-based folders:** `src/features/workouts/`, `src/features/exercises/`, etc. Each holds its own components, hooks and API calls. Shared code lives in `src/lib/` (Supabase client, utils) and `src/components/ui/` (buttons, inputs).
- **Separate data layer:** components never call `supabase` directly. All queries go through a per-feature API module (e.g. `workoutsApi.ts`), so changing the backend or adding auth only touches one layer.
- **Logic in hooks:** components stay presentational; state and data fetching live in custom hooks (e.g. `useWorkoutDay(date)`).

### Data & types

- **Generated DB types:** use `supabase gen types typescript` so types always match the schema. Don't hand-write table types.
- **Migrations as SQL files:** every schema change is a file in `supabase/migrations/`, never a dashboard edit.
- **Derive, don't store:** set count, volume and PRs are computed from `set` rows.
- **One unit:** store weight in kg as a number; convert only for display.

### State & fetching

- **TanStack Query** for server state (caching, loading/error states, refetch after mutations). No global store; plain `useState` for local UI state.

### Code style

- **TypeScript strict mode**, no `any`.
- **Naming:** `snake_case` in the DB, `camelCase` in TS; map between them in the API layer.
- **Small functions** with a single responsibility and names that say what they do. No dead or commented-out code.
- **ESLint + Prettier**, enforced on commit (lint-staged).

### Process

- **Config in env:** Supabase URL and anon key in `.env.local` (git-ignored), with a committed `.env.example`.
- **Tests where logic lives:** Vitest for derived calculations and hooks; skip UI tests for now.
- **Vertical slices:** build each feature end to end (DB → API → UI) before starting the next.
