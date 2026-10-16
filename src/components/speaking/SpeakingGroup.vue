<script setup>
import { GROUP_POINTS } from './speakingContent'
import groupImg from '@/assets/img/speaking-group.jpg'
import galinaImg from '@/assets/img/avatar-galina.jpg'
</script>

<template>
  <section id="group" class="flex flex-col gap-6 rounded-ds bg-sky p-6 lg:flex-row">
    <div class="flex flex-col justify-center gap-6 p-2 lg:min-w-0 lg:flex-1 lg:basis-0 lg:p-4">
      <span class="text-xs font-semibold uppercase tracking-wide text-ink">Your group</span>
      <h2 class="text-[40px] font-semibold leading-[1.1] text-ink sm:text-[56px]">Same faces, every Friday.</h2>
      <ul class="flex flex-col gap-3 text-ink">
        <li v-for="point in GROUP_POINTS" :key="point" class="flex gap-3">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" class="flex-none text-red"><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>
          {{ point }}
        </li>
      </ul>
      <figure class="m-0 flex flex-col gap-3 rounded-ds bg-white p-5">
        <blockquote class="m-0 text-ink">“My Friday group became my first friends here. We went to julefrokost together.”</blockquote>
        <figcaption class="flex items-center gap-3">
          <img :src="galinaImg" alt="" class="h-10 w-10 rounded-full object-cover" />
          <span class="text-sm font-semibold text-ink">Galina · B1 group</span>
        </figcaption>
      </figure>
    </div>
    <div class="relative h-[320px] sm:h-[420px] lg:h-auto lg:min-w-0 lg:flex-1 lg:basis-0">
      <img
        :src="groupImg"
        alt="Four friends taking a selfie outside a bageri"
        class="absolute inset-0 h-full w-full rounded-ds object-cover"
      />
    </div>
  </section>
</template>