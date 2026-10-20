<script setup>
// The small coloured label: Published, Draft, Full, Paid… One place for the colours.
defineProps({
  label: { type: String, required: true },
  tone: { type: String, default: 'outline' }, // 'success' | 'red' | 'sky' | 'outline'
})

const TONES = {
  success: 'bg-success-soft text-success',
  red: 'bg-red-soft text-red',
  sky: 'bg-sky text-ink',
  outline: 'bg-white text-ink-muted ring-1 ring-inset ring-line',
}
</script>

<template>
  <span class="inline-flex whitespace-nowrap rounded-ds px-2 py-0.5 text-xs font-semibold uppercase tracking-wide" :class="TONES[tone]">
    {{ label }}
  </span>
</template>
