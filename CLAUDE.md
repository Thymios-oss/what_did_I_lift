# What Did I Lift

## Goal

A minimalistic training log app so that I can track my workouts and my progress. It should be something really simple to start, easy to grow later.

Later, when needed (do not start these without asking):

- Charts (Recharts) for progress
- A calendar look

## Status

No code yet. First slice: log today's workout (pick or add an exercise, record sets with reps and weight).
Update this section when a slice lands.

## Stack

- **Frontend:** Vite + React + TypeScript
- **Styling:** Tailwind CSS
- **Backend/DB:** Supabase (hosted Postgres, auto REST API via supabase-js, Supabase Auth) — no server code to write
- **Hosting:** any static host (Vercel / Netlify / GitHub Pages), free tier

## Commands

To be filled in by the scaffolding PR:

- `npm run dev` — start the app
- `npm run build` — production build
- `npm run typecheck` — `tsc --noEmit`
- `npm run lint` / `npm run format`
- `npm test` — Vitest
- `npx supabase start` — local Supabase
- `npx supabase migration new <name>` — new migration file
- `npm run db:types` — regenerate `src/lib/database.types.ts`

## Data model

```
workout          (id, user_id, performed_on date, name, created_at)
exercise         (id, user_id, name, created_at)              -- reusable catalog
workout_exercise (id, workout_id, exercise_id, position)
workout_set      (id, workout_exercise_id, set_number, reps, weight_kg, created_at)
```

- Each set is its own row, recorded in the order performed (`set_number`). No warm-up flag: warm-ups are simply the earlier sets. Set count is derived.
- Ids are `uuid default gen_random_uuid()`; timestamps are `timestamptz default now()`.
- `performed_on` is the local calendar date you trained, not a timestamp.
- `weight_kg` is `numeric(6,2)`, nullable for bodyweight moves.
- Constraints: `reps > 0`, `weight_kg >= 0`, `unique (workout_exercise_id, set_number)`, `exercise.name` unique per user, case-insensitive.
- Deletes cascade from `workout` down to `workout_set`. An `exercise` in use cannot be deleted (`on delete restrict`).

## Security

- RLS is enabled on every table from the first migration. Policies check `user_id = auth.uid()` (child tables via their parent).
- Only the Supabase anon key appears in frontend code. The `service_role` key never does.
- Supabase URL and anon key live in `.env.local` (git-ignored), with a committed `.env.example`.

## Architectural principles

### Structure

- **Feature-based folders:** `src/features/workouts/`, `src/features/exercises/`, etc. Each holds its own components, hooks, API module, `types.ts` and `logic.ts`. Shared code lives in `src/lib/` (Supabase client, utils) and `src/components/ui/` (buttons, inputs).
- **Separate data layer:** components and hooks never call `supabase` directly. All queries go through a per-feature API module (e.g. `workoutsApi.ts`). An ESLint `no-restricted-imports` rule allows `@supabase/supabase-js` only in `*Api.ts` and `src/lib/supabase.ts`.
- **Pure logic, thin hooks:** calculations (volume, PRs, set count) are pure functions in `logic.ts`. Hooks only wire TanStack Query to the API module. Components stay presentational.

### Data & types

- **Generated DB types** live in `src/lib/database.types.ts`, regenerated with `npm run db:types`, never edited by hand.
- **Domain types** are camelCase, in each feature's `types.ts`. Only `*Api.ts` imports the generated types and maps rows (`snake_case`) to domain types (`camelCase`).
- **Migrations as SQL files:** every schema change is a new file in `supabase/migrations/`, never a dashboard edit, and never an edit to an applied migration.
- **Derive, don't store:** set count, volume and PRs are computed from `workout_set` rows.
- **One unit:** store weight in kg; convert only for display.

### State & fetching

- **TanStack Query** for server state (caching, loading/error states, refetch after mutations). Logging a set uses an optimistic update.
- No global store; plain `useState` for local UI state.

### UX

- **Mobile first:** you log sets on a phone between lifts. Large tap targets, numeric keyboard for reps and weight, one-thumb flow.
- **Forgiving entry:** every logged item can be edited or deleted afterwards.

### Code style

- **TypeScript strict mode**, no `any`.
- **Small functions** with a single responsibility and names that say what they do. No dead or commented-out code.
- **ESLint + Prettier**, enforced on commit with husky + lint-staged.

### Process

- **Tests where logic lives:** Vitest for the pure functions in `logic.ts`. Hook tests only when a hook has real branching. No UI tests for now.
- **Vertical slices:** build each feature end to end (migration → types → API → hook → UI) before starting the next.

## Definition of done

- `typecheck`, `lint` and `test` all pass.
- New logic has a test.
- A schema change ships with its migration and regenerated types.
- The PR or commit message says what was checked by hand.

## AI guardrails

**Do freely**

- Edit code inside the feature you were asked to work on.
- Add a new migration file, regenerate DB types, add or update tests.
- Run typecheck, lint and tests as often as needed.

**Ask first**

- Adding, removing or upgrading a dependency.
- Any schema change: show the migration SQL before writing it.
- Touching another feature's folder, `src/lib/`, or project config (Vite, Tailwind, ESLint, tsconfig).
- Starting anything from the "Later" list.
- Pushing to `main`. Small changes may go straight to `main` only when Thymios asks; otherwise use a branch and a PR.

**Never**

- Edit a migration that has already been applied.
- Hand-edit `database.types.ts`.
- Commit `.env.local`, keys, or real data.
- Use the `service_role` key in frontend code.
- Run destructive SQL (`drop`, `truncate`, bulk `delete`) against the hosted database.
- Disable or weaken a lint rule, a TS strict flag, or a test to make a check pass.
- Add `any`, `@ts-ignore` or `eslint-disable` without a one-line comment saying why.

**Working style**

- Keep each change to one slice or one fix. No drive-by refactors.
- If a request conflicts with this file, say so and ask instead of silently picking one.
- When a product decision is unclear (what a screen shows, how a lift is entered), ask instead of inventing.
