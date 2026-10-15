<script setup>
import { RouterLink } from 'vue-router'
import levelImg from '@/assets/img/hero-cyclists.png'
</script>

<template>
  <section id="level" class="flex flex-col gap-6 rounded-ds bg-sky p-6 lg:flex-row">
    <img
      :src="levelImg"
      alt="Friends with bikes on a Danish street"
      class="max-h-[420px] min-h-[300px] w-full flex-1 rounded-ds object-cover lg:min-h-[360px] lg:w-auto"
    />
    <div class="flex flex-1 flex-col justify-center gap-4 p-2 lg:p-4">
      <div class="flex gap-2">
        <span class="rounded-ds bg-sky-soft px-3 py-1 text-xs font-semibold uppercase tracking-wide text-ink">Free</span>
        <span class="rounded-ds bg-sky-soft px-3 py-1 text-xs font-semibold uppercase tracking-wide text-ink">15 min</span>
      </div>
      <h2 class="text-[40px] font-semibold leading-[1.1] text-ink sm:text-[56px]">Not sure where to start?</h2>
      <p class="max-w-[440px] text-ink">
        Answer a few questions and get your level, your strengths and the course that fits you, with no guessing.
      </p>
      <RouterLink to="/signup" class="self-start rounded-ds bg-red px-6 py-3 font-semibold text-white no-underline hover:bg-red-hover sm:w-60 sm:text-center">
        Start the level test
      </RouterLink>
    </div>
  </section>
</template>