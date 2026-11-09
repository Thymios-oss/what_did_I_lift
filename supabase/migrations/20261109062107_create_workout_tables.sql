-- Slice 1: workouts, the exercise catalog and logged sets. RLS on every table.

create table public.exercise (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null default auth.uid() references auth.users (id) on delete cascade,
  name       text not null check (length(trim(name)) > 0),
  created_at timestamptz not null default now()
);
create unique index exercise_user_name_key on public.exercise (user_id, lower(name));

create table public.workout (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null default auth.uid() references auth.users (id) on delete cascade,
  performed_on date not null,
  name         text,
  created_at   timestamptz not null default now()
);

create table public.workout_exercise (
  id          uuid primary key default gen_random_uuid(),
  workout_id  uuid not null references public.workout (id) on delete cascade,
  exercise_id uuid not null references public.exercise (id) on delete restrict,
  position    int  not null check (position > 0)
);

create table public.exercise_set (
  id                  uuid primary key default gen_random_uuid(),
  workout_exercise_id uuid not null references public.workout_exercise (id) on delete cascade,
  set_number          int  not null check (set_number > 0),
  reps                int  not null check (reps > 0),
  weight_kg           numeric(6,2) check (weight_kg >= 0),
  created_at          timestamptz not null default now(),
  unique (workout_exercise_id, set_number)
);

alter table public.exercise         enable row level security;
alter table public.workout          enable row level security;
alter table public.workout_exercise enable row level security;
alter table public.exercise_set     enable row level security;

create policy "own exercises" on public.exercise for all to authenticated
  using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));

create policy "own workouts" on public.workout for all to authenticated
  using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));

-- A workout may only reference the user's own exercises.
create policy "own workout exercises" on public.workout_exercise for all to authenticated
  using (exists (select 1 from public.workout w
                 where w.id = workout_id and w.user_id = (select auth.uid())))
  with check (
    exists (select 1 from public.workout w
            where w.id = workout_id and w.user_id = (select auth.uid()))
    and exists (select 1 from public.exercise e
                where e.id = exercise_id and e.user_id = (select auth.uid())));

create policy "own sets" on public.exercise_set for all to authenticated
  using (exists (select 1 from public.workout_exercise we
                 join public.workout w on w.id = we.workout_id
                 where we.id = workout_exercise_id and w.user_id = (select auth.uid())))
  with check (exists (select 1 from public.workout_exercise we
                      join public.workout w on w.id = we.workout_id
                      where we.id = workout_exercise_id and w.user_id = (select auth.uid())));
