<script setup>
import { RouterLink } from 'vue-router'
import ProgressBar from '@/components/account/ProgressBar.vue'

// One course the learner has: photo, where they stopped, and the way back in.
// `big` is the "Continue where you left off" version on the Overview.
defineProps({
  course: { type: Object, required: true },
  teacher: { type: Object, default: null },
  progress: { type: Object, required: true }, // from courseProgress()
  big: { type: Boolean, default: false },
})
</script>

<template>
  <article class="flex flex-col overflow-hidden rounded-ds sm:flex-row" :class="big ? 'bg-surface-secondary' : 'border border-line'">
    <RouterLink
      :to="progress.next ? { name: 'lesson', params: { courseId: course.$id, lessonId: progress.next.$id } } : { name: 'course-detail', params: { id: course.$id } }"
      :aria-label="`Continue ${course.title}`"
      class="relative block min-h-[200px] sm:min-h-[260px] sm:flex-1"
    >
      <img v-if="course.thumbnailUrl" :src="course.thumbnailUrl" alt="" class="absolute inset-0 h-full w-full object-cover" />
      <span v-else class="absolute inset-0 bg-sky" />
      <span v-if="progress.next" aria-hidden="true" class="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-[0_8px_24px_rgba(0,0,0,0.2)]">
        <svg width="26" height="26" viewBox="0 0 24 24" fill="var(--color-red)"><path d="M8 5v14l11-7z" /></svg>
      </span>
    </RouterLink>

    <div class="flex flex-col gap-4 p-6 sm:p-8" :class="big ? 'sm:flex-1' : 'sm:flex-[2]'">
      <div class="flex flex-wrap items-center gap-2">
        <span class="rounded-ds bg-sky px-2 py-0.5 text-xs font-semibold uppercase tracking-wide">{{ course.level ? `${course.level} · ` : '' }}{{ course.title }}</span>
        <span v-if="teacher && !big" class="text-sm text-ink-muted">with {{ teacher.name }}</span>
      </div>

      <div class="flex flex-col gap-1">
        <span v-if="big" class="text-sm text-ink-muted">{{ progress.done ? 'Continue where you left off' : 'Start your course' }}</span>
        <h3 class="font-semibold leading-tight" :class="big ? 'text-[32px]' : 'text-[28px] sm:text-[32px]'">
          {{ big && progress.next ? progress.next.title : course.title }}
        </h3>
        <p v-if="!big && course.description" class="max-w-[520px] text-ink-muted">{{ course.description }}</p>
      </div>

      <div v-if="progress.total" class="flex max-w-[520px] flex-col gap-2">
        <div class="flex gap-4 text-sm">
          <span v-if="progress.next && !big">Next: <strong>{{ progress.next.title }}</strong></span>
          <span v-else-if="progress.next">Lesson {{ progress.nextNumber }} of {{ progress.total }}</span>
          <span v-else>All {{ progress.total }} lessons done</span>
          <span class="ml-auto font-semibold">{{ progress.percent }}%</span>
        </div>
        <ProgressBar :percent="progress.percent" :label="`${course.title} progress`" :track="big ? 'white' : 'sky'" />
      </div>
      <p v-else class="text-sm text-ink-muted">Lessons are coming soon.</p>

      <div class="mt-auto flex flex-wrap gap-3">
        <RouterLink
          v-if="progress.next"
          :to="{ name: 'lesson', params: { courseId: course.$id, lessonId: progress.next.$id } }"
          class="inline-flex h-12 items-center rounded-ds bg-red px-6 font-semibold text-white no-underline hover:bg-red-hover"
        >
          {{ progress.done ? 'Continue lesson' : 'Start lesson 1' }}
        </RouterLink>
        <RouterLink
          :to="{ name: 'course-detail', params: { id: course.$id } }"
          class="inline-flex h-12 items-center rounded-ds border-2 border-ink bg-white px-6 font-semibold text-ink no-underline hover:bg-ink hover:text-white"
        >
          Course outline
        </RouterLink>
      </div>
    </div>
  </article>
</template>
