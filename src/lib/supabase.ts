import { createClient } from '@supabase/supabase-js'
import type { Database } from './database.types.ts'

type SupabaseEnvVar = 'VITE_SUPABASE_URL' | 'VITE_SUPABASE_ANON_KEY'

function readEnv(name: SupabaseEnvVar): string {
  const value = import.meta.env[name]
  if (!value) {
    throw new Error(`Missing ${name}. Copy .env.example to .env.local and fill it in.`)
  }
  return value
}

export const supabase = createClient<Database>(
  readEnv('VITE_SUPABASE_URL'),
  readEnv('VITE_SUPABASE_ANON_KEY'),
)
