import { describe, it, expect, vi } from 'vitest'
import { useAdminList } from '../useAdminList'

const config = {
  label: 'Courses',
  list: vi.fn(async () => [
    { $id: 'a', title: 'Danish for work', published: true },
    { $id: 'b', title: 'Danish for parents', published: false },
  ]),
  remove: vi.fn(async () => {}),
  filters: [
    { label: 'All', test: () => true },
    { label: 'Draft', test: (doc) => !doc.published },
  ],
}

describe('useAdminList', () => {
  it('counts each filter and shows only the matching documents', async () => {
    const list = useAdminList(config)
    await list.load()

    expect(list.filterCounts.value).toEqual([{ label: 'All', count: 2 }, { label: 'Draft', count: 1 }])
    list.filterIndex.value = 1
    expect(list.visible.value.map((d) => d.$id)).toEqual(['b'])
  })

  it('searches by title', async () => {
    const list = useAdminList(config)
    await list.load()

    list.search.value = 'WORK'
    expect(list.visible.value.map((d) => d.$id)).toEqual(['a'])
  })

  it('removes the document from the list after deleting it in Appwrite', async () => {
    const list = useAdminList(config)
    await list.load()

    expect(await list.remove(list.docs.value[0])).toBe(true)
    expect(config.remove).toHaveBeenCalledWith('a')
    expect(list.docs.value.map((d) => d.$id)).toEqual(['b'])
  })
})
