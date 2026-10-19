<script setup>
import { RouterLink } from 'vue-router'

defineProps({ course: { type: Object, required: true } })
</script>

<template>
  <article :aria-labelledby="`rec-${course.$id}`" class="flex flex-col overflow-hidden rounded-ds bg-sky text-ink">
    <img v-if="course.thumbnailUrl" :src="course.thumbnailUrl" :alt="course.title" class="aspect-[4/3] w-full object-cover" />
    <div v-else class="aspect-[4/3] w-full bg-sky-soft" />
    <div class="flex flex-1 flex-col gap-6 p-6">
      <div class="flex flex-wrap gap-2">
        <span v-if="course.level" class="rounded-ds bg-sky-soft px-3 py-1 text-xs font-semibold uppercase tracking-wide">{{ course.level }} · Course</span>
        <span class="rounded-ds bg-red px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white">Your level</span>
      </div>
      <div class="flex flex-col gap-2">
        <h3 :id="`rec-${course.$id}`" class="text-2xl font-semibold leading-tight">{{ course.title }}</h3>
        <p v-if="course.description">{{ course.description }}</p>
      </div>
      <ul class="flex flex-col gap-2 text-sm">
        <li class="flex items-center gap-2">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" class="flex-none"><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>
          Short video lessons, at your own pace
        </li>
        <li class="flex items-center gap-2">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" class="flex-none"><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>
          Practise it at the Friday Speaking Club
        </li>
      </ul>
      <div class="mt-auto flex flex-col gap-4">
        <div class="h-px bg-sky-strong" />
        <p class="text-2xl font-semibold leading-tight">{{ course.price }} <span class="text-base font-normal">kr./month</span></p>
        <RouterLink
          :to="{ name: 'course-detail', params: { id: course.$id } }"
          class="rounded-ds bg-red px-6 py-3 text-center font-semibold text-white no-underline hover:bg-red-hover"
        >
          See the course
        </RouterLink>
      </div>
    </div>
  </article>
</template>