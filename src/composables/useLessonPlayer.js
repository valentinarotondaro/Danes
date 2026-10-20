// src/composables/useLessonPlayer.js
//
// Everything the lesson page needs: the course, its lessons, the teacher,
// whether the learner has access, and their progress. "Mark as done" saves a
// lessonProgress row, so the ✓ marks and the progress bar are real data.

import { computed, ref } from 'vue'
import { useAuth } from '@/composables/useAuth'
import { useCourseAccess } from '@/composables/useCourseAccess'
import * as courseService from '@/services/courseService'
import * as lessonService from '@/services/lessonService'
import * as teacherService from '@/services/teacherService'
import * as progressService from '@/services/progressService'
import { groupByModule, neighbours, percentDone } from '@/utils/lessonPlan'

export function useLessonPlayer(courseId, lessonId) {
  const { currentUser } = useAuth()
  const { hasAccess, checkAccess } = useCourseAccess()

  const course = ref(null)
  const lessons = ref([])
  const teacher = ref(null)
  const progressRows = ref([])
  const loading = ref(true)
  const error = ref('')
  const saving = ref(false)
  const saveError = ref('')

  const doneIds = computed(() => new Set(progressRows.value.filter((r) => r.done).map((r) => r.lessonId)))
  const lesson = computed(() => lessons.value.find((l) => l.$id === lessonId) ?? null)
  const modules = computed(() => groupByModule(lessons.value, doneIds.value))
  const nav = computed(() => neighbours(lessons.value, lessonId))
  const percent = computed(() => percentDone(lessons.value, doneIds.value))
  const isDone = computed(() => doneIds.value.has(lessonId))

  async function load() {
    loading.value = true
    error.value = ''
    try {
      const [courseDoc, lessonDocs] = await Promise.all([
        courseService.getCourseById(courseId),
        lessonService.listLessonsByCourse(courseId),
        checkAccess(courseId),
      ])
      course.value = courseDoc
      lessons.value = lessonDocs
      // Teacher and progress are extras: if they fail, the lesson still plays
      const [teacherDoc, rows] = await Promise.all([
        courseDoc.teacherId ? teacherService.getTeacherById(courseDoc.teacherId).catch(() => null) : null,
        progressService.listProgressForCourse(currentUser.value.$id, courseId).catch(() => []),
      ])
      teacher.value = teacherDoc
      progressRows.value = rows
    } catch (err) {
      console.error(err)
      error.value = 'We couldn’t load this lesson.'
    } finally {
      loading.value = false
    }
  }

  // Saves done (or not done) for the current lesson. Returns true when it worked.
  async function setDone(done) {
    saving.value = true
    saveError.value = ''
    try {
      const existing = progressRows.value.find((r) => r.lessonId === lessonId) ?? null
      const row = await progressService.setLessonDone(currentUser.value.$id, lesson.value, done, existing)
      progressRows.value = [...progressRows.value.filter((r) => r.lessonId !== lessonId), row]
      return true
    } catch (err) {
      console.error(err)
      saveError.value = 'We couldn’t save your progress. Check your connection and try again.'
      return false
    } finally {
      saving.value = false
    }
  }

  return { course, lessons, lesson, teacher, hasAccess, loading, error, modules, nav, percent, isDone, doneIds, saving, saveError, load, setDone }
}
