import type { Tables } from '../../lib/database.types.ts'
import { supabase } from '../../lib/supabase.ts'
import { findExerciseByName } from './logic.ts'
import type { Exercise } from './types.ts'

/** The `exercise` table columns this module reads. */
type ExerciseRow = Pick<Tables<'exercise'>, 'id' | 'name'>

/** Maps a database row to the app's `Exercise`. */
function toExercise(row: ExerciseRow): Exercise {
  return { id: row.id, name: row.name }
}

/**
 * All of the signed-in user's exercises, A–Z. RLS limits the rows to the
 * user's own, so there is no user filter here.
 */
export async function listExercises(): Promise<Exercise[]> {
  const { data, error } = await supabase.from('exercise').select('id, name').order('name')
  if (error) {
    throw error
  }
  return data.map(toExercise)
}

/**
 * Adds a new exercise to the catalog. `user_id` is filled in by the database.
 *
 * @throws If the name is blank or the user already has one with that name.
 */
async function createExercise(name: string): Promise<Exercise> {
  const { data, error } = await supabase
    .from('exercise')
    .insert({ name: name.trim() })
    .select('id, name')
    .single()
  if (error) {
    throw error
  }
  return toExercise(data)
}

/** Returns the user's exercise with this name (any case), creating it first if it doesn't exist. */
export async function findOrCreateExercise(name: string): Promise<Exercise> {
  const existing = findExerciseByName(await listExercises(), name)
  return existing ?? createExercise(name)
}
