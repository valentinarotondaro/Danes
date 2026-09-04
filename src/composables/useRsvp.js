// src/composables/useRsvp.js
import { ref } from 'vue'
import { useAuth } from '@/composables/useAuth'
import * as orderService from '@/services/orderService'
import * as eventService from '@/services/eventService'

export function useRsvp() {
  const { currentUser, isLoggedIn } = useAuth()
  const hasRsvpd = ref(false)
  const checking = ref(false)
  const rsvping = ref(false)
  const error = ref(null)

  async function checkRsvp(eventId) {
    if (!isLoggedIn.value) {
      hasRsvpd.value = false
      return
    }
    checking.value = true
    try {
      hasRsvpd.value = await orderService.hasConfirmedOrder(currentUser.value.$id, 'event', eventId)
    } finally {
      checking.value = false
    }
  }

  async function rsvp(event) {
    rsvping.value = true
    error.value = null
    try {
      const fresh = await eventService.getEventById(event.$id)
      if ((fresh.spotsBooked ?? 0) >= fresh.capacity) {
        throw new Error('This event is fully booked.')
      }
      await orderService.createOrder(currentUser.value.$id, 'event', event.$id, 0)
      await eventService.incrementSpotsBooked(event.$id, fresh.spotsBooked)
      hasRsvpd.value = true
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      rsvping.value = false
    }
  }

  return { hasRsvpd, checking, rsvping, error, checkRsvp, rsvp }
}
