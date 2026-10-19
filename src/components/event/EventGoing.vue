<script setup>
import { computed } from 'vue'

// Only the number of learners, never names: orders stay private.
const props = defineProps({ event: { type: Object, required: true } })

const going = computed(() => props.event.spotsBooked ?? 0)
const line = computed(() => {
  if (going.value === 0) return 'No one yet. Be the first to save a spot.'
  if (going.value === 1) return '1 learner so far. Say hej when you meet.'
  return `${going.value} learners so far. Say hej when you meet.`
})
</script>

<template>
  <section id="going" aria-labelledby="going-title" class="flex flex-col gap-2">
    <h2 id="going-title" class="text-[32px] font-semibold leading-[1.1] text-ink sm:text-[40px]">Who’s going</h2>
    <p class="text-ink-muted">{{ line }}</p>
    <p class="text-sm text-ink-muted">We keep the list private. You meet everyone on the day.</p>
  </section>
</template>