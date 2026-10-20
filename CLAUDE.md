What_did_I_lift 

Goal: something really simple to start, easy to grow later.

Stack
Frontend: Vite + React + TypeScript
Styling: Tailwind CSS
Backend/DB: Supabase (hosted Postgres, auto REST API via supabase-js, auth available later) — no server code to write
Hosting: any static host (Vercel / Netlify / GitHub Pages), free tier
Data model
workout_day (id, date)
workout (id, day_id, name)
exercise (id, name) — reusable catalog
workout_exercise (id, workout_id, exercise_id)
set (id, workout_exercise_id, set_number, reps, weight)

Each set is its own row, recorded in the order performed (set_number). No warm-up flag — warm-ups are simply the earlier sets. Set count is derived.

Later, when needed
Auth (Supabase Auth) + user_id columns with row-level security
Charts (Recharts) for progress
A calendar look

