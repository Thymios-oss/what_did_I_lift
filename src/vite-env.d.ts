/**
 * Types for the settings Vite reads from `.env.local` and exposes as
 * `import.meta.env`. Only names starting with `VITE_` reach the browser.
 */
interface ImportMetaEnv {
  /** Supabase API address, e.g. http://127.0.0.1:54321 locally. */
  readonly VITE_SUPABASE_URL: string
  /** Public anon key. Never the service_role key. */
  readonly VITE_SUPABASE_ANON_KEY: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
