import type { Exercise } from '../exercises/types.ts'

/** One logged set, e.g. 8 reps at 72.5 kg. */
export interface ExerciseSet {
  id: string
  /** Order within the exercise (1, 2, 3…). Can have gaps after a set is deleted. */
  setNumber: number
  reps: number
  /** Null for bodyweight sets. */
  weightKg: number | null
}

/** One exercise as done in a particular workout, with its sets in order. */
export interface WorkoutExercise {
  /** Id of this exercise-in-workout, not of the catalog exercise. */
  id: string
  /** Order within the workout (1 = first exercise done). */
  position: number
  exercise: Exercise
  sets: ExerciseSet[]
}

/** One training session: a day, and the exercises done in it. */
export interface Workout {
  id: string
  /** Local calendar date, YYYY-MM-DD. */
  performedOn: string
  exercises: WorkoutExercise[]
}

/** What is needed to save a set; the database assigns the id. */
export interface NewSet {
  workoutExerciseId: string
  setNumber: number
  reps: number
  weightKg: number | null
}

/**
 * The result of parsing what the user typed: either the value, or an error
 * message to show. Check `ok` before reading `value`.
 */
export type ParseResult<T> = { ok: true; value: T } | { ok: false; error: string }
