// src/composables/useBundles.js
import { ref } from 'vue'
import * as bundleService from '@/services/bundleService'

export function useBundle(id) {
  const bundle = ref(null)
  const loading = ref(false)
  const error = ref(null)

  async function fetchBundle() {
    loading.value = true
    error.value = null
    try {
      bundle.value = await bundleService.getBundleById(id)
    } catch (err) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  return { bundle, loading, error, fetchBundle }
}
