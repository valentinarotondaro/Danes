<script setup>
import { onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import * as orderService from '@/services/orderService'
import * as courseService from '@/services/courseService'
import * as liveClassService from '@/services/liveClassService'
import * as eventService from '@/services/eventService'
import * as packageService from '@/services/packageService'
import LoadingState from '@/components/base/LoadingState.vue'
import EmptyState from '@/components/base/EmptyState.vue'

const { currentUser } = useAuth()
const loading = ref(true)
const grouped = ref({ course: [], liveClass: [], event: [], bundle: [] })

const fetchers = {
  course: courseService.getCourseById,
  liveClass: liveClassService.getLiveClassById,
  event: eventService.getEventById,
  bundle: packageService.getPackageById,
}

const labels = {
  course: 'Courses',
  liveClass: 'Live Classes',
  event: 'Events',
  bundle: 'Packages',
}

onMounted(async () => {
  const orders = await orderService.listOrdersForUser(currentUser.value.$id)

  const resolved = await Promise.all(
    orders.map(async (order) => {
      try {
        const item = await fetchers[order.itemType](order.itemId)
        return { order, item }
      } catch {
        return { order, item: null }
      }
    })
  )

  const next = { course: [], liveClass: [], event: [], bundle: [] }
  for (const entry of resolved) {
    if (entry.item) next[entry.order.itemType].push(entry)
  }
  grouped.value = next
  loading.value = false
})
</script>

<template>
  <section class="mx-auto max-w-2xl px-6 py-12">
    <h1 class="text-3xl text-neutral-900">My Account</h1>

    <LoadingState v-if="loading" />

    <template v-else>
      <div
        v-for="type in ['bundle', 'course', 'liveClass', 'event']"
        :key="type"
        class="mt-8"
      >
        <template v-if="grouped[type].length">
          <h2 class="text-xl text-neutral-900">{{ labels[type] }}</h2>
          <ul class="mt-3 divide-y divide-neutral-200 border-y border-neutral-200">
            <li v-for="{ order, item } in grouped[type]" :key="order.$id" class="py-3">
              <RouterLink
                v-if="type === 'course'"
                :to="{ name: 'course-detail', params: { id: item.$id } }"
                class="text-neutral-900 hover:text-[#C8102E]"
              >
                {{ item.title }}
              </RouterLink>
              <RouterLink
                v-else-if="type === 'liveClass'"
                :to="{ name: 'live-class-detail', params: { id: item.$id } }"
                class="text-neutral-900 hover:text-[#C8102E]"
              >
                {{ item.title }}
              </RouterLink>
              <span v-else class="text-neutral-900">{{ item.title }}</span>
              <span class="ml-2 text-sm text-neutral-400">{{ order.amount }} DKK</span>
            </li>
          </ul>
        </template>
      </div>

      <EmptyState
        v-if="!grouped.bundle.length && !grouped.course.length && !grouped.liveClass.length && !grouped.event.length"
        title="Nothing here yet"
        description="Browse Learn, Practice, or Belong to get started."
      />
    </template>
  </section>
</template>
