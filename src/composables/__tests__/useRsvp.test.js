import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('@/services/orderService', () => ({
  createOrder: vi.fn(),
  hasConfirmedOrder: vi.fn(),
}))
vi.mock('@/services/eventService', () => ({
  getEventById: vi.fn(),
  incrementSpotsBooked: vi.fn(),
}))
vi.mock('@/composables/useAuth', () => ({
  useAuth: () => ({
    currentUser: { value: { $id: 'user-1' } },
    isLoggedIn: { value: true },
  }),
}))

import { useRsvp } from '../useRsvp'
import * as orderService from '@/services/orderService'
import * as eventService from '@/services/eventService'

describe('useRsvp', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('rejects the RSVP when the event is already at capacity', async () => {
    eventService.getEventById.mockResolvedValue({ $id: 'event-1', capacity: 20, spotsBooked: 20 })
    const { rsvp, hasRsvpd } = useRsvp()

    await expect(rsvp({ $id: 'event-1' })).rejects.toThrow('fully booked')
    expect(orderService.createOrder).not.toHaveBeenCalled()
    expect(hasRsvpd.value).toBe(false)
  })

  it('creates the order and increments spotsBooked when a spot is available', async () => {
    eventService.getEventById.mockResolvedValue({ $id: 'event-1', capacity: 20, spotsBooked: 5 })
    orderService.createOrder.mockResolvedValue({ $id: 'order-1' })
    const { rsvp, hasRsvpd } = useRsvp()

    await rsvp({ $id: 'event-1' })

    expect(orderService.createOrder).toHaveBeenCalledWith('user-1', 'event', 'event-1', 0)
    expect(eventService.incrementSpotsBooked).toHaveBeenCalledWith('event-1', 5)
    expect(hasRsvpd.value).toBe(true)
  })
    it('joins the waitlist without touching spotsBooked', async () => {
    orderService.createOrder.mockResolvedValue({ $id: 'order-2' })
    const { joinWaitlist, isWaitlisted, hasRsvpd } = useRsvp()

    await joinWaitlist({ $id: 'event-1' })

    expect(orderService.createOrder).toHaveBeenCalledWith('user-1', 'event', 'event-1', 0, 'waitlist')
    expect(eventService.incrementSpotsBooked).not.toHaveBeenCalled()
    expect(isWaitlisted.value).toBe(true)
    expect(hasRsvpd.value).toBe(false)
  })
})
