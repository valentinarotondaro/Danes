// src/composables/useOrders.js
import { ref } from 'vue'
import { useAuth } from '@/composables/useAuth'
import * as orderService from '@/services/orderService'
import * as liveClassService from '@/services/liveClassService'
import * as eventService from '@/services/eventService'
import { reserveSpot } from '@/services/spotService'

export function useOrders() {
  const { currentUser } = useAuth()
  const purchasing = ref(false)
  const error = ref(null)

  // Mock checkout — no real payment gateway (out of scope per Step 4 MVP).
  async function purchaseCourse(courseId, price) {
    purchasing.value = true
    error.value = null
    try {
      return await orderService.createOrder(currentUser.value.$id, 'course', courseId, price)
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      purchasing.value = false
    }
  }
  // Buying a bundle writes ONE order for the bundle itself (the receipt, at
  // the bundle's price) plus one derived order per included item (course /
  // liveClass / event), each at amount=0 since payment was already captured
  // on the bundle order. This is the documented architectural decision: a
  // single polymorphic `orders` table handles purchases, bookings, and RSVPs
  // uniformly — useCourseAccess, capacity checks, and "My Account" never need
  // to know whether access came from a bundle or a solo purchase.
  // Books a live class through the reserve-spot server function: it checks
  // capacity, adds +1 in one atomic step and creates the order.
  // Returns { status, spotsBooked }.
  async function bookLiveClass(liveClass) {
    purchasing.value = true
    error.value = null
    try {
      return await reserveSpot('liveClass', liveClass.$id)
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      purchasing.value = false
    }
  }

  
  // courseId: the course the learner picked at checkout, for packages that
  // include "one course of your choice". Falls back to bundle.courseId.
  async function purchaseBundle(bundle, courseId = null) {
    purchasing.value = true
    error.value = null
    try {
      if (bundle.liveClassId) {
        const fresh = await liveClassService.getLiveClassById(bundle.liveClassId)
        if ((fresh.spotsBooked ?? 0) >= fresh.capacity) {
          throw new Error('The live class in this bundle is fully booked.')
        }
      }
      if (bundle.eventId) {
        const fresh = await eventService.getEventById(bundle.eventId)
        if ((fresh.spotsBooked ?? 0) >= fresh.capacity) {
          throw new Error('The event in this bundle is fully booked.')
        }
      }

      const bundleOrder = await orderService.createOrder(
        currentUser.value.$id, 'bundle', bundle.$id, bundle.price
      )
      const chosenCourseId = courseId || bundle.courseId
      if (chosenCourseId) {
        await orderService.createOrder(currentUser.value.$id, 'course', chosenCourseId, 0)
      }

      // Spots go through the server function, which checks the package order exists
      if (bundle.liveClassId) await reserveSpot('liveClass', bundle.liveClassId, bundle.$id)
      if (bundle.eventId) await reserveSpot('event', bundle.eventId, bundle.$id)

      return bundleOrder
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      purchasing.value = false
    }
  }

  return { purchasing, error, purchaseCourse, bookLiveClass, purchaseBundle }
}