import { useExercises } from '../exercises/useExercises.ts'
import { AddExerciseForm } from './AddExerciseForm.tsx'
import { ExerciseCard } from './ExerciseCard.tsx'
import { formatWorkoutDate, nextSetNumber, toLocalDateString } from './logic.ts'
import { useWorkout } from './useWorkout.ts'
import { useAddExercise, useDeleteSet, useLogSet } from './useWorkoutMutations.ts'

/**
 * The main screen: today's date, one card per exercise done today, and the
 * field for adding the next exercise.
 *
 * This is the only workouts component that uses hooks; it loads the data,
 * passes it down, and turns taps on the cards into saves and deletes.
 */
export function TodayWorkout() {
  const today = toLocalDateString(new Date())
  const workout = useWorkout(today)
  const exercises = useExercises()
  const addExercise = useAddExercise(today)
  const logSet = useLogSet(today)
  const deleteSet = useDeleteSet(today)
  const saveError = logSet.error ?? deleteSet.error

  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-lg text-slate-600">{formatWorkoutDate(today)}</h2>
      {workout.isPending && <p className="text-slate-500">Loading…</p>}
      {workout.isError && (
        <p className="text-red-700">Could not load today’s workout: {workout.error.message}</p>
      )}
      {workout.data?.exercises.map((workoutExercise) => (
        <ExerciseCard
          key={workoutExercise.id}
          workoutExercise={workoutExercise}
          onLogSet={(reps, weightKg) => {
            logSet.mutate({
              workoutExerciseId: workoutExercise.id,
              setNumber: nextSetNumber(workoutExercise.sets),
              reps,
              weightKg,
            })
          }}
          onDeleteSet={(setId) => {
            deleteSet.mutate(setId)
          }}
        />
      ))}
      {saveError && <p className="text-red-700">Could not save: {saveError.message}</p>}
      <AddExerciseForm
        exerciseNames={exercises.data?.map((exercise) => exercise.name) ?? []}
        isPending={addExercise.isPending}
        error={addExercise.error?.message}
        onAdd={(name, onAdded) => {
          addExercise.mutate(name, { onSuccess: onAdded })
        }}
      />
    </section>
  )
}
