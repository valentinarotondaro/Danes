<script setup>
import { computed, onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { useCourses } from '@/composables/useCourses'
import CoursesHero from '@/components/course/CoursesHero.vue'
import CourseGrid from '@/components/course/CourseGrid.vue'
import CoursesIncluded from '@/components/course/CoursesIncluded.vue'
import CoursesPath from '@/components/course/CoursesPath.vue'
import FilterChips from '@/components/base/FilterChips.vue'
import PlanCards from '@/components/base/PlanCards.vue'
import LevelTestBanner from '@/components/base/LevelTestBanner.vue'
import FaqList from '@/components/base/FaqList.vue'
import LoadingState from '@/components/base/LoadingState.vue'
import ErrorState from '@/components/base/ErrorState.vue'
import EmptyState from '@/components/base/EmptyState.vue'
import { LEVEL_FILTERS, PLANS, FAQ } from '@/components/course/coursesContent'

const { courses, loading, error, fetchCourses } = useCourses()

const selectedLevel = ref('All')

// Recalculates by itself whenever the courses or the filter change
const visibleCourses = computed(() =>
  selectedLevel.value === 'All'
    ? courses.value
    : courses.value.filter((c) => c.level === selectedLevel.value)
)

onMounted(fetchCourses)
</script>

<template>
  <div class="mx-auto flex max-w-[1200px] flex-col gap-[72px] px-4 py-10 sm:gap-[120px] sm:px-10 sm:py-16">
    <CoursesHero :courses="courses" />

    <section id="catalog" class="flex flex-col gap-8">
      <div class="flex flex-col gap-2">
        <h2 class="text-[40px] font-semibold leading-[1.1] text-ink sm:text-[56px]">All courses</h2>
        <p class="text-ink-muted">Pick by level, or by what you need Danish for right now.</p>
      </div>

      <FilterChips v-model="selectedLevel" :options="LEVEL_FILTERS" label="Filter by level" />

      <LoadingState v-if="loading" label="Loading courses…" />
      <ErrorState v-else-if="error" :message="error" @retry="fetchCourses" />
      <EmptyState
        v-else-if="visibleCourses.length === 0"
        title="No courses at this level yet"
        description="Try another level, or check back soon."
      />
      <CourseGrid v-else :courses="visibleCourses" />
    </section>

    <CoursesIncluded />
    <CoursesPath />

    <section id="plans" class="flex flex-col gap-8">
      <div class="flex flex-col gap-2">
        <h2 class="text-[40px] font-semibold leading-[1.1] text-ink sm:text-[56px]">Choose your plan</h2>
        <p class="text-ink-muted">Monthly, no binding. Pause or cancel from your account any time.</p>
      </div>
      <PlanCards :plans="PLANS" />
      <p class="text-sm text-ink-muted">
        Only want to practise speaking? The Social plan (Speaking Club + events) is 329 kr./month.
        <RouterLink to="/live-classes" class="font-semibold text-ink">See the Speaking Club</RouterLink>
      </p>
    </section>

    <LevelTestBanner
      title="Not sure which course?"
      text="The level test tells you where you are and which course to start with."
    />

    <section id="faq" class="flex flex-col gap-6 lg:flex-row">
      <div class="flex flex-col gap-2 lg:w-1/3">
        <span class="text-xs font-semibold uppercase tracking-wide text-red">FAQ</span>
        <h2 class="text-[40px] font-semibold leading-[1.1] text-ink sm:text-[56px]">About the courses</h2>
        <p class="text-ink-muted">Write to contact@danes.dk if you don’t find your answer here.</p>
      </div>
      <div class="lg:flex-1">
        <FaqList :items="FAQ" />
      </div>
    </section>
  </div>
</template>