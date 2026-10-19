<script setup>
defineProps({
  topics: { type: Array, default: () => [] }, // ['When did you last go to the doctor?', …]
  words: { type: Array, default: () => [] }, // [{ da, en }]
})
</script>

<template>
  <section v-if="topics.length || words.length" aria-labelledby="prep-title" class="flex flex-col gap-6 sm:gap-8">
    <div class="flex flex-col gap-2">
      <h2 id="prep-title" class="text-[32px] font-semibold leading-[1.1] text-ink sm:text-[40px]">Get ready</h2>
      <p class="text-ink-muted">Read these before you join, so the words are fresh.</p>
    </div>

    <div class="grid gap-4 sm:grid-cols-2 sm:gap-6">
      <div v-if="topics.length" class="flex flex-col gap-4 rounded-ds bg-sky p-5 text-ink sm:p-6">
        <h3 class="text-[22px] font-semibold leading-[1.25] sm:text-2xl">We’ll talk about</h3>
        <ol class="flex list-decimal flex-col gap-2 pl-5">
          <li v-for="topic in topics" :key="topic">{{ topic }}</li>
        </ol>
      </div>

      <div v-if="words.length" class="flex flex-col gap-4 rounded-ds bg-surface-secondary p-5 text-ink sm:p-6">
        <h3 class="text-[22px] font-semibold leading-[1.25] sm:text-2xl">Words to have ready</h3>
        <ul lang="da" class="flex flex-col gap-3 sm:gap-2">
          <li v-for="word in words" :key="word.da" class="flex flex-col sm:flex-row sm:justify-between sm:gap-3">
            <span class="font-semibold">{{ word.da }}</span>
            <span v-if="word.en" lang="en" class="text-sm text-ink-muted sm:text-base">{{ word.en }}</span>
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>