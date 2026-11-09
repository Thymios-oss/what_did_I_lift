import { Button } from '../../components/ui/Button.tsx'
import { useSignOut } from './useAuthActions.ts'

/** Header button that signs out; disabled while signing out. */
export function SignOutButton() {
  const signOut = useSignOut()
  return (
    <Button
      variant="secondary"
      disabled={signOut.isPending}
      onClick={() => {
        signOut.mutate()
      }}
    >
      Sign out
    </Button>
  )
}
