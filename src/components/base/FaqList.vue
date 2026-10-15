<script setup>
// Reusable FAQ accordion. Native <details>: opens and closes without JavaScript
// and works with the keyboard out of the box.
defineProps({
  items: { type: Array, required: true }, // [{ q: 'Question?', a: 'Answer.' }]
})
</script>

<template>
  <div class="flex flex-col gap-2 rounded-ds bg-sky p-6">
    <details v-for="item in items" :key="item.q" class="group rounded-ds bg-white">
      <summary class="flex min-h-12 cursor-pointer list-none items-center justify-between gap-4 py-2 pl-6 pr-2 font-semibold text-ink">
        {{ item.q }}
        <span
          aria-hidden="true"
          class="flex h-8 w-8 shrink-0 rotate-90 items-center justify-center rounded-full bg-red text-white transition-transform group-open:-rotate-90"
        >›</span>
      </summary>
      <p class="px-6 pb-4 text-ink">{{ item.a }}</p>
    </details>
  </div>
</template>