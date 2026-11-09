import { SignInForm } from './features/auth/SignInForm.tsx'
import { SignOutButton } from './features/auth/SignOutButton.tsx'
import { useCurrentUser } from './features/auth/useCurrentUser.ts'
import { TodayWorkout } from './features/workouts/TodayWorkout.tsx'

/**
 * The whole app: a header, then the sign-in form when signed out or today's
 * workout when signed in. Renders neither while the stored session loads.
 */
function App() {
  const { user, isLoading } = useCurrentUser()

  return (
    <main className="mx-auto min-h-dvh max-w-md bg-white px-4 py-6 text-slate-900">
      <header className="mb-6 flex items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">What did I lift?</h1>
        {user && <SignOutButton />}
      </header>
      {!isLoading && !user && <SignInForm />}
      {user && <TodayWorkout />}
    </main>
  )
}

export default App
