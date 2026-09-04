// src/composables/useTeachers.js
import { ref } from 'vue'
import * as teacherService from '@/services/teacherService'

export function useTeachers() {
  const teachers = ref([])
  const loading = ref(false)
  const error = ref(null)

  async function fetchTeachers() {
    loading.value = true
    error.value = null
    try {
      teachers.value = await teacherService.listTeachers()
    } catch (err) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  return { teachers, loading, error, fetchTeachers }
}
