import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock the Appwrite-touching modules before importing the composable under test.
vi.mock('@/services/orderService', () => ({
  hasConfirmedOrder: vi.fn(),
}))
vi.mock('@/composables/useAuth', () => ({
  useAuth: () => ({
    currentUser: { value: { $id: 'user-1' } },
    isLoggedIn: { value: true },
  }),
}))

import { useCourseAccess } from '../useCourseAccess'
import { hasConfirmedOrder } from '@/services/orderService'

describe('useCourseAccess', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('grants access when a confirmed order exists for the course', async () => {
    hasConfirmedOrder.mockResolvedValue(true)
    const { hasAccess, checkAccess } = useCourseAccess()

    const result = await checkAccess('course-123')

    expect(hasConfirmedOrder).toHaveBeenCalledWith('user-1', 'course', 'course-123')
    expect(result).toBe(true)
    expect(hasAccess.value).toBe(true)
  })

  it('denies access when no confirmed order exists', async () => {
    hasConfirmedOrder.mockResolvedValue(false)
    const { hasAccess, checkAccess } = useCourseAccess()

    const result = await checkAccess('course-123')

    expect(result).toBe(false)
    expect(hasAccess.value).toBe(false)
  })

  it('surfaces an error instead of silently granting access on failure', async () => {
    hasConfirmedOrder.mockRejectedValue(new Error('network down'))
    const { hasAccess, error, checkAccess } = useCourseAccess()

    const result = await checkAccess('course-123')

    expect(result).toBe(false)
    expect(hasAccess.value).toBe(false)
    expect(error.value).toBe('network down')
  })
})
