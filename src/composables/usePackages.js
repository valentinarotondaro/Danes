// src/composables/usePackages.js
import { ref } from 'vue'
import * as packageService from '@/services/packageService'

export function usePackage(id) {
  const pkg = ref(null)
  const loading = ref(false)
  const error = ref(null)

  async function fetchPackage() {
    loading.value = true
    error.value = null
    try {
      pkg.value = await packageService.getPackageById(id)
    } catch (err) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  return { pkg, loading, error, fetchPackage }
}