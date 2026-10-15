import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('@/services/orderService', () => ({
  createOrder: vi.fn(),
}))
vi.mock('@/services/liveClassService', () => ({
  getLiveClassById: vi.fn(),
}))
vi.mock('@/services/eventService', () => ({
  getEventById: vi.fn(),
}))
vi.mock('@/services/spotService', () => ({
  reserveSpot: vi.fn(),
}))
vi.mock('@/composables/useAuth', () => ({
  useAuth: () => ({ currentUser: { value: { $id: 'user-1' } } }),
}))

import { useOrders } from '../useOrders'
import * as orderService from '@/services/orderService'
import * as liveClassService from '@/services/liveClassService'
import * as eventService from '@/services/eventService'
import { reserveSpot } from '@/services/spotService'

const fullBundle = {
  $id: 'bundle-1',
  price: 999,
  courseId: 'course-1',
  liveClassId: 'liveclass-1',
  eventId: 'event-1',
}

describe('useOrders.purchaseBundle', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    orderService.createOrder.mockResolvedValue({ $id: 'order-x' })
    reserveSpot.mockResolvedValue({ status: 'confirmed', spotsBooked: 3 })
    liveClassService.getLiveClassById.mockResolvedValue({ spotsBooked: 2, capacity: 8 })
    eventService.getEventById.mockResolvedValue({ spotsBooked: 3, capacity: 15 })
  })

  it('creates the package order and the course order in the browser', async () => {
    const { purchaseBundle } = useOrders()

    await purchaseBundle(fullBundle)

    expect(orderService.createOrder).toHaveBeenCalledTimes(2)
    expect(orderService.createOrder).toHaveBeenNthCalledWith(1, 'user-1', 'bundle', 'bundle-1', 999)
    expect(orderService.createOrder).toHaveBeenNthCalledWith(2, 'user-1', 'course', 'course-1', 0)
  })

  it('saves the live class and event spots through the server, linked to the package', async () => {
    const { purchaseBundle } = useOrders()

    await purchaseBundle(fullBundle)

    expect(reserveSpot).toHaveBeenCalledWith('liveClass', 'liveclass-1', 'bundle-1')
    expect(reserveSpot).toHaveBeenCalledWith('event', 'event-1', 'bundle-1')
  })

  it('refuses the purchase when the bundled live class is already full', async () => {
    liveClassService.getLiveClassById.mockResolvedValue({ spotsBooked: 8, capacity: 8 })
    const { purchaseBundle } = useOrders()

    await expect(purchaseBundle(fullBundle)).rejects.toThrow('fully booked')
    expect(orderService.createOrder).not.toHaveBeenCalled()
    expect(reserveSpot).not.toHaveBeenCalled()
  })

  it('skips spots for items the bundle does not include', async () => {
    const courseOnlyBundle = { $id: 'bundle-2', price: 199, courseId: 'course-1' }
    const { purchaseBundle } = useOrders()

    await purchaseBundle(courseOnlyBundle)

    expect(orderService.createOrder).toHaveBeenCalledTimes(2) // bundle + course only
    expect(reserveSpot).not.toHaveBeenCalled()
  })
})