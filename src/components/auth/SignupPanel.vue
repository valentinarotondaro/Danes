<script setup>
const PERKS = ['Free 5-minute level test', 'Speaking Club every Friday', 'Events in four cities']
</script>

<template>
  <section
    aria-label="Why join DANES"
        class="flex flex-col justify-center gap-6 rounded-ds bg-red p-8 text-white sm:p-10 lg:min-w-0 lg:flex-1 lg:basis-0 lg:gap-8 lg:p-14"
  >
    <h1 class="max-w-[520px] text-[32px] font-semibold leading-[1.1] lg:text-[56px]">Your bridge into Danish life.</h1>
    <ul class="flex flex-col gap-3">
      <li v-for="perk in PERKS" :key="perk" class="flex gap-3">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" class="flex-none">
          <path d="M5 12.5l4.5 4.5L19 7.5" />
        </svg>
        {{ perk }}
      </li>
    </ul>
  </section>
</template>