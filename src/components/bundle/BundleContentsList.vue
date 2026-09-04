<script setup>
import { onMounted, ref } from 'vue'
import * as courseService from '@/services/courseService'
import * as liveClassService from '@/services/liveClassService'
import * as eventService from '@/services/eventService'

const props = defineProps({ bundle: { type: Object, required: true } })

const course = ref(null)
const liveClass = ref(null)
const event = ref(null)

onMounted(async () => {
  const [c, lc, ev] = await Promise.all([
    props.bundle.courseId ? courseService.getCourseById(props.bundle.courseId).catch(() => null) : null,
    props.bundle.liveClassId ? liveClassService.getLiveClassById(props.bundle.liveClassId).catch(() => null) : null,
    props.bundle.eventId ? eventService.getEventById(props.bundle.eventId).catch(() => null) : null,
  ])
  course.value = c
  liveClass.value = lc
  event.value = ev
})
</script>

<template>
  <ul class="divide-y divide-neutral-200 border-y border-neutral-200">
    <li v-if="course" class="flex items-baseline gap-3 py-3">
      <span class="h-2 w-2 shrink-0 rounded-full bg-[#1A6B3F]" />
      <p class="text-neutral-900">Learn — {{ course.title }}</p>
    </li>
    <li v-if="liveClass" class="flex items-baseline gap-3 py-3">
      <span class="h-2 w-2 shrink-0 rounded-full bg-[#1E5A96]" />
      <p class="text-neutral-900">Practice — {{ liveClass.title }}</p>
    </li>
    <li v-if="event" class="flex items-baseline gap-3 py-3">
      <span class="h-2 w-2 shrink-0 rounded-full bg-[#C8102E]" />
      <p class="text-neutral-900">Belong — {{ event.title }}</p>
    </li>
  </ul>
</template>
