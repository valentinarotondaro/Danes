// src/composables/useCourses.js
import { ref } from 'vue'
import * as courseService from '@/services/courseService'
import * as lessonService from '@/services/lessonService'

export function useCourses() {
  const courses = ref([])
  const loading = ref(false)
  const error = ref(null)

  async function fetchCourses() {
    loading.value = true
    error.value = null
    try {
      courses.value = await courseService.listPublishedCourses()
    } catch (err) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  return { courses, loading, error, fetchCourses }
}

export function useCourse(courseId) {
  const course = ref(null)
  const loading = ref(false)
  const error = ref(null)

  async function fetchCourse() {
    loading.value = true
    error.value = null
    try {
      course.value = await courseService.getCourseById(courseId)
    } catch (err) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  return { course, loading, error, fetchCourse }
}

export function useLessons(courseId) {
  const lessons = ref([])
  const loading = ref(false)
  const error = ref(null)

  async function fetchLessons() {
    loading.value = true
    error.value = null
    try {
      lessons.value = await lessonService.listLessonsByCourse(courseId)
    } catch (err) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  return { lessons, loading, error, fetchLessons }
}
