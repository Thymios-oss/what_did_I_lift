import type { Session } from '@supabase/supabase-js'
import { supabase } from '../../lib/supabase.ts'
import type { Credentials, User } from './types.ts'

/** Maps a Supabase session to the app's `User`, or `null` when signed out. */
function toUser(session: Session | null): User | null {
  if (!session) {
    return null
  }
  return { id: session.user.id, email: session.user.email ?? '' }
}

/**
 * Listens for who is signed in.
 *
 * Calls `callback` once right away with the current user (restored from the
 * browser's storage), then again on every sign-in, sign-out or token refresh.
 *
 * @returns A function that stops listening; call it on unmount.
 */
export function subscribeToUser(callback: (user: User | null) => void): () => void {
  const { data } = supabase.auth.onAuthStateChange((_event, session) => {
    callback(toUser(session))
  })
  return () => {
    data.subscription.unsubscribe()
  }
}

/**
 * Signs in with email and password. The new session reaches the app through
 * {@link subscribeToUser}, not through this function's return value.
 *
 * @throws The Supabase auth error, e.g. "Invalid login credentials".
 */
export async function signIn({ email, password }: Credentials): Promise<void> {
  const { error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) {
    throw error
  }
}

/**
 * Creates an account. With email confirmation off (the local default) the
 * user is signed in straight away; with it on, they must confirm by email first.
 *
 * @throws The Supabase auth error, e.g. a password that is too short.
 */
export async function signUp({ email, password }: Credentials): Promise<void> {
  const { error } = await supabase.auth.signUp({ email, password })
  if (error) {
    throw error
  }
}

/** Signs out and removes the session from the browser. */
export async function signOut(): Promise<void> {
  const { error } = await supabase.auth.signOut()
  if (error) {
    throw error
  }
}
