import { describe, expect, it } from 'vitest'
import {
  formatWeightKg,
  formatWorkoutDate,
  nextPosition,
  nextSetNumber,
  parseReps,
  parseWeightKg,
  toLocalDateString,
  withSetAdded,
} from './logic.ts'
import type { ExerciseSet, Workout } from './types.ts'

function set(setNumber: number): ExerciseSet {
  return { id: `set-${String(setNumber)}`, setNumber, reps: 10, weightKg: 60 }
}

describe('toLocalDateString', () => {
  it('uses the local calendar date, also just after midnight', () => {
    expect(toLocalDateString(new Date(2026, 10, 9, 0, 30))).toBe('2026-11-09')
  })

  it('pads month and day', () => {
    expect(toLocalDateString(new Date(2026, 0, 5))).toBe('2026-01-05')
  })
})

describe('formatWorkoutDate', () => {
  it('shows weekday, day and month', () => {
    expect(formatWorkoutDate('2026-11-09', 'en-GB')).toBe('Mon 9 Nov')
  })
})

describe('formatWeightKg', () => {
  it('shows kg with decimals as stored', () => {
    expect(formatWeightKg(82.5)).toBe('82.5 kg')
  })

  it('shows a dash for bodyweight', () => {
    expect(formatWeightKg(null)).toBe('—')
  })
})

describe('nextSetNumber', () => {
  it('starts at 1', () => {
    expect(nextSetNumber([])).toBe(1)
  })

  it('follows the highest number, even after a deleted set left a gap', () => {
    expect(nextSetNumber([set(1), set(3)])).toBe(4)
  })
})

describe('nextPosition', () => {
  it('starts at 1 and follows the highest position', () => {
    expect(nextPosition([])).toBe(1)
    expect(nextPosition([{ position: 2 }, { position: 1 }])).toBe(3)
  })
})

describe('parseReps', () => {
  it('accepts a whole number, ignoring spaces', () => {
    expect(parseReps(' 8 ')).toEqual({ ok: true, value: 8 })
  })

  it.each(['', '0', '-3', '7.5', 'ten', '1000'])('rejects %j', (input) => {
    expect(parseReps(input).ok).toBe(false)
  })
})

describe('parseWeightKg', () => {
  it('treats empty as bodyweight', () => {
    expect(parseWeightKg('  ')).toEqual({ ok: true, value: null })
  })

  it.each([
    ['60', 60],
    ['82.5', 82.5],
    ['82,5', 82.5],
    ['0', 0],
    ['9999.99', 9999.99],
  ])('parses %j as %d', (input, expected) => {
    expect(parseWeightKg(input)).toEqual({ ok: true, value: expected })
  })

  it.each(['-5', 'abc', '1.234', '10000', '1,2,3'])('rejects %j', (input) => {
    expect(parseWeightKg(input).ok).toBe(false)
  })
})

describe('withSetAdded', () => {
  const workout: Workout = {
    id: 'w1',
    performedOn: '2026-11-09',
    exercises: [
      { id: 'we1', position: 1, exercise: { id: 'e1', name: 'Bench press' }, sets: [set(1)] },
      { id: 'we2', position: 2, exercise: { id: 'e2', name: 'Pull-up' }, sets: [] },
    ],
  }

  it('appends the set to the matching exercise only', () => {
    const updated = withSetAdded(workout, 'we1', set(2))
    expect(updated.exercises[0]?.sets.map((s) => s.setNumber)).toEqual([1, 2])
    expect(updated.exercises[1]?.sets).toEqual([])
  })

  it('does not change the original workout', () => {
    withSetAdded(workout, 'we1', set(2))
    expect(workout.exercises[0]?.sets).toHaveLength(1)
  })
})
