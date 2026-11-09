import { useQuery } from '@tanstack/react-query'
import { getWorkoutForDate } from './workoutsApi.ts'

/** TanStack Query cache keys for workouts: one cache entry per day. */
export const workoutKeys = {
  forDate: (performedOn: string) => ['workout', performedOn] as const,
}

/**
 * The workout for one day, cached.
 *
 * `data` is `undefined` while loading, `null` if nothing is logged that day,
 * otherwise the `Workout`.
 */
export function useWorkout(performedOn: string) {
  return useQuery({
    queryKey: workoutKeys.forDate(performedOn),
    queryFn: () => getWorkoutForDate(performedOn),
  })
}
