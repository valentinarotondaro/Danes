<script setup>
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import StatusTag from '@/components/admin/StatusTag.vue'
import { buildIcs, downloadFile } from '@/utils/calendar'

// An event the learner is going to (or waiting for), with the actions that fit.
const props = defineProps({
  event: { type: Object, required: true }, // event + { status }
  busy: { type: Boolean, default: false },
})
defineEmits(['cancel', 'leave'])

const going = computed(() => props.event.status === 'confirmed')
const when = computed(() => {
  const d = new Date(props.event.dateTime)
  return `${d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })} · ${d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}`
})
const others = computed(() => Math.max(0, (props.event.spotsBooked ?? 0) - 1))
const spotsLeft = computed(() => Math.max(0, props.event.capacity - (props.event.spotsBooked ?? 0)))

function addToCalendar() {
  const e = props.event
  downloadFile(
    `danes-${e.$id}.ics`,
    buildIcs({ uid: `${e.$id}@danes.dk`, title: e.title, start: e.dateTime, durationMinutes: e.durationMinutes ?? 120, description: [e.city, e.location, e.meetingPoint].filter(Boolean).join(' · ') })
  )
}
</script>

<template>
  <article class="flex min-w-0 flex-col overflow-hidden rounded-ds" :class="going ? 'border border-line' : 'bg-sky-soft'">
    <div class="relative">
      <img v-if="event.imageUrl" :src="event.imageUrl" alt="" class="aspect-[16/7] w-full object-cover" />
      <span v-else class="block aspect-[16/7] w-full bg-sky" />
      <StatusTag :label="going ? 'You’re going' : 'On the waitlist'" :tone="going ? 'success' : 'sky'" class="absolute left-4 top-4" />
    </div>
    <div class="flex flex-1 flex-col gap-4 p-6">
      <div class="flex flex-col gap-1">
        <span class="text-sm text-ink-muted">{{ when }}</span>
        <RouterLink :to="{ name: 'event-detail', params: { id: event.$id } }" class="text-2xl font-semibold leading-tight text-ink no-underline hover:text-red">{{ event.title }}</RouterLink>
        <span>{{ [event.city, event.meetingPoint || event.location].filter(Boolean).join(' · ') }}</span>
      </div>

      <p v-if="going" class="text-sm">You and {{ others }} {{ others === 1 ? 'other' : 'others' }}{{ spotsLeft ? ` · ${spotsLeft} spots left` : ' · full' }}</p>
      <p v-else class="text-sm">If a spot opens, we email you. You only pay if you take it.</p>

      <div class="mt-auto flex flex-wrap items-center gap-3">
        <template v-if="going">
          <button type="button" class="inline-flex h-10 items-center rounded-ds border-2 border-ink px-4 text-sm font-semibold hover:bg-ink hover:text-white" @click="addToCalendar">Add to calendar</button>
          <button type="button" :disabled="busy" class="ml-auto text-sm font-semibold underline hover:text-red" @click="$emit('cancel')">Can’t go?</button>
        </template>
        <button v-else type="button" :disabled="busy" class="text-sm font-semibold underline hover:text-red" @click="$emit('leave')">Leave the waitlist</button>
      </div>
    </div>
  </article>
</template>
