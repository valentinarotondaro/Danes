<script setup>
import { ref } from 'vue'
import { buildIcs, downloadFile } from '@/utils/calendar'

const props = defineProps({
  session: { type: Object, required: true },
  canCancel: { type: Boolean, default: false },
  loading: { type: Boolean, default: false },
})
const emit = defineEmits(['cancel'])

// Two steps, so nobody cancels by accident
const confirming = ref(false)

function addToCalendar() {
  const ics = buildIcs({
    uid: props.session.$id,
    title: `DANES Speaking Club: ${props.session.title}`,
    start: props.session.dateTime,
    durationMinutes: props.session.durationMinutes ?? 45,
    description: `Join from the DANES site: ${window.location.href}`,
  })
  downloadFile('danes-speaking-club.ics', ics)
}

function confirmCancel() {
  emit('cancel')
  confirming.value = false
}
</script>

<template>
  <section aria-label="Your seat" class="flex flex-col gap-3 rounded-ds bg-surface-secondary p-5 sm:p-6">
    <button
      type="button"
      class="h-12 rounded-ds border-2 border-ink bg-white px-6 font-semibold text-ink hover:bg-ink hover:text-white"
      @click="addToCalendar"
    >
      Add to calendar
    </button>

    <template v-if="canCancel">
      <button
        v-if="!confirming"
        type="button"
        class="h-12 rounded-ds border-2 border-red bg-white px-6 font-semibold text-red hover:bg-red hover:text-white"
        @click="confirming = true"
      >
        Cancel my seat
      </button>

      <div v-else role="group" aria-label="Confirm cancelling" class="flex flex-col gap-2 rounded-ds bg-white p-4">
        <p class="text-sm font-semibold text-ink">Give your seat back?</p>
        <div class="flex gap-2">
          <button type="button" :disabled="loading" class="h-12 flex-1 rounded-ds bg-red px-4 font-semibold text-white hover:bg-red-hover disabled:opacity-50" @click="confirmCancel">
            {{ loading ? 'Cancelling…' : 'Yes, cancel' }}
          </button>
          <button type="button" class="h-12 flex-1 rounded-ds border-2 border-ink bg-white px-4 font-semibold text-ink" @click="confirming = false">
            Keep it
          </button>
        </div>
      </div>

      <p class="text-sm text-ink-muted">Cancel before the session starts so someone on the waitlist can join.</p>
    </template>
  </section>
</template>