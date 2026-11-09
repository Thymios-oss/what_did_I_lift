/** The signed-in user, as the app sees it (a small subset of Supabase's user). */
export interface User {
  /** Supabase Auth user id; the same value as `user_id` on every table. */
  id: string
  email: string
}

/** What the user types into the sign-in form, for both sign-in and sign-up. */
export interface Credentials {
  email: string
  password: string
}
