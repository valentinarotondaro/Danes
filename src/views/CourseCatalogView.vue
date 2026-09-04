<script setup>
import { onMounted } from 'vue'
import { useCourses } from '@/composables/useCourses'
import CourseGrid from '@/components/course/CourseGrid.vue'
import LoadingState from '@/components/base/LoadingState.vue'
import ErrorState from '@/components/base/ErrorState.vue'
import EmptyState from '@/components/base/EmptyState.vue'

const { courses, loading, error, fetchCourses } = useCourses()

onMounted(fetchCourses)
</script>

<template>
  <div class="bg-cream">
    <section class="mx-auto max-w-5xl px-6 py-12">
      <h1 class="font-serif text-3xl text-neutral-900">Learn</h1>
      <p class="mt-2 text-neutral-500">
        Recorded courses organized by real-life situation — go at your own pace.
      </p>

      <div class="mt-8">
        <LoadingState v-if="loading" label="Loading courses…" />
        <ErrorState v-else-if="error" :message="error" @retry="fetchCourses" />
        <EmptyState
          v-else-if="courses.length === 0"
          title="No courses yet"
          description="Check back soon — new courses are added regularly."
        />
        <CourseGrid v-else :courses="courses" />
      </div>
    </section>
  </div>
</template>
