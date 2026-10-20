<script setup>
// "Nothing here yet": says what's missing and, through the slot, offers the action that fixes it.
defineProps({
  title: { type: String, required: true },
  description: { type: String, default: '' },
})
</script>

<template>
  <div role="status" class="flex flex-col items-center gap-2 rounded-ds bg-surface-secondary px-6 py-12 text-center">
    <p class="text-xl font-semibold text-ink">{{ title }}</p>
    <p v-if="description" class="max-w-[480px] text-ink-muted">{{ description }}</p>
    <div v-if="$slots.default" class="mt-4"><slot /></div>
  </div>
</template>
