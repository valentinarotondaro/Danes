<script setup>
import { computed, onMounted, ref } from 'vue'
import { useCourses } from '@/composables/useCourses'
import CourseGrid from '@/components/course/CourseGrid.vue'
import LoadingState from '@/components/base/LoadingState.vue'
import ErrorState from '@/components/base/ErrorState.vue'
import EmptyState from '@/components/base/EmptyState.vue'

const { courses, loading, error, fetchCourses } = useCourses()

const LEVELS = ['All', 'A1', 'A2', 'B1']
const selectedLevel = ref('All')

// Se recalcula sola cada vez que cambian los cursos o el filtro
const visibleCourses = computed(() =>
  selectedLevel.value === 'All'
    ? courses.value
    : courses.value.filter((c) => c.level === selectedLevel.value)
)

onMounted(fetchCourses)
</script>

<template>
  <section class="mx-auto max-w-[1200px] px-4 py-16 sm:px-10 sm:py-20">
    <header class="flex flex-col gap-4">
      <span class="text-sm font-semibold uppercase tracking-wide text-red">Learn it</span>
      <h1 class="text-[40px] font-semibold leading-[1.1] text-ink sm:text-[56px]">Courses</h1>
      <p class="max-w-xl text-lg text-ink-muted">
        Self-paced video lessons from A1 to B1. Each one is a real situation, start to finish.
      </p>
    </header>

    <div role="group" aria-label="Filter by level" class="mt-10 flex flex-wrap gap-2">
      <button
        v-for="lvl in LEVELS"
        :key="lvl"
        type="button"
        :aria-pressed="selectedLevel === lvl"
        class="rounded-ds border px-4 py-2 text-sm font-semibold transition-colors"
        :class="selectedLevel === lvl
          ? 'border-ink bg-ink text-white'
          : 'border-line bg-white text-ink hover:border-ink'"
        @click="selectedLevel = lvl"
      >
        {{ lvl }}
      </button>
    </div>

    <div class="mt-10">
      <LoadingState v-if="loading" label="Loading courses…" />
      <ErrorState v-else-if="error" :message="error" @retry="fetchCourses" />
      <EmptyState
        v-else-if="visibleCourses.length === 0"
        title="No courses at this level yet"
        description="Try another level, or check back soon."
      />
      <CourseGrid v-else :courses="visibleCourses" />
    </div>

    <aside class="mt-20 flex flex-col gap-6 rounded-ds bg-sky p-8 sm:flex-row sm:items-center sm:p-12">
      <div class="flex-1">
        <h2 class="text-[32px] font-semibold leading-tight text-ink">Not sure about your level?</h2>
        <p class="mt-2 text-ink">Take the 5-minute test and we’ll point you to the right course.</p>
      </div>
      <RouterLink to="/level-test" class="rounded-ds bg-red px-6 py-3 font-semibold text-white no-underline hover:bg-red-hover">
        Start the level test
      </RouterLink>
    </aside>
  </section>
</template>
