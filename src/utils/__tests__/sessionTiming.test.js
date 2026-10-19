import { describe, it, expect } from 'vitest'
import { getSessionTiming, timingLabel } from '../sessionTiming'

const START = '2026-10-24T17:00:00+02:00'
const at = (iso) => new Date(iso)

describe('getSessionTiming', () => {
  it('is upcoming more than 10 minutes before start', () => {
    const t = getSessionTiming(START, 45, at('2026-10-24T16:30:00+02:00'))
    expect(t.state).toBe('upcoming')
    expect(t.canJoin).toBe(false)
  })

  it('opens the room 10 minutes before start', () => {
    const t = getSessionTiming(START, 45, at('2026-10-24T16:52:00+02:00'))
    expect(t).toMatchObject({ state: 'open', canJoin: true, minutesToStart: 8 })
  })

  it('is live during the session and ended after it', () => {
    expect(getSessionTiming(START, 45, at('2026-10-24T17:20:00+02:00')).state).toBe('live')
    expect(getSessionTiming(START, 45, at('2026-10-24T17:45:00+02:00')).state).toBe('ended')
  })
})

describe('timingLabel', () => {
  it('says minutes, hours or days', () => {
    expect(timingLabel({ state: 'open', minutesToStart: 8 })).toBe('Starts in 8 minutes')
    expect(timingLabel({ state: 'upcoming', minutesToStart: 180 })).toBe('Starts in 3 hours')
    expect(timingLabel({ state: 'upcoming', minutesToStart: 3000 })).toBe('Starts in 2 days')
  })
})