import { useState, type SubmitEvent } from 'react'
import { Button } from '../../components/ui/Button.tsx'
import { Input } from '../../components/ui/Input.tsx'
import { useSignIn, useSignUp } from './useAuthActions.ts'

/**
 * Email and password form with two actions: "Sign in" (submit) and
 * "Create account". Shows the error from whichever was tried last.
 */
export function SignInForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const signIn = useSignIn()
  const signUp = useSignUp()
  const isPending = signIn.isPending || signUp.isPending
  const error = signIn.error ?? signUp.error

  /** Submit (button or Enter key): clears a stale sign-up error, then signs in. */
  function handleSignIn(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault()
    signUp.reset()
    signIn.mutate({ email, password })
  }

  /** "Create account": clears a stale sign-in error, then signs up with the same fields. */
  function handleSignUp() {
    signIn.reset()
    signUp.mutate({ email, password })
  }

  return (
    <form onSubmit={handleSignIn} className="flex flex-col gap-4">
      <Input
        label="Email"
        type="email"
        autoComplete="email"
        required
        value={email}
        onChange={(event) => {
          setEmail(event.target.value)
        }}
      />
      <Input
        label="Password"
        type="password"
        autoComplete="current-password"
        required
        minLength={6}
        value={password}
        onChange={(event) => {
          setPassword(event.target.value)
        }}
      />
      {error && <p className="text-red-700">{error.message}</p>}
      <Button type="submit" disabled={isPending}>
        Sign in
      </Button>
      <Button variant="secondary" disabled={isPending} onClick={handleSignUp}>
        Create account
      </Button>
    </form>
  )
}
