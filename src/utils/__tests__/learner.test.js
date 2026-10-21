import { describe, it, expect } from 'vitest'
import { planFromOrders, nextRenewal, cheaperPackage, courseProgress, wordsLearned, splitByTime, weekSummary } from '../learner'

const packages = [
  { $id: 'p-course', title: 'Course', price: 399, includesCourse: true, published: true },
  { $id: 'p-club', title: 'Speaking Club', price: 250, includesSpeakingClub: true, published: true },
  { $id: 'p-starter', title: 'Starter', price: 549, includesCourse: true, includesSpeakingClub: true, published: true },
]
const packagesById = Object.fromEntries(packages.map((p) => [p.$id, p]))

describe('learner plan', () => {
  const orders = [
    { itemType: 'bundle', itemId: 'p-club', amount: 250, status: 'confirmed', createdAt: '2026-10-02T10:00:00Z' },
    { itemType: 'course', itemId: 'c1', amount: 399, status: 'confirmed', createdAt: '2026-10-02T10:00:00Z' },
    { itemType: 'course', itemId: 'c2', amount: 0, status: 'confirmed' }, // came with a package: free
    { itemType: 'bundle', itemId: 'p-starter', amount: 549, status: 'cancelled' },
  ]

  it('adds up what the learner pays each month', () => {
    const plan = planFromOrders(orders, packagesById, { c1: { title: 'Danish for work' } })
    expect(plan.items.map((i) => i.title)).toEqual(['Speaking Club', 'Danish for work'])
    expect(plan.total).toBe(649)
  })

  it('suggests the package that covers the same for less', () => {
    const plan = planFromOrders(orders, packagesById, {})
    expect(cheaperPackage(plan, packages)).toMatchObject({ pkg: { title: 'Starter' }, saving: 100 })
  })
  it('never suggests one package for two courses', () => {
    const twoCourses = [
      { itemType: 'course', itemId: 'c1', amount: 399, status: 'confirmed' },
      { itemType: 'course', itemId: 'c2', amount: 399, status: 'confirmed' },
    ]
    expect(cheaperPackage(planFromOrders(twoCourses, packagesById, {}), packages)).toBe(null)
  })

  it('renews on the same day every month', () => {
    expect(nextRenewal('2026-10-02T10:00:00Z', new Date('2026-10-21T12:00:00Z')).getUTCDate()).toBe(2)
    expect(nextRenewal('2026-10-02T10:00:00Z', new Date('2026-10-21T12:00:00Z')).getUTCMonth()).toBe(10) // November
  })
})

describe('learner progress', () => {
  const lessons = [
    { $id: 'a', module: 1, order: 1, words: ['et møde | a meeting'] },
    { $id: 'b', module: 1, order: 2, words: ['en kollega | a colleague'] },
    { $id: 'c', module: 2, order: 1 },
  ]

  it('finds the next lesson and the percentage', () => {
    const p = courseProgress(lessons, new Set(['a']))
    expect([p.done, p.total, p.percent, p.next.$id, p.nextNumber, p.finished]).toEqual([1, 3, 33, 'b', 2, false])
  })

  it('collects the words of finished lessons', () => {
    expect(wordsLearned(lessons, new Set(['a', 'b'])).map((w) => w.da)).toEqual(['et møde', 'en kollega'])
  })
})

describe('learner timeline', () => {
  it('splits upcoming and past', () => {
    const now = new Date('2026-10-21T12:00:00Z')
    const { upcoming, past } = splitByTime([
      { $id: 'late', dateTime: '2026-11-01T10:00:00Z' },
      { $id: 'old', dateTime: '2026-09-01T10:00:00Z' },
      { $id: 'soon', dateTime: '2026-10-23T10:00:00Z' },
    ], now)
    expect(upcoming.map((i) => i.$id)).toEqual(['soon', 'late'])
    expect(past.map((i) => i.$id)).toEqual(['old'])
  })
    it('keeps a session that started 20 minutes ago as upcoming until it ends', () => {
    const now = new Date('2026-10-21T18:20:00Z')
    const live = { $id: 'live', dateTime: '2026-10-21T18:00:00Z', durationMinutes: 60 }
    expect(splitByTime([live], now).upcoming.map((i) => i.$id)).toEqual(['live'])
  })

  it('writes the week in one sentence', () => {
    expect(weekSummary({ lessonsLeft: 1, nextFriday: {}, nextEvent: null })).toBe('Here’s what’s next: one lesson to finish and a Friday group.')
    expect(weekSummary({})).toMatch(/get started/)
  })
})
