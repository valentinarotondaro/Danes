<script setup>
// A Danish letter or email for the reading questions
defineProps({ letter: { type: Object, required: true } })
</script>

<template>
  <section aria-label="The text" class="rounded-ds bg-sky p-4 sm:p-6">
    <article lang="da" class="flex flex-col gap-4 rounded-ds bg-white p-6 text-ink sm:p-8">
      <div class="flex items-center justify-between gap-4">
        <span class="text-sm font-semibold">{{ letter.from }}</span>
        <span class="rounded-ds bg-sky-soft px-3 py-1 text-xs font-semibold uppercase tracking-wide">{{ letter.tag }}</span>
      </div>
      <p class="font-semibold">{{ letter.greeting }}</p>
      <p v-for="line in letter.lines" :key="line">{{ line }}</p>
      <div v-if="letter.highlight" class="flex flex-col gap-1 rounded-ds bg-surface-secondary p-4">
        <span class="text-2xl font-semibold leading-tight">{{ letter.highlight.title }}</span>
        <span class="text-sm">{{ letter.highlight.text }}</span>
      </div>
      <p v-for="line in letter.after" :key="line">{{ line }}</p>
      <p>
        <template v-for="(line, i) in letter.signOff" :key="line">{{ line }}<br v-if="i < letter.signOff.length - 1" /></template>
      </p>
    </article>
  </section>
</template>