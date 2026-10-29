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
// One event, for the detail page
export function useEvent(id) {
  const event = ref(null)
  const loading = ref(false)
  const error = ref(null)

  async function fetchEvent() {
    loading.value = true
    error.value = null
    try {
      event.value = await eventService.getEventById(id)
    } catch (err) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  return { event, loading, error, fetchEvent }
}