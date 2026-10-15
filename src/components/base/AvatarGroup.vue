<script setup>
// Row of round avatars plus a "+150" pill. Without photos it shows the initial.
defineProps({
  people: { type: Array, required: true }, // [{ name: 'Sofia', photo?: url }]
  more: { type: Number, default: 0 },
})
</script>

<template>
  <div class="inline-flex items-center gap-1">
    <template v-for="person in people" :key="person.name">
      <img v-if="person.photo" :src="person.photo" :alt="person.name" class="h-10 w-10 rounded-full object-cover" />
      <span
        v-else
        class="inline-flex h-10 w-10 items-center justify-center rounded-full bg-sky-strong font-semibold text-ink"
        :aria-label="person.name"
      >{{ person.name[0] }}</span>
    </template>
    <span v-if="more" class="rounded-ds bg-surface-secondary px-3 py-2 text-sm font-semibold text-ink-muted">+{{ more }}</span>
  </div>
</template>