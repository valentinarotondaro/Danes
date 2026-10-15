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

    const teacher = ref(null)

  async function fetchTeacher(id) {
    if (!id) return            // el curso no tiene profe asignado
    try {
      teacher.value = await teacherService.getTeacherById(id)
    } catch {
      teacher.value = null     // si falla, la página se muestra igual, sin profe
    }
  }

  return { teachers, loading, error, fetchTeachers, teacher, fetchTeacher }
}
