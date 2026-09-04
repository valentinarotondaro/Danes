// src/composables/useLiveClasses.js
import { ref } from 'vue'
import * as liveClassService from '@/services/liveClassService'

export function useLiveClasses() {
  const liveClasses = ref([])
  const loading = ref(false)
  const error = ref(null)

  async function fetchLiveClasses() {
    loading.value = true
    error.value = null
    try {
      liveClasses.value = await liveClassService.listPublishedLiveClasses()
    } catch (err) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  return { liveClasses, loading, error, fetchLiveClasses }
}

export function useLiveClass(id) {
  const liveClass = ref(null)
  const loading = ref(false)
  const error = ref(null)

  async function fetchLiveClass() {
    loading.value = true
    error.value = null
    try {
      liveClass.value = await liveClassService.getLiveClassById(id)
    } catch (err) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  return { liveClass, loading, error, fetchLiveClass }
}
