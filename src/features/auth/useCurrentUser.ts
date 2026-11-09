import { useEffect, useState } from 'react'
import { subscribeToUser } from './authApi.ts'
import type { User } from './types.ts'

/**
 * The signed-in user, kept up to date as they sign in or out.
 *
 * `isLoading` is true only on the very first render, before the stored
 * session has been read, so the app doesn't flash the sign-in form.
 */
export function useCurrentUser(): { user: User | null; isLoading: boolean } {
  const [user, setUser] = useState<User | null | undefined>(undefined)

  useEffect(() => subscribeToUser(setUser), [])

  return { user: user ?? null, isLoading: user === undefined }
}
