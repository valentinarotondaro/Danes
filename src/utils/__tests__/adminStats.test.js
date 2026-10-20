import { describe, it, expect } from 'vitest'
import { keyNumbers, waitlistCounts, needsAttention, comingUp } from '../adminStats'

const now = new Date('2026-10-20T12:00:00Z')

const orders = [
  { userId: 'u1', amount: 549, status: 'confirmed', createdAt: '2026-10-20T09:00:00Z', itemId: 'p1' },
  { userId: 'u1', amount: 0, status: 'confirmed', createdAt: '2026-10-20T09:00:01Z', itemId: 'c1' },
  { userId: 'u2', amount: 180, status: 'confirmed', createdAt: '2026-09-30T09:00:00Z', itemId: 'e1' },
  { userId: 'u3', amount: 0, status: 'waitlist', createdAt: '2026-10-19T09:00:00Z', itemId: 'e1' },
]
const liveClasses = [
  { $id: 'l1', title: 'At the doctor', dateTime: '2026-10-23T15:00:00Z', capacity: 8, spotsBooked: 8, published: true },
  { $id: 'l2', title: 'Weekend plans', dateTime: '2026-11-20T15:00:00Z', capacity: 8, spotsBooked: 2, published: true, videoRoomUrl: 'x' },
]
const events = [{ $id: 'e1', title: 'Hygge walk', city: 'Esbjerg', dateTime: '2026-10-31T17:00:00Z', capacity: 15, spotsBooked: 15, published: true }]
const courses = [{ $id: 'c2', title: 'Danish for parents', published: false }]

describe('adminStats', () => {
  it('adds up this month’s paid orders and this week’s seats', () => {
    const n = keyNumbers({ orders, liveClasses }, now)
    expect(n.revenue).toBe(549)
    expect(n.ordersThisMonth).toBe(2)
    expect(n.ordersToday).toBe(2)
    expect(n.payingLearners).toBe(2)
    expect([n.seatsBooked, n.seatsTotal, n.groupsThisWeek]).toEqual([8, 8, 1])
  })

  it('counts the waitlist per item', () => {
    expect(waitlistCounts(orders)).toEqual({ e1: 1 })
  })

  it('flags full events and sessions, and drafts', () => {
    const titles = needsAttention({ courses, events, liveClasses, orders }, now).map((i) => i.title)
    expect(titles).toEqual([
      'Hygge walk is full',
      'At the doctor is full',
      'Danish for parents is still a draft',
    ])
  })

  it('lists what comes next, sooner first', () => {
    expect(comingUp({ events, liveClasses }, now).map((d) => d.$id)).toEqual(['l1', 'e1', 'l2'])
  })
})
