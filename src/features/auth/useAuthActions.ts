import { useMutation, useQueryClient } from '@tanstack/react-query'
import { signIn, signOut, signUp } from './authApi.ts'

/** Sign in with `mutate({ email, password })`; exposes `isPending` and `error` for the form. */
export function useSignIn() {
  return useMutation({ mutationFn: signIn })
}

/** Create an account with `mutate({ email, password })`. */
export function useSignUp() {
  return useMutation({ mutationFn: signUp })
}

/** Sign out with `mutate()`. Also empties the query cache (see below). */
export function useSignOut() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: signOut,
    // Drop the signed-out user's cached data so the next user never sees it.
    onSuccess: () => {
      queryClient.clear()
    },
  })
}
