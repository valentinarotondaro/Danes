// src/composables/useRsvp.js
//
// Sign-up logic for anything with seats: RSVP when there's a spot, join the
// waitlist when it's full, cancel to give the spot back. itemType is 'event'
// (default) or 'liveClass'. The status lives in `orders`:
// 'confirmed' = going, 'waitlist' = waiting, 'cancelled' = gave it back.

import { computed, ref } from 'vue'
import { useAuth } from '@/composables/useAuth'
import * as orderService from '@/services/orderService'
import { reserveSpot, cancelSpot } from '@/services/spotService'

export function useRsvp(itemType = 'event') {
  const { currentUser, isLoggedIn } = useAuth()
  const status = ref(null) // null | 'confirmed' | 'waitlist'
  const checking = ref(false)
  const rsvping = ref(false)
  const error = ref(null)

  const hasRsvpd = computed(() => status.value === 'confirmed')
  const isWaitlisted = computed(() => status.value === 'waitlist')

  async function checkRsvp(itemId) {
    if (!isLoggedIn.value) {
      status.value = null
      return
    }
    checking.value = true
    try {
      status.value = await orderService.getOrderStatus(currentUser.value.$id, itemType, itemId)
    } finally {
      checking.value = false
    }
  }

  // Runs an action with the shared loading/error handling
  async function run(action) {
    rsvping.value = true
    error.value = null
    try {
      return await action()
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      rsvping.value = false
    }
  }

  // The server function checks capacity and adds +1. Returns { spotsBooked }.
  const rsvp = (item) =>
    run(async () => {
      const result = await reserveSpot(itemType, item.$id)
      status.value = 'confirmed'
      return result
    })

  const joinWaitlist = (item) =>
    run(async () => {
      await orderService.createOrder(currentUser.value.$id, itemType, item.$id, 0, 'waitlist')
      status.value = 'waitlist'
    })

  // The server function marks the order cancelled and gives the spot back (-1)
  const cancel = (item) =>
    run(async () => {
      const result = await cancelSpot(itemType, item.$id)
      status.value = null
      return result
    })

  return { status, hasRsvpd, isWaitlisted, checking, rsvping, error, checkRsvp, rsvp, joinWaitlist, cancel }
}