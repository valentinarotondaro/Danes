<script setup>
import { computed, onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { useCourses } from '@/composables/useCourses'
import CourseCard from '@/components/course/CourseCard.vue'
import FilterChips from '@/components/base/FilterChips.vue'
import LoadingState from '@/components/base/LoadingState.vue'

const { courses, loading, error, fetchCourses } = useCourses()

const LEVELS = [
  { value: 'All', label: 'All' },
  { value: 'A1', label: 'A1 Beginner' },
  { value: 'A2', label: 'A2 Elementary' },
  { value: 'B1', label: 'B1 Intermediate' },
]
const level = ref('All')

// A preview: at most 3 courses. The full list lives on /courses.
const shownCourses = computed(() =>
  (level.value === 'All' ? courses.value : courses.value.filter((c) => c.level === level.value)).slice(0, 3)
)

onMounted(fetchCourses)
</script>

<template>
  <section id="courses" class="flex flex-col gap-8">
    <div class="flex flex-col gap-2">
      <h2 class="text-[40px] font-semibold leading-[1.1] text-ink sm:text-[56px]">Feel at home in Denmark</h2>
      <p class="text-ink-muted">Self-paced courses built around what you need for everyday life.</p>
    </div>

    <div class="flex flex-wrap items-center gap-3">
      <FilterChips v-model="level" :options="LEVELS" label="Filter by level" />
      <RouterLink to="/courses" class="rounded-ds bg-red px-6 py-2.5 font-semibold text-white no-underline hover:bg-red-hover sm:ml-auto">
        See all courses
      </RouterLink>
    </div>

    <LoadingState v-if="loading" label="Loading courses…" />
    <!-- On the home page a failed preview shouldn't block the page: just point to the catalog -->
    <p v-else-if="error || shownCourses.length === 0" class="text-ink-muted">
      No courses to show here yet.
      <RouterLink to="/courses" class="font-semibold text-red">See the catalog</RouterLink>
    </p>
    <div v-else class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <CourseCard v-for="course in shownCourses" :key="course.$id" :course="course" />
    </div>
  </section>
</template>