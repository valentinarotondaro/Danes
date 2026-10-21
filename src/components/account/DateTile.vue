<script setup>
import { computed } from 'vue'

// The small square with month and day ("OCT 23"), like on the event cards.
const props = defineProps({
  date: { type: String, required: true }, // ISO
  tone: { type: String, default: 'white' }, // 'white' | 'sky'
})
const d = computed(() => new Date(props.date))
</script>

<template>
  <span
    class="flex h-16 w-16 flex-none flex-col items-center justify-center rounded-ds"
    :class="tone === 'sky' ? 'bg-sky' : 'bg-white ring-1 ring-inset ring-line'"
  >
    <span class="text-xs font-semibold uppercase">{{ d.toLocaleDateString('en-GB', { month: 'short' }) }}</span>
    <span class="text-2xl font-semibold leading-none">{{ d.getDate() }}</span>
  </span>
</template>
