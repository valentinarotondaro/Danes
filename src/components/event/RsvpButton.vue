<script setup>
// Dumb component: shows the right button for the state it receives
// and emits an event. The parent decides what actually happens.
defineProps({
  hasRsvpd: { type: Boolean, required: true },
  isWaitlisted: { type: Boolean, default: false },
  loading: { type: Boolean, default: false },
  full: { type: Boolean, default: false },
  variant: { type: String, default: 'red' }, // 'red' on light cards, 'sky' on the red Next up block
})
defineEmits(['rsvp', 'waitlist'])
</script>

<template>
  <p v-if="hasRsvpd" class="rounded-ds bg-success-soft px-4 py-3 text-center font-semibold text-success">
    You’re going
  </p>
  <p v-else-if="isWaitlisted" class="rounded-ds bg-white px-4 py-3 text-center font-semibold text-ink">
    You’re on the waitlist
  </p>
  <button
    v-else-if="full"
    type="button"
    :disabled="loading"
    class="w-full rounded-ds border-2 border-ink bg-white px-6 py-3 font-semibold text-ink hover:bg-ink hover:text-white disabled:opacity-50"
    @click="$emit('waitlist')"
  >
    {{ loading ? 'Please wait…' : 'Join the waitlist' }}
  </button>
  <button
    v-else
    type="button"
    :disabled="loading"
    class="w-full rounded-ds px-6 py-3 font-semibold disabled:opacity-50"
    :class="variant === 'sky' ? 'bg-sky text-ink hover:bg-white' : 'bg-red text-white hover:bg-red-hover'"
    @click="$emit('rsvp')"
  >
    {{ loading ? 'Please wait…' : 'Save your spot' }}
  </button>
</template>