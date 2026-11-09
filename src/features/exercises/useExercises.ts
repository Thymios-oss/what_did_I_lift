import { useQuery } from '@tanstack/react-query'
import { listExercises } from './exercisesApi.ts'

/** TanStack Query cache keys for exercises; used to refetch after a change. */
export const exerciseKeys = {
  all: ['exercises'] as const,
}

/** The user's exercise catalog, cached; `data` is undefined until it has loaded. */
export function useExercises() {
  return useQuery({ queryKey: exerciseKeys.all, queryFn: listExercises })
}
