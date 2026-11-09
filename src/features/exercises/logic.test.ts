import { describe, expect, it } from 'vitest'
import { findExerciseByName } from './logic.ts'

const exercises = [
  { id: '1', name: 'Bench press' },
  { id: '2', name: 'Pull-up' },
]

describe('findExerciseByName', () => {
  it('finds an exercise ignoring case and surrounding spaces', () => {
    expect(findExerciseByName(exercises, '  bench PRESS ')).toEqual(exercises[0])
  })

  it('returns undefined when no exercise matches', () => {
    expect(findExerciseByName(exercises, 'Squat')).toBeUndefined()
  })
})
