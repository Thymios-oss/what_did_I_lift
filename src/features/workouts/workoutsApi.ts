import type { QueryData } from '@supabase/supabase-js'
import { supabase } from '../../lib/supabase.ts'
import { findOrCreateExercise } from '../exercises/exercisesApi.ts'
import { nextPosition } from './logic.ts'
import type { NewSet, Workout } from './types.ts'

/**
 * One request that loads a workout with everything in it: its exercises
 * (each with its catalog name) and each exercise's sets.
 */
const WORKOUT_COLUMNS =
  'id, performed_on, workout_exercise(id, position, exercise(id, name), exercise_set(id, set_number, reps, weight_kg))'

/** Starts a workout query; also lets TypeScript work out the shape of the result. */
function selectWorkouts() {
  return supabase.from('workout').select(WORKOUT_COLUMNS)
}

/** One workout as the database returns it (nested, snake_case). */
type WorkoutRow = QueryData<ReturnType<typeof selectWorkouts>>[number]

/** Maps a nested database row to the app's `Workout` (camelCase). */
function toWorkout(row: WorkoutRow): Workout {
  return {
    id: row.id,
    performedOn: row.performed_on,
    exercises: row.workout_exercise.map((workoutExercise) => ({
      id: workoutExercise.id,
      position: workoutExercise.position,
      exercise: { id: workoutExercise.exercise.id, name: workoutExercise.exercise.name },
      sets: workoutExercise.exercise_set.map((set) => ({
        id: set.id,
        setNumber: set.set_number,
        reps: set.reps,
        weightKg: set.weight_kg,
      })),
    })),
  }
}

/**
 * The user's workout on a given day, with exercises and sets in the order
 * they were done.
 *
 * @param performedOn - A local date as YYYY-MM-DD.
 * @returns The workout, or `null` if nothing has been logged that day.
 *   If there were ever two, the first one created.
 */
export async function getWorkoutForDate(performedOn: string): Promise<Workout | null> {
  const { data, error } = await selectWorkouts()
    .eq('performed_on', performedOn)
    .order('created_at')
    .order('position', { referencedTable: 'workout_exercise' })
    .order('set_number', { referencedTable: 'workout_exercise.exercise_set' })
    .limit(1)
    .maybeSingle()
  if (error) {
    throw error
  }
  return data && toWorkout(data)
}

/** The id of the user's workout on that day, or `null` if there is none yet. */
async function findWorkoutId(performedOn: string): Promise<string | null> {
  const { data, error } = await supabase
    .from('workout')
    .select('id')
    .eq('performed_on', performedOn)
    .order('created_at')
    .limit(1)
    .maybeSingle()
  if (error) {
    throw error
  }
  return data?.id ?? null
}

/** Creates an empty workout for that day and returns its id. */
async function createWorkout(performedOn: string): Promise<string> {
  const { data, error } = await supabase
    .from('workout')
    .insert({ performed_on: performedOn })
    .select('id')
    .single()
  if (error) {
    throw error
  }
  return data.id
}

/**
 * Adds an exercise, by name, to the end of that day's workout.
 *
 * Steps:
 * 1. Find the day's workout, or create it (the first exercise of the day does this).
 * 2. Find the exercise in the catalog by name, or add it if it's new.
 * 3. Add it to the workout, unless it is already in it (then nothing happens).
 *
 * @param performedOn - A local date as YYYY-MM-DD.
 * @param exerciseName - What the user typed; case and spaces don't matter.
 */
export async function addExerciseToWorkout(
  performedOn: string,
  exerciseName: string,
): Promise<void> {
  const workoutId = (await findWorkoutId(performedOn)) ?? (await createWorkout(performedOn))
  const exercise = await findOrCreateExercise(exerciseName)

  const { data: current, error } = await supabase
    .from('workout_exercise')
    .select('exercise_id, position')
    .eq('workout_id', workoutId)
  if (error) {
    throw error
  }
  if (current.some((row) => row.exercise_id === exercise.id)) {
    return
  }

  const { error: insertError } = await supabase.from('workout_exercise').insert({
    workout_id: workoutId,
    exercise_id: exercise.id,
    position: nextPosition(current),
  })
  if (insertError) {
    throw insertError
  }
}

/**
 * Saves one set.
 *
 * @throws If the set number is already taken for that exercise (the database
 *   allows each number once), or reps/weight are out of range.
 */
export async function logSet(newSet: NewSet): Promise<void> {
  const { error } = await supabase.from('exercise_set').insert({
    workout_exercise_id: newSet.workoutExerciseId,
    set_number: newSet.setNumber,
    reps: newSet.reps,
    weight_kg: newSet.weightKg,
  })
  if (error) {
    throw error
  }
}

/** Deletes one set. Deleting a set that no longer exists is not an error. */
export async function deleteSet(setId: string): Promise<void> {
  const { error } = await supabase.from('exercise_set').delete().eq('id', setId)
  if (error) {
    throw error
  }
}
