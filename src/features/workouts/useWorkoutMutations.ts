import { useMutation, useQueryClient } from '@tanstack/react-query'
import { exerciseKeys } from '../exercises/useExercises.ts'
import { withSetAdded } from './logic.ts'
import type { NewSet, Workout } from './types.ts'
import { workoutKeys } from './useWorkout.ts'
import { addExerciseToWorkout, deleteSet, logSet } from './workoutsApi.ts'

/**
 * Add an exercise to the day's workout with `mutate(name)`.
 *
 * When done, refetches the workout (new card) and the catalog (in case the
 * name was new, so it is suggested next time).
 */
export function useAddExercise(performedOn: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (exerciseName: string) => addExerciseToWorkout(performedOn, exerciseName),
    onSettled: () =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: workoutKeys.forDate(performedOn) }),
        queryClient.invalidateQueries({ queryKey: exerciseKeys.all }),
      ]),
  })
}

/**
 * Log a set with `mutate(newSet)`. Optimistic: the set shows up immediately.
 *
 * 1. `onMutate`: pause any refetch, remember the current workout, and put
 *    the new set into the cache with a temporary id.
 * 2. `onError`: put the remembered workout back, so the set disappears.
 * 3. `onSettled` (success or not): refetch, replacing the temporary set
 *    with the saved one.
 */
export function useLogSet(performedOn: string) {
  const queryClient = useQueryClient()
  const queryKey = workoutKeys.forDate(performedOn)
  return useMutation({
    mutationFn: logSet,
    onMutate: async (newSet: NewSet) => {
      await queryClient.cancelQueries({ queryKey })
      const previous = queryClient.getQueryData<Workout | null>(queryKey)
      if (previous) {
        const pendingSet = {
          id: crypto.randomUUID(),
          setNumber: newSet.setNumber,
          reps: newSet.reps,
          weightKg: newSet.weightKg,
        }
        queryClient.setQueryData<Workout | null>(
          queryKey,
          withSetAdded(previous, newSet.workoutExerciseId, pendingSet),
        )
      }
      return { previous }
    },
    onError: (_error, _newSet, context) => {
      queryClient.setQueryData(queryKey, context?.previous)
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey }),
  })
}

/** Delete a set with `mutate(setId)`; refetches the workout when done. */
export function useDeleteSet(performedOn: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteSet,
    onSettled: () => queryClient.invalidateQueries({ queryKey: workoutKeys.forDate(performedOn) }),
  })
}
