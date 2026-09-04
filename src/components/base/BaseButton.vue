<script setup>
defineProps({
  loading: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
  type: { type: String, default: 'button' },
})
</script>

<template>
  <button
    :type="type"
    :disabled="disabled || loading"
    class="w-full rounded-md bg-[#C8102E] px-4 py-2.5 font-medium text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
  >
    <slot v-if="!loading" />
    <span v-else>Please wait…</span>
  </button>
</template>
