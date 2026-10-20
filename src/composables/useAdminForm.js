// src/composables/useAdminForm.js
//
// Everything the five admin forms have in common: load the document, keep
// the form state, validate, create or update in Appwrite, delete, and give
// feedback (toast + back to the list). Each form only says what is
// different: its fields, how to check them and how to turn them into a document.
//
//   defaults()     → the empty form
//   fromDoc(doc)   → form values from an Appwrite document
//   toPayload(form)→ the document to save (an array creates several, e.g. weekly classes)
//   validate(form) → { field: 'message' } ('' = fine)

import { computed, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ADMIN_COLLECTIONS } from '@/components/admin/adminCollections'
import { useToast } from '@/composables/useToast'
import { onlyErrors } from '@/utils/adminForm'

export function saveErrorMessage(err) {
  if (err?.code === 401) return 'Your session has ended. Log in again in a new tab, then save: your changes stay in the form.'
  if (err?.code === 409) return 'Something with this name already exists. Change the title and try again.'
  return 'We couldn’t save. Check your connection and try again. Nothing was lost.'
}

export function useAdminForm({ collection, id, defaults, fromDoc, toPayload, validate, editAfterCreate = false }) {
  const config = ADMIN_COLLECTIONS[collection]
  const router = useRouter()
  const { showToast } = useToast()

  const isNew = id === 'new'
  const form = reactive(defaults())
  const loading = ref(!isNew)
  const loadError = ref('')
  const errors = ref({})
  const saving = ref(false)
  const saveError = ref('')
  const deleting = ref(false)

  // "Unsaved changes": compare the form with how it looked after loading
  let snapshot = JSON.stringify(form)
  const isDirty = computed(() => JSON.stringify(form) !== snapshot)

  const goToList = () => router.push({ name: 'admin-list', params: { collection } })
  const nameOf = () => form.title || form.name || `The ${config.singular}`

  async function load() {
    if (isNew) return
    loading.value = true
    loadError.value = ''
    try {
      Object.assign(form, fromDoc(await config.get(id)))
      snapshot = JSON.stringify(form)
    } catch (err) {
      console.error(err)
      loadError.value = `We couldn’t load this ${config.singular}.`
    } finally {
      loading.value = false
    }
  }

  async function save() {
    saveError.value = ''
    errors.value = onlyErrors(validate(form))
    if (Object.keys(errors.value).length) return

    saving.value = true
    try {
      const payload = toPayload(form)
      let created = null
      if (isNew) {
        // An array means "create several" (a live class repeated every Friday)
        for (const doc of Array.isArray(payload) ? payload : [payload]) created = await config.create(doc)
      } else {
        await config.update(id, payload)
      }
      snapshot = JSON.stringify(form)
      const count = Array.isArray(payload) && payload.length > 1 ? ` (${payload.length} ${config.label.toLowerCase()})` : ''
      showToast(`${nameOf()} saved${count}.`, form.published === false ? 'Saved as a draft: only admins can see it.' : 'It’s live on the site.')

      // A new course goes straight to its edit page, so the admin can add lessons
      if (isNew && editAfterCreate && created) router.replace({ name: 'admin-edit', params: { collection, id: created.$id } })
      else goToList()
    } catch (err) {
      console.error(err)
      saveError.value = saveErrorMessage(err)
    } finally {
      saving.value = false
    }
  }

  async function remove() {
    deleting.value = true
    try {
      await config.remove(id)
      showToast(`${nameOf()} deleted.`, 'It’s no longer on the site.')
      goToList()
    } catch (err) {
      console.error(err)
      saveError.value = 'We couldn’t delete it. Check your connection and try again.'
    } finally {
      deleting.value = false
    }
  }

  return { config, isNew, form, loading, loadError, errors, saving, saveError, deleting, isDirty, load, save, remove }
}
