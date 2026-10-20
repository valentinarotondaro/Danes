<script setup>
// The button from the design system. While `loading` is true it is
// disabled and shows "Please wait…", so nobody clicks twice.
defineProps({
  loading: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
  type: { type: String, default: 'button' },
  variant: { type: String, default: 'primary' }, // 'primary' (red) | 'secondary' (outline)
})

// Full class names written out, so Tailwind finds them
const VARIANTS = {
  primary: 'bg-red text-white hover:bg-red-hover',
  secondary: 'border-2 border-ink bg-white text-ink hover:bg-ink hover:text-white',
}
</script>

<template>
  <button
    :type="type"
    :disabled="disabled || loading"
    :aria-busy="loading ? 'true' : undefined"
    :class="VARIANTS[variant]"
    class="inline-flex h-12 w-full items-center justify-center rounded-ds px-6 font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink disabled:cursor-not-allowed disabled:opacity-50"
  >
    <slot v-if="!loading" />
    <span v-else>Please wait…</span>
  </button>
</template>