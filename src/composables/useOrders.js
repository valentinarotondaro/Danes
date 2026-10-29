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

  // Simulated checkout: no real payment (V2: Stripe)
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

  // A package = one order at the package price + one order per included item
  // at 0 kr. So access checks and My account never need to know where access came from.
  // courseId: the course picked at checkout ("one course of your choice"), else bundle.courseId.
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