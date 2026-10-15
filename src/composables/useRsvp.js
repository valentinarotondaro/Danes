// src/composables/useRsvp.js
//
// Event sign-up logic: RSVP when there's a spot, join the waitlist when it's full.
// The status lives in `orders` (itemType 'event'): 'confirmed' = going,
// 'waitlist' = waiting. No separate waitlist collection — see data-model.md.

import { computed, ref } from 'vue'
import { useAuth } from '@/composables/useAuth'
import * as orderService from '@/services/orderService'
import * as eventService from '@/services/eventService'

export function useRsvp() {
  const { currentUser, isLoggedIn } = useAuth()
  const status = ref(null) // null | 'confirmed' | 'waitlist'
  const checking = ref(false)
  const rsvping = ref(false)
  const error = ref(null)

  const hasRsvpd = computed(() => status.value === 'confirmed')
  const isWaitlisted = computed(() => status.value === 'waitlist')

  async function checkRsvp(eventId) {
    if (!isLoggedIn.value) {
      status.value = null
      return
    }
    checking.value = true
    try {
      status.value = await orderService.getOrderStatus(currentUser.value.$id, 'event', eventId)
    } finally {
      checking.value = false
    }
  }

  async function rsvp(event) {
    rsvping.value = true
    error.value = null
    try {
      // Re-read the event so we check capacity against fresh data, not the list
      const fresh = await eventService.getEventById(event.$id)
      if ((fresh.spotsBooked ?? 0) >= fresh.capacity) {
        throw new Error('This event is fully booked.')
      }
      await orderService.createOrder(currentUser.value.$id, 'event', event.$id, 0)
      await eventService.incrementSpotsBooked(event.$id, fresh.spotsBooked)
      status.value = 'confirmed'
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      rsvping.value = false
    }
  }

  async function joinWaitlist(event) {
    rsvping.value = true
    error.value = null
    try {
      await orderService.createOrder(currentUser.value.$id, 'event', event.$id, 0, 'waitlist')
      status.value = 'waitlist'
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      rsvping.value = false
    }
  }

  return { status, hasRsvpd, isWaitlisted, checking, rsvping, error, checkRsvp, rsvp, joinWaitlist }
}