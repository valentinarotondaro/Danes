import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('@/services/orderService', () => ({
  createOrder: vi.fn(),
  getOrderStatus: vi.fn(),
}))
vi.mock('@/services/spotService', () => ({
  reserveSpot: vi.fn(),
}))
vi.mock('@/composables/useAuth', () => ({
  useAuth: () => ({
    currentUser: { value: { $id: 'user-1' } },
    isLoggedIn: { value: true },
  }),
}))

import { useRsvp } from '../useRsvp'
import * as orderService from '@/services/orderService'
import { reserveSpot } from '@/services/spotService'

describe('useRsvp', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('shows the server message when the event is full', async () => {
    reserveSpot.mockRejectedValue(new Error('Sorry, it’s fully booked.'))
    const { rsvp, hasRsvpd, error } = useRsvp()

    await expect(rsvp({ $id: 'event-1' })).rejects.toThrow('fully booked')
    expect(error.value).toBe('Sorry, it’s fully booked.')
    expect(hasRsvpd.value).toBe(false)
  })

  it('saves the spot through the server function', async () => {
    reserveSpot.mockResolvedValue({ status: 'confirmed', spotsBooked: 6 })
    const { rsvp, hasRsvpd } = useRsvp()

    const result = await rsvp({ $id: 'event-1' })

    expect(reserveSpot).toHaveBeenCalledWith('event', 'event-1')
    expect(orderService.createOrder).not.toHaveBeenCalled() // the function creates the order
    expect(result.spotsBooked).toBe(6)
    expect(hasRsvpd.value).toBe(true)
  })

  it('joins the waitlist without taking a spot', async () => {
    orderService.createOrder.mockResolvedValue({ $id: 'order-2' })
    const { joinWaitlist, isWaitlisted, hasRsvpd } = useRsvp()

    await joinWaitlist({ $id: 'event-1' })

    expect(orderService.createOrder).toHaveBeenCalledWith('user-1', 'event', 'event-1', 0, 'waitlist')
    expect(reserveSpot).not.toHaveBeenCalled()
    expect(isWaitlisted.value).toBe(true)
    expect(hasRsvpd.value).toBe(false)
  })
})