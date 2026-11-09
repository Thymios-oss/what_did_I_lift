import { useState, type SubmitEvent } from 'react'
import { Button } from '../../components/ui/Button.tsx'
import { Input } from '../../components/ui/Input.tsx'
import { parseReps, parseWeightKg } from './logic.ts'
import type { ExerciseSet } from './types.ts'

type SetFormProps = {
  /** Pre-fills the fields so repeating the last set is one tap. */
  lastSet: ExerciseSet | undefined
  /** Called with valid values only; `weightKg` is `null` for bodyweight. */
  onLogSet: (reps: number, weightKg: number | null) => void
}

/**
 * Reps and kg fields plus "Log set", for one exercise.
 *
 * Opens the phone's number keyboard. Checks the input with `parseReps` and
 * `parseWeightKg` and shows the error instead of saving if it's invalid.
 * The fields keep their values after logging, ready for the next set.
 */
export function SetForm({ lastSet, onLogSet }: SetFormProps) {
  const [reps, setReps] = useState(lastSet ? String(lastSet.reps) : '')
  const [weight, setWeight] = useState(lastSet?.weightKg != null ? String(lastSet.weightKg) : '')
  const [error, setError] = useState<string | null>(null)

  /** Validates both fields; logs the set only if both are valid. */
  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault()
    const parsedReps = parseReps(reps)
    const parsedWeight = parseWeightKg(weight)
    if (!parsedReps.ok) {
      setError(parsedReps.error)
      return
    }
    if (!parsedWeight.ok) {
      setError(parsedWeight.error)
      return
    }
    setError(null)
    onLogSet(parsedReps.value, parsedWeight.value)
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      <div className="flex items-end gap-2">
        <Input
          label="Reps"
          inputMode="numeric"
          enterKeyHint="done"
          className="w-20"
          value={reps}
          onChange={(event) => {
            setReps(event.target.value)
          }}
        />
        <Input
          label="kg"
          inputMode="decimal"
          enterKeyHint="done"
          placeholder="—"
          className="w-24"
          value={weight}
          onChange={(event) => {
            setWeight(event.target.value)
          }}
        />
        <Button type="submit" className="flex-1">
          Log set
        </Button>
      </div>
      {error && <p className="text-sm text-red-700">{error}</p>}
    </form>
  )
}
