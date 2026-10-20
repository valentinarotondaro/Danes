<script setup>
// Shown while Appwrite answers. `rows` > 0 draws grey skeleton rows instead of
// the spinner, so a list keeps its shape and the page doesn't jump.
defineProps({
  label: { type: String, default: 'Loading…' },
  rows: { type: Number, default: 0 },
})
</script>

<template>
  <div v-if="rows" aria-busy="true" :aria-label="label" class="flex flex-col gap-3">
    <div v-for="n in rows" :key="n" class="flex items-center gap-4 rounded-ds border border-line p-4">
      <span class="h-12 w-16 flex-none animate-pulse rounded-xl bg-surface-secondary" />
      <span class="h-4 animate-pulse rounded bg-surface-secondary" :style="{ width: `${40 + ((n * 17) % 40)}%` }" />
    </div>
  </div>
  <div v-else role="status" class="flex items-center justify-center gap-2 py-16 text-ink-muted">
    <svg class="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
    </svg>
    {{ label }}
  </div>
</template>
