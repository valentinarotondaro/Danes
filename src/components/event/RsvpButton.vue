<script setup>
// Dumb component: it only shows the right button for the state it receives
// and emits an event. The parent (EventCard) decides what happens.
defineProps({
  hasRsvpd: { type: Boolean, required: true },
  isWaitlisted: { type: Boolean, default: false },
  loading: { type: Boolean, default: false },
  full: { type: Boolean, default: false },
})
defineEmits(['rsvp', 'waitlist'])
</script>

<template>
  <span v-if="hasRsvpd" class="rounded-ds bg-success-soft px-3 py-2 text-sm font-semibold text-success">
    You’re going
  </span>
  <span v-else-if="isWaitlisted" class="rounded-ds bg-sky px-3 py-2 text-sm font-semibold text-ink">
    On the waitlist
  </span>
  <button
    v-else-if="full"
    type="button"
    :disabled="loading"
    class="rounded-ds border border-ink px-4 py-2 text-sm font-semibold text-ink hover:bg-ink hover:text-white disabled:opacity-50"
    @click="$emit('waitlist')"
  >
    {{ loading ? 'Please wait…' : 'Join the waitlist' }}
  </button>
  <button
    v-else
    type="button"
    :disabled="loading"
    class="rounded-ds bg-red px-4 py-2 text-sm font-semibold text-white hover:bg-red-hover disabled:opacity-50"
    @click="$emit('rsvp')"
  >
    {{ loading ? 'Please wait…' : 'I’m going' }}
  </button>
</template>