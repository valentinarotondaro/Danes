<script setup>
defineProps({ words: { type: Array, required: true } }) // [{ da, en }]
</script>

<template>
  <section class="flex flex-col gap-8" aria-labelledby="words-title">
    <div class="flex flex-col gap-2">
      <h2 id="words-title" class="text-[32px] font-semibold leading-[1.1] text-ink sm:text-[40px]">Words you’ll use</h2>
      <p class="text-ink-muted">Practise them before the event, so they come out on the day.</p>
    </div>
    <ul class="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
      <li v-for="word in words" :key="word.da" lang="da" class="flex flex-col gap-1 rounded-ds bg-sky px-5 py-4 text-ink">
        <span class="font-semibold">{{ word.da }}</span>
        <span v-if="word.en" lang="en" class="text-sm">{{ word.en }}</span>
      </li>
    </ul>
  </section>
</template>