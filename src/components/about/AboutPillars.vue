<script setup>
import { PILLARS } from './aboutContent.js'
</script>

<template>
  <section class="flex flex-col gap-6 lg:gap-8">
    <div class="flex flex-col gap-2">
      <h2 class="text-[40px] leading-[1.1] font-semibold lg:text-[56px]">Learn it, say it, live it</h2>
      <p class="text-ink-muted">Three parts that work best together.</p>
    </div>

    <div class="grid gap-6 lg:grid-cols-3">
      <RouterLink
        v-for="pillar in PILLARS"
        :key="pillar.title"
        :to="pillar.to"
        class="group flex flex-col overflow-hidden rounded-ds bg-sky text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
      >
        <img :src="pillar.img" :alt="pillar.alt" class="h-45 w-full object-cover lg:aspect-[4/3] lg:h-auto" />
        <span class="flex flex-1 flex-col gap-2 p-5 lg:p-6">
          <span class="text-xs font-semibold tracking-[0.02em] text-red uppercase">{{ pillar.verb }}</span>
          <span class="flex items-center justify-between gap-3">
            <span class="text-[22px] leading-[1.25] font-semibold lg:text-2xl">{{ pillar.title }}</span>
            <!-- Red arrow disc, darker on hover -->
            <span aria-hidden="true" class="flex size-8 shrink-0 items-center justify-center rounded-full bg-red text-white transition-colors group-hover:bg-red-hover">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M9 6l6 6-6 6" /></svg>
            </span>
          </span>
          <span>{{ pillar.text }}</span>
        </span>
      </RouterLink>
    </div>
  </section>
</template>