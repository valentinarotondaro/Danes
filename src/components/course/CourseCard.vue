<script setup>
import { computed } from 'vue'
import { RouterLink } from 'vue-router'

const props = defineProps({
  course: { type: Object, required: true },
})

// "A1 · Course" si tiene nivel, si no solo "Course"
const tag = computed(() => (props.course.level ? `${props.course.level} · Course` : 'Course'))

// 399 → "399 kr./month"
const price = computed(() => `${props.course.price} kr./month`)
</script>

<template>
  <RouterLink
    :to="{ name: 'course-detail', params: { id: course.$id } }"
    class="group flex flex-col gap-4 no-underline"
  >
    <div class="aspect-[4/3] overflow-hidden rounded-ds bg-sky-soft">
      <img
        v-if="course.thumbnailUrl"
        :src="course.thumbnailUrl"
        :alt="course.title"
        class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
      />
    </div>

    <span class="self-start rounded-ds bg-sky-soft px-3 py-1 text-xs font-semibold uppercase tracking-wide text-ink">
      {{ tag }}
    </span>

    <h3 class="text-2xl font-semibold leading-tight text-ink group-hover:text-red">
      {{ course.title }}
    </h3>

    <p class="line-clamp-3 text-ink-muted">{{ course.description }}</p>

    <div class="mt-auto flex items-center justify-between pt-2">
      <span class="font-semibold text-ink">{{ price }}</span>
      <span class="flex items-center gap-2 text-sm font-semibold text-ink">
        See the course
        <span aria-hidden="true" class="flex h-8 w-8 items-center justify-center rounded-full bg-red text-white">›</span>
      </span>
    </div>
  </RouterLink>
</template>