<script setup>
import { VALUES } from './aboutContent.js'

// Full class names written out, so Tailwind finds them
const TONES = {
  sky: 'bg-sky text-ink',
  red: 'bg-red text-white',
}
</script>

<template>
  <section class="flex flex-col gap-6 lg:gap-8">
    <div class="flex flex-col gap-2">
      <h2 class="text-[40px] leading-[1.1] font-semibold lg:text-[56px]">What we believe in</h2>
      <p class="text-ink-muted">Six values behind every lesson, every Friday and every walk.</p>
    </div>

    <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <article
        v-for="value in VALUES"
        :key="value.n"
        :class="TONES[value.tone]"
        class="flex flex-col gap-2 rounded-ds p-6 lg:min-h-[220px] lg:gap-3 lg:p-8"
      >
        <span class="text-xs font-semibold">{{ value.n }}</span>
        <h3 class="text-[32px] leading-[1.1] font-semibold lg:text-[40px]">{{ value.title }}</h3>
        <p>{{ value.text }}</p>
      </article>
    </div>
  </section>
</template>