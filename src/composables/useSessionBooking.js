// src/composables/useSessionBooking.js
//
// Everything one Speaking Club session row needs: seats, date labels and the
// Book / Join the waitlist actions. Same idea as useEventSignup, but for
// liveClasses, so it reuses useRsvp with itemType 'liveClass'.

import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import { useRsvp } from '@/composables/useRsvp'

export function useSessionBooking(session) {
  const { isLoggedIn } = useAuth()
  const router = useRouter()
  const { hasRsvpd, isWaitlisted, rsvping, error, checkRsvp, rsvp, joinWaitlist } = useRsvp('liveClass')

  const taken = computed(() => session.value.spotsBooked ?? 0)
  const isFull = computed(() => taken.value >= session.value.capacity)
  const percentTaken = computed(() => Math.min(100, Math.round((taken.value / session.value.capacity) * 100)))

  // "Oct" / "17" / "17:00" for the date tile
  const date = computed(() => new Date(session.value.dateTime))
  const month = computed(() => date.value.toLocaleString('en-GB', { month: 'short' }))
  const day = computed(() => date.value.getDate())
  const time = computed(() => date.value.toLocaleString('en-GB', { hour: '2-digit', minute: '2-digit' }))

  function requireLogin() {
    if (isLoggedIn.value) return true
    router.push({ name: 'login', query: { redirect: '/live-classes' } })
    return false
  }

  async function book() {
    if (!requireLogin()) return
    try {
      const { spotsBooked } = await rsvp(session.value)
      session.value.spotsBooked = spotsBooked // the real number from the server
    } catch {
      // message is in `error`
    }
  }

  async function waitlist() {
    if (!requireLogin()) return
    try {
      await joinWaitlist(session.value)
    } catch {
      // message is in `error`
    }
  }

  onMounted(() => {
    if (isLoggedIn.value) checkRsvp(session.value.$id)
  })

  return {
    taken, isFull, percentTaken, month, day, time,
    isBooked: hasRsvpd, isWaitlisted, rsvping, error, book, waitlist,
  }
}