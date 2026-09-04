// src/composables/useCourseAccess.js
//
// Checks whether the current user has purchased a course, by looking at
// their `orders` records. This is the documented client-side limitation:
// the check happens in the browser, not on the server. lessons.read is
// granted to any logged-in user at the Appwrite level (see provisioning
// script), so this composable is the real gate — stronger than hiding a
// button (it checks real backend data), but not full server enforcement.
// V2: move this check into an Appwrite Function that only returns the
// lesson's videoUrl after verifying entitlement server-side.

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
