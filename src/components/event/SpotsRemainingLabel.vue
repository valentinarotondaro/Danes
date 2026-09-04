<script setup>
const props = defineProps({
  capacity: { type: Number, required: true },
  spotsBooked: { type: Number, default: 0 },
})
const spotsLeft = () => Math.max(props.capacity - props.spotsBooked, 0)
</script>

<template>
  <span class="text-sm" :class="spotsLeft() === 0 ? 'text-red-600' : 'text-neutral-500'">
    {{ spotsLeft() === 0 ? 'Full' : `${spotsLeft()} spots left` }}
  </span>
</template>
