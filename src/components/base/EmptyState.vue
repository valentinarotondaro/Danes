<script setup>
defineProps({
  title: { type: String, required: true },
  description: { type: String, default: '' },
})
</script>

<template>
  <div class="py-16 text-center">
    <p class="text-xl text-neutral-900">{{ title }}</p>
    <p v-if="description" class="mt-2 text-neutral-500">{{ description }}</p>
    <slot />
  </div>
</template>
