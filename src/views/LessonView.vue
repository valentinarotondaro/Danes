<script setup>
import { computed, onMounted } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import { useCourseAccess } from '@/composables/useCourseAccess'
import { useLessons } from '@/composables/useCourses'
import LoadingState from '@/components/base/LoadingState.vue'
import EmptyState from '@/components/base/EmptyState.vue'

const route = useRoute()
const { courseId, lessonId } = route.params

const { hasAccess, checking, checkAccess } = useCourseAccess()
const { lessons, loading, fetchLessons } = useLessons(courseId)

const lesson = computed(() => lessons.value.find((l) => l.$id === lessonId))

// Extracts a YouTube video ID from a full URL, or passes through if it's
// already just an ID. Simple enough not to need a dedicated composable.
const embedUrl = computed(() => {
  if (!lesson.value?.videoUrl) return ''
  const match = lesson.value.videoUrl.match(/(?:v=|\.be\/)([\w-]{11})/)
  const id = match ? match[1] : lesson.value.videoUrl
  return `https://www.youtube.com/embed/${id}`
})

onMounted(async () => {
  await Promise.all([fetchLessons(), checkAccess(courseId)])
})
</script>

<template>
  <section class="mx-auto max-w-3xl px-6 py-12">
    <RouterLink :to="{ name: 'course-detail', params: { id: courseId } }" class="text-sm text-neutral-500 hover:text-neutral-900">
      ← Back to course
    </RouterLink>

    <LoadingState v-if="checking || loading" label="Loading lesson…" />

    <EmptyState
      v-else-if="!hasAccess"
      title="You don't have access to this lesson"
      description="Purchase the course to unlock it."
    />

    <template v-else-if="lesson">
      <h1 class="mt-4 text-2xl text-neutral-900">{{ lesson.title }}</h1>
      <div class="mt-6 aspect-video overflow-hidden rounded-lg bg-black">
        <iframe
          :src="embedUrl"
          class="h-full w-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen
        />
      </div>
    </template>

    <EmptyState v-else title="Lesson not found" />
  </section>
</template>
