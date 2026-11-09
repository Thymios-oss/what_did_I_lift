import { formatWeightKg } from './logic.ts'
import { SetForm } from './SetForm.tsx'
import type { WorkoutExercise } from './types.ts'

type ExerciseCardProps = {
  workoutExercise: WorkoutExercise
  /** Called when a valid set is entered for this exercise. */
  onLogSet: (reps: number, weightKg: number | null) => void
  /** Called when a set's ✕ is tapped. */
  onDeleteSet: (setId: string) => void
}

/**
 * One exercise in today's workout: its name, the sets logged so far
 * (numbered 1, 2, 3… on screen, each with a ✕ to delete), and a form for
 * the next set, pre-filled from the last one.
 */
export function ExerciseCard({ workoutExercise, onLogSet, onDeleteSet }: ExerciseCardProps) {
  const { exercise, sets } = workoutExercise
  return (
    <article className="flex flex-col gap-3 rounded-xl border border-slate-200 p-4">
      <h3 className="text-lg font-semibold">{exercise.name}</h3>
      {sets.length > 0 && (
        <ol className="flex flex-col">
          {sets.map((set, index) => (
            <li key={set.id} className="flex items-center gap-4 text-lg">
              <span className="w-6 text-slate-500">{index + 1}</span>
              <span className="flex-1">
                {set.reps} × {formatWeightKg(set.weightKg)}
              </span>
              <button
                type="button"
                aria-label={`Delete set ${String(index + 1)}`}
                className="min-h-12 min-w-12 text-xl text-slate-400 active:text-red-700"
                onClick={() => {
                  onDeleteSet(set.id)
                }}
              >
                ✕
              </button>
            </li>
          ))}
        </ol>
      )}
      <SetForm lastSet={sets.at(-1)} onLogSet={onLogSet} />
    </article>
  )
}
