// src/composables/useAdminDashboard.js
//
// Loads everything the dashboard needs in parallel (Promise.all) and turns it
// into numbers with the pure functions in utils/adminStats.

import { computed, ref } from 'vue'
import * as courseService from '@/services/courseService'
import * as liveClassService from '@/services/liveClassService'
import * as eventService from '@/services/eventService'
import * as packageService from '@/services/packageService'
import * as orderService from '@/services/orderService'
import { keyNumbers, needsAttention, comingUp } from '@/utils/adminStats'

export function useAdminDashboard() {
  const data = ref({ courses: [], liveClasses: [], events: [], packages: [], orders: [] })
  const loading = ref(true)
  const error = ref('')

  async function load() {
    loading.value = true
    error.value = ''
    try {
      const [courses, liveClasses, events, packages, orders] = await Promise.all([
        courseService.listAllCourses(),
        liveClassService.listAllLiveClasses(),
        eventService.listAllEvents(),
        packageService.listAllPackages(),
        orderService.listAllOrders(),
      ])
      data.value = { courses, liveClasses, events, packages, orders }
    } catch (err) {
      console.error(err)
      error.value = 'We couldn’t load the dashboard.'
    } finally {
      loading.value = false
    }
  }

  const numbers = computed(() => keyNumbers(data.value))
  const attention = computed(() => needsAttention(data.value))
  const upcoming = computed(() => comingUp(data.value))

  // Orders only store an id, so look up the name of what was bought
  const recentOrders = computed(() => {
    const { courses, liveClasses, events, packages, orders } = data.value
    const byId = Object.fromEntries([...courses, ...liveClasses, ...events, ...packages].map((d) => [d.$id, d.title]))
    return orders.filter((o) => o.amount > 0 || o.status !== 'confirmed').slice(0, 5).map((o) => ({ ...o, itemName: byId[o.itemId] ?? 'Removed item' }))
  })

  return { loading, error, numbers, attention, upcoming, recentOrders, load }
}
