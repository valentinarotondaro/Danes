<script setup>
import { RouterLink } from 'vue-router'
import AvatarGroup from '@/components/base/AvatarGroup.vue'
import { LEARNERS } from './homeContent'
import heroImg from '@/assets/img/danes-smiles.avif'
</script>

<template>
  <section id="top" class="flex flex-col overflow-hidden rounded-ds bg-sky lg:flex-row">
    <div class="flex flex-1 flex-col justify-between gap-8 p-8 sm:p-10 lg:min-h-[520px]">
      <div class="flex flex-col gap-4">
        <span class="text-xs font-semibold uppercase tracking-wide text-ink">Your bridge into Danish life</span>
        <h1 class="max-w-[520px] text-[40px] font-semibold leading-[1.1] text-ink sm:text-[56px]">
          Everyday Danish, built for real life.
        </h1>
        <p class="max-w-[420px] text-ink">
          Self-paced courses, a weekly Speaking Club and monthly events for newcomers who want to feel at home in Denmark.
        </p>
      </div>
      <div class="flex items-center gap-3">
        <AvatarGroup :people="LEARNERS" :more="150" />
        <span class="text-sm text-ink">learners already speaking</span>
      </div>
      <div class="flex flex-col gap-4 sm:flex-row">
        <RouterLink to="/signup" class="rounded-ds bg-red px-6 py-3 text-center font-semibold text-white no-underline hover:bg-red-hover sm:w-60">
          Start the level test
        </RouterLink>
        <a href="#how" class="rounded-ds bg-white px-6 py-3 text-center font-semibold text-ink no-underline hover:bg-sky-soft sm:w-60">
          How it works
        </a>
      </div>
    </div>
    <img
      :src="heroImg"
      alt="Friends laughing and hugging on a colourful street"
      class="max-h-[560px] min-h-[320px] w-full flex-1 object-cover lg:min-h-[520px] lg:w-auto"
    />
  </section>
</template>