import { describe, it, expect, vi, beforeEach } from 'vitest'

// vi.hoisted: these run before the mocks below, which vitest moves to the top
const { push, service } = vi.hoisted(() => ({
  push: vi.fn(),
  service: { get: vi.fn(), create: vi.fn(async (d) => ({ $id: 'new-1', ...d })), update: vi.fn(), remove: vi.fn() },
}))
vi.mock('vue-router', () => ({ useRouter: () => ({ push, replace: vi.fn() }) }))
vi.mock('@/components/admin/adminCollections', () => ({
  ADMIN_COLLECTIONS: { liveClasses: { singular: 'live class', label: 'Live classes', ...service } },
}))

import { useAdminForm, saveErrorMessage } from '../useAdminForm'

const setup = (id, toPayload = (f) => ({ title: f.title })) =>
  useAdminForm({
    collection: 'liveClasses',
    id,
    defaults: () => ({ title: '', published: true }),
    fromDoc: (doc) => ({ title: doc.title, published: doc.published }),
    toPayload,
    validate: (f) => ({ title: f.title ? '' : 'Add a topic.' }),
  })

describe('useAdminForm', () => {
  beforeEach(() => {
    push.mockClear()
    Object.values(service).forEach((fn) => fn.mockClear())
  })

  it('does not save while a field has an error', async () => {
    const f = setup('new')
    await f.save()
    expect(f.errors.value).toEqual({ title: 'Add a topic.' })
    expect(service.create).not.toHaveBeenCalled()
  })

  it('creates one document per item when the payload is a list', async () => {
    const f = setup('new', (form) => [{ title: form.title }, { title: form.title }])
    f.form.title = 'Weekend plans'
    await f.save()
    expect(service.create).toHaveBeenCalledTimes(2)
    expect(push).toHaveBeenCalledWith({ name: 'admin-list', params: { collection: 'liveClasses' } })
  })

  it('loads an existing document and updates it', async () => {
    service.get.mockResolvedValue({ title: 'At the doctor', published: true })
    const f = setup('abc')
    await f.load()
    expect(f.isDirty.value).toBe(false)

    f.form.title = 'At the dentist'
    expect(f.isDirty.value).toBe(true)
    await f.save()
    expect(service.update).toHaveBeenCalledWith('abc', { title: 'At the dentist' })
  })

  it('explains an expired session', () => {
    expect(saveErrorMessage({ code: 401 })).toMatch(/session has ended/)
  })
})
