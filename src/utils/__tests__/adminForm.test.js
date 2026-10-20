import { describe, it, expect } from 'vitest'
import { price, futureDate, youtubeUrl, optionalUrl, onlyErrors, fromIso, toIso, weeklyDates, linesToList } from '../adminForm'

describe('adminForm checks', () => {
  it('needs a price of 0 or more', () => {
    expect(price('')).toMatch(/Enter a price/)
    expect(price(-5)).toMatch(/negative/)
    expect(price(0)).toBe('')
  })

  it('refuses dates in the past', () => {
    const now = new Date('2026-10-20T12:00:00Z')
    expect(futureDate('2026-10-12', '15:00', now)).toMatch(/after now/)
    expect(futureDate('2026-11-06', '18:00', now)).toBe('')
  })

  it('only accepts YouTube links for lessons', () => {
    expect(youtubeUrl('https://www.youtube.com/watch?v=abc')).toBe('')
    expect(youtubeUrl('vimeo.com/88213')).toMatch(/YouTube/)
  })

  it('lets optional links stay empty', () => {
    expect(optionalUrl('')).toBe('')
    expect(optionalUrl('meet.jit.si/x')).toMatch(/https/)
    expect(optionalUrl('/img/team-jonas.jpg')).toBe('')
  })

  it('keeps only the fields with a message', () => {
    expect(onlyErrors({ title: '', price: 'Enter a price' })).toEqual({ price: 'Enter a price' })
  })
})

describe('adminForm converters', () => {
  it('turns date + time into ISO and back', () => {
    expect(fromIso(toIso('2026-11-06', '18:00'))).toEqual({ date: '2026-11-06', time: '18:00' })
  })

  it('makes one date per week', () => {
    const dates = weeklyDates('2026-11-06', '18:00', 4).map((d) => d.getDate())
    expect(dates).toEqual([6, 13, 20, 27])
  })

  it('keeps the same clock time across the end of summer time', () => {
    const hours = weeklyDates('2026-10-23', '18:00', 2).map((d) => d.getHours())
    expect(hours).toEqual([18, 18])
  })

  it('reads one item per line and skips empty lines', () => {
    expect(linesToList('et møde | a meeting\n\n  en kollega | a colleague ')).toEqual(['et møde | a meeting', 'en kollega | a colleague'])
  })
})
