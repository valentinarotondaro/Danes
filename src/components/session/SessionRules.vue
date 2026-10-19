<script setup>
const RULES = [
  'Danish first, English when you’re stuck',
  'Mistakes are welcome, always',
  'Give everyone time to finish',
  'No recording, what’s said stays here',
]
</script>

<template>
  <section aria-labelledby="rules-title" class="flex flex-col gap-4 sm:gap-6">
    <h2 id="rules-title" class="text-[32px] font-semibold leading-[1.1] text-ink sm:text-[40px]">Group rules</h2>
    <ul class="grid gap-3 sm:grid-cols-2">
      <li v-for="rule in RULES" :key="rule" class="flex gap-3 text-ink">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" class="flex-none text-red">
          <path d="M5 12.5l4.5 4.5L19 7.5" />
        </svg>
        {{ rule }}
      </li>
    </ul>
  </section>
</template>