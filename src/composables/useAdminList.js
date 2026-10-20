// src/composables/useAdminList.js
//
// The logic of one admin list: load the documents, filter them (chips +
// search), and delete one after the admin confirms. The view only shows it.
// `config` is one entry of ADMIN_COLLECTIONS.

import { computed, ref } from 'vue'
import { useToast } from '@/composables/useToast'

export function useAdminList(config) {
  const { showToast } = useToast()

  const docs = ref([])
  const loading = ref(true)
  const error = ref('')
  const filterIndex = ref(0)
  const search = ref('')
  const deleting = ref(false)

  // Each chip with how many documents it would show: "Draft · 1"
  const filterCounts = computed(() =>
    config.filters.map((f) => ({ label: f.label, count: docs.value.filter(f.test).length }))
  )

  const visible = computed(() => {
    const filter = config.filters[filterIndex.value]
    const query = search.value.trim().toLowerCase()
    return docs.value
      .filter((doc) => (filter ? filter.test(doc) : true))
      .filter((doc) => !query || (doc.title ?? doc.name ?? '').toLowerCase().includes(query))
  })

  async function load() {
    loading.value = true
    error.value = ''
    try {
      docs.value = await config.list()
    } catch (err) {
      console.error(err) // the technical message is for us, not for the admin
      error.value = `We couldn’t load ${config.label.toLowerCase()}.`
    } finally {
      loading.value = false
    }
  }

  // Returns true when it worked, so the dialog knows it can close
  async function remove(doc) {
    deleting.value = true
    try {
      await config.remove(doc.$id)
      docs.value = docs.value.filter((d) => d.$id !== doc.$id)
      showToast(`${doc.title ?? doc.name} deleted.`, 'It’s no longer on the site.')
      return true
    } catch (err) {
      console.error(err)
      showToast('We couldn’t delete it.', 'Check your connection and try again.')
      return false
    } finally {
      deleting.value = false
    }
  }

  return { docs, loading, error, filterIndex, filterCounts, search, visible, deleting, load, remove }
}
