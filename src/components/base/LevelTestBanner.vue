<script setup>
import { RouterLink } from 'vue-router'
import CoverPhoto from '@/components/base/CoverPhoto.vue'
import levelImg from '@/assets/img/woman-sweater.jpg'

// The "take the level test" block. Home and Courses use it with their own words.
defineProps({
  title: { type: String, default: 'Not sure where to start?' },
  text: {
    type: String,
    default: 'Answer a few questions and get your level, your strengths and the course that fits you, with no guessing.',
  },
})
</script>

<template>
  <section id="level" class="flex flex-col gap-6 rounded-ds bg-sky p-6 lg:flex-row">
    <CoverPhoto :src="levelImg" alt="A smiling woman in a beige sweater" position="object-[62%_40%]" />
    <div class="flex flex-col justify-center gap-4 p-2 lg:min-w-0 lg:flex-1 lg:basis-0 lg:p-4">
      <div class="flex gap-2">
        <span class="rounded-ds bg-sky-soft px-3 py-1 text-xs font-semibold uppercase tracking-wide text-ink">Free</span>
        <span class="rounded-ds bg-sky-soft px-3 py-1 text-xs font-semibold uppercase tracking-wide text-ink">5 min</span>
      </div>
      <h2 class="text-[40px] font-semibold leading-[1.1] text-ink sm:text-[56px]">{{ title }}</h2>
      <p class="max-w-[440px] text-ink">{{ text }}</p>
      <RouterLink to="/level-test" class="self-start rounded-ds bg-red px-6 py-3 font-semibold text-white no-underline hover:bg-red-hover sm:w-60 sm:text-center">
        Start the level test
      </RouterLink>
    </div>
  </section>
</template>