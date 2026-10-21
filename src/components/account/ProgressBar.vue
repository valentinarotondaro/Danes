<script setup>
// A thin red bar for course progress. The numbers next to it are for people;
// role="progressbar" tells screen readers the same thing.
defineProps({
  percent: { type: Number, required: true },
  label: { type: String, required: true },
  track: { type: String, default: 'sky' }, // 'sky' | 'white'
})
</script>

<template>
  <span
    role="progressbar"
    :aria-label="label"
    :aria-valuenow="percent"
    aria-valuemin="0"
    aria-valuemax="100"
    class="block h-2 overflow-hidden rounded-ds"
    :class="track === 'white' ? 'bg-white' : 'bg-sky-soft'"
  >
    <span class="block h-full rounded-ds bg-red" :style="{ width: `${percent}%` }" />
  </span>
</template>
