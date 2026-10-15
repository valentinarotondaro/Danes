// src/composables/useEventSignup.js
//
// Everything one event card needs: spots, date labels, and the
// "Save your spot" / "Join the waitlist" actions. Used by EventCard and
// EventNextUp, so the logic lives in one place instead of being copied.

import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import { useRsvp } from '@/composables/useRsvp'

export function useEventSignup(event) {
  const { isLoggedIn } = useAuth()
  const router = useRouter()
  const { hasRsvpd, isWaitlisted, rsvping, error, checkRsvp, rsvp, joinWaitlist } = useRsvp()

  const spotsBooked = computed(() => event.value.spotsBooked ?? 0)
  const isFull = computed(() => spotsBooked.value >= event.value.capacity)
  const spotsLeft = computed(() => Math.max(event.value.capacity - spotsBooked.value, 0))

  // "Oct" / "18" for the date tile, "Sat 10:00" for the details line
  const date = computed(() => new Date(event.value.dateTime))
  const month = computed(() => date.value.toLocaleString('en-GB', { month: 'short' }))
  const day = computed(() => date.value.getDate())
  const when = computed(() =>
    date.value.toLocaleString('en-GB', { weekday: 'short', hour: '2-digit', minute: '2-digit' })
  )

  function requireLogin() {
    if (isLoggedIn.value) return true
    router.push({ name: 'login', query: { redirect: '/events' } })
    return false
  }

  async function saveSpot() {
    if (!requireLogin()) return
    try {
      await rsvp(event.value)
      event.value.spotsBooked = spotsBooked.value + 1
    } catch {
      // message is in `error`
    }
  }

  async function waitlist() {
    if (!requireLogin()) return
    try {
      await joinWaitlist(event.value)
    } catch {
      // message is in `error`
    }
  }

  onMounted(() => {
    if (isLoggedIn.value) checkRsvp(event.value.$id)
  })

  return {
    spotsBooked, isFull, spotsLeft, month, day, when,
    hasRsvpd, isWaitlisted, rsvping, error, saveSpot, waitlist,
  }
}