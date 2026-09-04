// src/composables/useOrders.js
import { ref } from 'vue'
import { useAuth } from '@/composables/useAuth'
import * as orderService from '@/services/orderService'
import * as liveClassService from '@/services/liveClassService'
import * as eventService from '@/services/eventService'

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

  // Books a live class: creates the order, then increments the class's
  // denormalized spotsBooked counter. Capacity is re-checked here (not just
  // in the UI) so two users clicking "Book" near-simultaneously can't both
  // slip past a client-side-only check — though a true atomic increment
  // would need a server-side Appwrite Function; documented as a V2 item
  // alongside the other capacity/race-condition tradeoffs at this scale.
  async function bookLiveClass(liveClass) {
    purchasing.value = true
    error.value = null
    try {
      const fresh = await liveClassService.getLiveClassById(liveClass.$id)
      if ((fresh.spotsBooked ?? 0) >= fresh.capacity) {
        throw new Error('This class is fully booked.')
      }
      const order = await orderService.createOrder(currentUser.value.$id, 'liveClass', liveClass.$id, fresh.price)
      await liveClassService.incrementSpotsBooked(liveClass.$id, fresh.spotsBooked)
      return order
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
  async function purchaseBundle(bundle) {
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

      if (bundle.courseId) {
        await orderService.createOrder(currentUser.value.$id, 'course', bundle.courseId, 0)
      }
      if (bundle.liveClassId) {
        const fresh = await liveClassService.getLiveClassById(bundle.liveClassId)
        await orderService.createOrder(currentUser.value.$id, 'liveClass', bundle.liveClassId, 0)
        await liveClassService.incrementSpotsBooked(bundle.liveClassId, fresh.spotsBooked)
      }
      if (bundle.eventId) {
        const fresh = await eventService.getEventById(bundle.eventId)
        await orderService.createOrder(currentUser.value.$id, 'event', bundle.eventId, 0)
        await eventService.incrementSpotsBooked(bundle.eventId, fresh.spotsBooked)
      }

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
