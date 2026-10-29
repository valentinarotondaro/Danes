// Has the user bought this course? Checks their orders in Appwrite.
// Known limit: the check runs in the browser (lessons are readable by any
// logged-in user). V2: a Function that only returns the video after checking.

import { ref } from 'vue'
import { useAuth } from '@/composables/useAuth'
import * as orderService from '@/services/orderService'

export function useCourseAccess() {
  const { currentUser, isLoggedIn } = useAuth()

  const hasAccess = ref(false)
  const checking = ref(false)
  const error = ref(null)

  async function checkAccess(courseId) {
    if (!isLoggedIn.value) {
      hasAccess.value = false
      return false
    }
    checking.value = true
    error.value = null
    try {
      hasAccess.value = await orderService.hasConfirmedOrder(
        currentUser.value.$id,
        'course',
        courseId
      )
      return hasAccess.value
    } catch (err) {
      error.value = err.message
      hasAccess.value = false
      return false
    } finally {
      checking.value = false
    }
  }

  return { hasAccess, checking, error, checkAccess }
}
