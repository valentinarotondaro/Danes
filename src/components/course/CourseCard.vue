<script setup>
import { RouterLink } from 'vue-router'

defineProps({
  course: { type: Object, required: true },
})
</script>

<template>
  <RouterLink
    :to="{ name: 'course-detail', params: { id: course.$id } }"
    class="group block overflow-hidden rounded-2xl border border-neutral-200 bg-white transition-shadow hover:shadow-md"
  >
    <div class="aspect-[16/9] bg-sage/20">
      <img
        v-if="course.thumbnailUrl"
        :src="course.thumbnailUrl"
        :alt="course.title"
        class="h-full w-full object-cover"
      />
    </div>
    <div class="p-4">
      <span class="inline-block rounded-full bg-sage/15 px-2.5 py-0.5 text-xs font-medium text-sage">
        Learn
      </span>
      <h3 class="mt-2 text-lg text-neutral-900 group-hover:text-[#C8102E]">
        {{ course.title }}
      </h3>
      <p class="mt-1 line-clamp-2 text-sm text-neutral-500">{{ course.description }}</p>
      <p class="mt-3 font-medium text-neutral-900">{{ course.price }} DKK</p>
    </div>
  </RouterLink>
</template>
