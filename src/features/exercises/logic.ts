import type { Exercise } from './types.ts'

/**
 * Finds the exercise with this name, ignoring case and surrounding spaces,
 * the same way the database's unique-name rule compares them.
 *
 * @example findExerciseByName(exercises, '  bench PRESS ') // → the "Bench press" entry
 * @returns The match, or `undefined` if the name is new.
 */
export function findExerciseByName(
  exercises: readonly Exercise[],
  name: string,
): Exercise | undefined {
  const wanted = name.trim().toLowerCase()
  return exercises.find((exercise) => exercise.name.toLowerCase() === wanted)
}
