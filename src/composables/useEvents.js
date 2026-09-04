// src/composables/useEvents.js
import { ref } from 'vue'
import * as eventService from '@/services/eventService'

export function useEvents() {
  const events = ref([])
  const loading = ref(false)
  const error = ref(null)

  async function fetchEvents() {
    loading.value = true
    error.value = null
    try {
      events.value = await eventService.listPublishedEvents()
    } catch (err) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  return { events, loading, error, fetchEvents }
}
