import { createClient } from '@supabase/supabase-js'
import type { Database } from './database.types.ts'

/** The two settings the client needs, read from `.env.local`. */
type SupabaseEnvVar = 'VITE_SUPABASE_URL' | 'VITE_SUPABASE_ANON_KEY'

/**
 * Reads a setting from the environment.
 *
 * @throws When it is missing or empty, with a hint on how to fix it, so a
 *   missing `.env.local` fails loudly at startup instead of on the first query.
 */
function readEnv(name: SupabaseEnvVar): string {
  const value = import.meta.env[name]
  if (!value) {
    throw new Error(`Missing ${name}. Copy .env.example to .env.local and fill it in.`)
  }
  return value
}

/**
 * The app's single connection to Supabase: database queries and sign-in.
 *
 * Typed with the generated `Database` types, so table and column names are
 * checked by TypeScript. Uses the public anon key; row-level security in the
 * database decides what each signed-in user may read and write.
 *
 * Only `*Api.ts` modules may import this (enforced by ESLint).
 */
export const supabase = createClient<Database>(
  readEnv('VITE_SUPABASE_URL'),
  readEnv('VITE_SUPABASE_ANON_KEY'),
)
