<script setup>
// A bordered box with a title, to group the fields of a form ("Details", "Price"…).
defineProps({
  title: { type: String, required: true },
  description: { type: String, default: '' },
})
</script>

<template>
  <section class="flex flex-col gap-5 rounded-ds border border-line p-6">
    <div class="flex flex-col gap-1">
      <h2 class="text-2xl font-semibold leading-tight">{{ title }}</h2>
      <p v-if="description" class="text-sm text-ink-muted">{{ description }}</p>
    </div>
    <slot />
  </section>
</template>
