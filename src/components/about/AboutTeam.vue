<script setup>
import { TEAM } from './aboutContent.js'

// The list goes twice so the loop has no gap. The animation moves it half its width,
// then starts again. The copy is hidden from screen readers (aria-hidden).
const loop = [
  ...TEAM.map((person) => ({ ...person, copy: false })),
  ...TEAM.map((person) => ({ ...person, copy: true })),
]
</script>

<template>
  <section class="flex flex-col gap-6 lg:gap-8">
    <div class="flex flex-col gap-2">
      <h2 class="text-[40px] leading-[1.1] font-semibold lg:text-[56px]">The people behind DANES</h2>
      <p class="text-ink-muted">Newcomers and native Danes, working together in four cities.</p>
    </div>

    <div role="region" aria-label="DANES team, scrolling" class="team-track -mx-4 lg:mx-0 lg:rounded-ds">
      <div class="team-marquee">
        <article
          v-for="person in loop"
          :key="`${person.name}-${person.copy}`"
          :aria-hidden="person.copy ? 'true' : undefined"
          class="mr-4 flex w-[220px] flex-none flex-col gap-3 rounded-ds bg-surface-secondary p-4 lg:mr-6 lg:w-[280px] lg:gap-4 lg:p-6"
        >
          <img :src="person.img" :alt="person.copy ? '' : person.alt" class="aspect-square w-full rounded-ds object-cover" />
          <span class="flex flex-col gap-0.5">
            <span class="text-lg leading-[1.25] font-semibold lg:text-2xl">{{ person.name }}</span>
            <span class="text-sm text-ink-muted">{{ person.role }}</span>
          </span>
          <p class="text-sm lg:text-base">{{ person.line }}</p>
        </article>
      </div>
    </div>
  </section>
</template>

<style scoped>
.team-track {
  overflow: hidden;
}
.team-marquee {
  display: flex;
  width: max-content;
  animation: team-marquee 45s linear infinite;
}
/* Hover pauses it, so people can read a card */
.team-marquee:hover {
  animation-play-state: paused;
}
@keyframes team-marquee {
  from { transform: translateX(-50%); }
  to { transform: translateX(0); }
}
/* People who turn off motion get a row they can scroll by hand */
@media (prefers-reduced-motion: reduce) {
  .team-track { overflow-x: auto; }
  .team-marquee { animation: none; }
}
</style>