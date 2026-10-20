<script setup>
import { RouterLink } from 'vue-router'

// A calm header just for the lesson: back to the course, and how far you are.
defineProps({
  courseId: { type: String, required: true },
  courseTitle: { type: String, default: '' },
  doneCount: { type: Number, default: 0 },
  total: { type: Number, default: 0 },
  percent: { type: Number, default: 0 },
})
</script>

<template>
  <header class="border-b border-line">
    <div class="mx-auto flex max-w-[1360px] items-center gap-4 px-4 py-3 sm:gap-6 sm:px-10 sm:py-4">
      <RouterLink :to="{ name: 'course-detail', params: { id: courseId } }" class="flex min-w-0 items-center gap-3 font-semibold text-ink no-underline hover:text-red">
        <span aria-hidden="true" class="flex h-10 w-10 flex-none items-center justify-center rounded-full bg-sky">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m15 6-6 6 6 6" /></svg>
        </span>
        <span class="truncate">{{ courseTitle }}</span>
      </RouterLink>
      <div v-if="total" class="ml-auto flex flex-none items-center gap-3 text-sm sm:w-[320px]">
        <span class="hidden whitespace-nowrap sm:inline">{{ doneCount }} of {{ total }} lessons</span>
        <span
          role="progressbar"
          aria-label="Course progress"
          :aria-valuenow="percent"
          aria-valuemin="0"
          aria-valuemax="100"
          class="hidden h-2 flex-1 overflow-hidden rounded-ds bg-sky-soft sm:block"
        >
          <span class="block h-full rounded-ds bg-red transition-[width]" :style="{ width: `${percent}%` }" />
        </span>
        <span class="font-semibold">{{ percent }}%</span>
      </div>
    </div>
  </header>
</template>
