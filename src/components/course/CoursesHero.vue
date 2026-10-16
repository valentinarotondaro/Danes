<script setup>
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import CoverPhoto from '@/components/base/CoverPhoto.vue'
import heroImg from '@/assets/img/cafe-letter.jpg'

// The tags use the real courses, so "3 courses" and the price stay true
const props = defineProps({
  courses: { type: Array, required: true },
})

const cheapest = computed(() =>
  props.courses.length ? Math.min(...props.courses.map((c) => c.price)) : null
)
const tags = computed(() => [
  props.courses.length === 1 ? '1 course' : `${props.courses.length} courses`,
  'Self-paced',
  ...(cheapest.value !== null ? [`From ${cheapest.value} kr./month`] : []),
])
</script>

<template>
  <section id="top" class="flex flex-col overflow-hidden rounded-ds bg-sky lg:flex-row">
    <div class="flex flex-col justify-between gap-8 p-8 sm:p-10 lg:min-h-[480px] lg:min-w-0 lg:flex-1 lg:basis-0">
      <div class="flex flex-col gap-4">
        <span class="text-xs font-semibold uppercase tracking-wide text-ink">Courses · A1 to B1</span>
        <h1 class="max-w-[540px] text-[40px] font-semibold leading-[1.1] text-ink sm:text-[56px]">
          Danish for the life you’re building here.
        </h1>
        <p class="max-w-[440px] text-ink">
          Short video lessons about real situations: the bakery, the kommune, your job. Learn at your own pace and
          practise out loud on Fridays.
        </p>
      </div>
      <ul v-if="courses.length" class="flex flex-wrap gap-2">
        <li v-for="tag in tags" :key="tag" class="rounded-ds bg-sky-soft px-3 py-1 text-xs font-semibold uppercase tracking-wide text-ink">
          {{ tag }}
        </li>
      </ul>
      <div class="flex flex-col gap-4 sm:flex-row">
        <RouterLink to="/signup" class="rounded-ds bg-red px-6 py-3 text-center font-semibold text-white no-underline hover:bg-red-hover sm:w-60">
          Start the level test
        </RouterLink>
        <a href="#plans" class="rounded-ds bg-white px-6 py-3 text-center font-semibold text-ink no-underline hover:bg-sky-soft sm:w-60">
          Compare plans
        </a>
      </div>
    </div>
    <CoverPhoto :src="heroImg" alt="Two learners laughing over a Danish letter in a café" :rounded="false" />
  </section>
</template>