import { useId, useState, type SubmitEvent } from 'react'
import { Button } from '../../components/ui/Button.tsx'
import { Input } from '../../components/ui/Input.tsx'

type AddExerciseFormProps = {
  /** Suggested while typing; a new name is added to the catalog. */
  exerciseNames: readonly string[]
  /** Disables "Add" while an exercise is being added. */
  isPending: boolean
  /** Message to show if adding failed. */
  error: string | undefined
  /** Called with the typed name; call `onAdded` once it is saved, to clear the field. */
  onAdd: (name: string, onAdded: () => void) => void
}

/**
 * A field and "Add" button for putting an exercise into today's workout.
 * The browser suggests matching names from the catalog as you type.
 */
export function AddExerciseForm({ exerciseNames, isPending, error, onAdd }: AddExerciseFormProps) {
  const [name, setName] = useState('')
  const suggestionsId = useId()

  /** Ignores an empty name; otherwise adds it and clears the field once saved. */
  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault()
    if (name.trim() === '') {
      return
    }
    onAdd(name, () => {
      setName('')
    })
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      <div className="flex items-end gap-2">
        <Input
          label="Add exercise"
          placeholder="e.g. Bench press"
          autoCapitalize="sentences"
          list={suggestionsId}
          className="flex-1"
          value={name}
          onChange={(event) => {
            setName(event.target.value)
          }}
        />
        <Button type="submit" disabled={isPending}>
          Add
        </Button>
      </div>
      <datalist id={suggestionsId}>
        {exerciseNames.map((exerciseName) => (
          <option key={exerciseName} value={exerciseName} />
        ))}
      </datalist>
      {error && <p className="text-sm text-red-700">{error}</p>}
    </form>
  )
}
