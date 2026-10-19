import { describe, it, expect } from 'vitest'
import { buildIcs } from '../calendar'

describe('buildIcs', () => {
  const ics = buildIcs({
    uid: 'abc',
    title: 'Speaking Club: At the doctor, A1–A2',
    start: '2026-10-24T17:00:00+02:00',
    durationMinutes: 45,
  })

  it('writes start and end in UTC', () => {
    expect(ics).toContain('DTSTART:20261024T150000Z')
    expect(ics).toContain('DTEND:20261024T154500Z')
  })

  it('escapes commas in the title', () => {
    expect(ics).toContain('SUMMARY:Speaking Club: At the doctor\\, A1–A2')
  })
})
