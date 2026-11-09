import type { ExerciseSet, ParseResult, Workout } from './types.ts'

const MAX_REPS = 999
// weight_kg is numeric(6,2) in the database.
const MAX_WEIGHT_KG = 9999.99

/**
 * The date as YYYY-MM-DD in the user's own time zone.
 *
 * Used instead of `toISOString()`, which is UTC: in Sweden a set logged at
 * 00:30 would otherwise count for the previous day.
 *
 * @example toLocalDateString(new Date(2026, 10, 9, 0, 30)) // → '2026-11-09'
 */
export function toLocalDateString(date: Date): string {
  const year = String(date.getFullYear())
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

/**
 * A short, readable date for headings.
 *
 * @param isoDate - A date as YYYY-MM-DD.
 * @param locale - Leave out to use the browser's language.
 * @example formatWorkoutDate('2026-11-09', 'en-GB') // → 'Mon 9 Nov'
 */
export function formatWorkoutDate(isoDate: string, locale?: string): string {
  // A date-time without a zone is read as local time, so the day can't shift.
  const date = new Date(`${isoDate}T00:00:00`)
  return date.toLocaleDateString(locale, { weekday: 'short', day: 'numeric', month: 'short' })
}

/**
 * A set's weight for display.
 *
 * @example formatWeightKg(82.5) // → '82.5 kg'
 * @example formatWeightKg(null) // → '—' (bodyweight)
 */
export function formatWeightKg(weightKg: number | null): string {
  return weightKg === null ? '—' : `${String(weightKg)} kg`
}

/**
 * The set number for the next set: one above the highest so far, or 1.
 * Uses the highest rather than the count, so a deleted set can't cause a clash.
 */
export function nextSetNumber(sets: readonly ExerciseSet[]): number {
  return sets.reduce((highest, set) => Math.max(highest, set.setNumber), 0) + 1
}

/** The position for the next exercise in a workout: one above the highest so far, or 1. */
export function nextPosition(items: readonly { position: number }[]): number {
  return items.reduce((highest, item) => Math.max(highest, item.position), 0) + 1
}

/**
 * Reads the reps field: a whole number from 1 to 999, spaces ignored.
 *
 * @example parseReps(' 8 ') // → { ok: true, value: 8 }
 * @example parseReps('7.5') // → { ok: false, error: 'Reps must be…' }
 */
export function parseReps(input: string): ParseResult<number> {
  const trimmed = input.trim()
  const reps = Number(trimmed)
  if (!/^\d+$/.test(trimmed) || reps < 1 || reps > MAX_REPS) {
    return { ok: false, error: `Reps must be a whole number from 1 to ${String(MAX_REPS)}.` }
  }
  return { ok: true, value: reps }
}

/**
 * Reads the kg field: 0 to 9999.99 with at most 2 decimals, or empty for a
 * bodyweight set. Accepts a decimal comma, which phone keyboards in Sweden show.
 *
 * @example parseWeightKg('82,5') // → { ok: true, value: 82.5 }
 * @example parseWeightKg('')     // → { ok: true, value: null } (bodyweight)
 * @example parseWeightKg('-5')   // → { ok: false, error: 'Weight must be…' }
 */
export function parseWeightKg(input: string): ParseResult<number | null> {
  const normalized = input.trim().replace(',', '.')
  if (normalized === '') {
    return { ok: true, value: null }
  }
  const weightKg = Number(normalized)
  if (!/^\d+(\.\d{1,2})?$/.test(normalized) || weightKg > MAX_WEIGHT_KG) {
    return {
      ok: false,
      error: `Weight must be 0 to ${String(MAX_WEIGHT_KG)} kg, at most 2 decimals.`,
    }
  }
  return { ok: true, value: weightKg }
}

/**
 * A copy of the workout with `set` added to the end of one exercise's sets.
 *
 * Used for the optimistic update: the set appears on screen before the
 * database has saved it. The original workout is left untouched.
 *
 * @param workoutExerciseId - Which exercise in the workout gets the set.
 */
export function withSetAdded(
  workout: Workout,
  workoutExerciseId: string,
  set: ExerciseSet,
): Workout {
  return {
    ...workout,
    exercises: workout.exercises.map((workoutExercise) =>
      workoutExercise.id === workoutExerciseId
        ? { ...workoutExercise, sets: [...workoutExercise.sets, set] }
        : workoutExercise,
    ),
  }
}
