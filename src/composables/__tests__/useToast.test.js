import { describe, it, expect, vi } from 'vitest'
import { useToast } from '../useToast'

describe('useToast', () => {
  it('shares one toast between components and hides it after 5 seconds', () => {
    vi.useFakeTimers()
    const a = useToast()
    const b = useToast()

    a.showToast('Course saved.', 'It’s live on the site.')
    expect(b.toast.value.title).toBe('Course saved.')

    vi.advanceTimersByTime(5000)
    expect(b.toast.value).toBe(null)
    vi.useRealTimers()
  })
})
