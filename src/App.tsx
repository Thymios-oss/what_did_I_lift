import { SignInForm } from './features/auth/SignInForm.tsx'
import { SignOutButton } from './features/auth/SignOutButton.tsx'
import { useCurrentUser } from './features/auth/useCurrentUser.ts'

function App() {
  const { user, isLoading } = useCurrentUser()

  return (
    <main className="mx-auto min-h-dvh max-w-md bg-white px-4 py-6 text-slate-900">
      <header className="mb-6 flex items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">What did I lift?</h1>
        {user && <SignOutButton />}
      </header>
      {!isLoading && !user && <SignInForm />}
      {user && <p className="text-slate-600">Signed in as {user.email}</p>}
    </main>
  )
}

export default App
