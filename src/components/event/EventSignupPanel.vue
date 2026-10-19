<script setup>
import { computed, toRef } from 'vue'
import { RouterLink } from 'vue-router'
import { useEventSignup } from '@/composables/useEventSignup'
import RsvpButton from './RsvpButton.vue'

const props = defineProps({ event: { type: Object, required: true } })

// The same sign-up logic as the event cards
const { spotsBooked, isFull, spotsLeft, month, day, hasRsvpd, isWaitlisted, rsvping, error, saveSpot, waitlist } =
  useEventSignup(toRef(props, 'event'))

const weekday = computed(() => new Date(props.event.dateTime).toLocaleDateString('en-GB', { weekday: 'long' }))
const time = computed(() => new Date(props.event.dateTime).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }))
const percentTaken = computed(() => Math.min(100, Math.round((spotsBooked.value / props.event.capacity) * 100)))
</script>

<template>
  <aside aria-label="Save your spot" class="flex flex-col gap-6 rounded-ds bg-sky p-6 text-ink sm:p-8 lg:sticky lg:top-8">
    <div class="flex items-center gap-4">
      <span class="flex w-[72px] flex-none flex-col items-center rounded-ds bg-white py-2">
        <span class="text-xs font-semibold uppercase text-red">{{ month }}</span>
        <span class="text-[32px] font-semibold leading-[1.1]">{{ day }}</span>
      </span>
      <span class="flex flex-col">
        <span class="text-2xl font-semibold leading-tight">{{ weekday }}</span>
        <span class="text-sm">{{ time }} · {{ event.location }}</span>
      </span>
    </div>

    <div class="flex flex-col gap-2">
      <div class="flex items-center justify-between gap-3">
        <span class="text-sm font-semibold">{{ spotsBooked }} going</span>
        <span
          class="rounded-ds px-3 py-1 text-xs font-semibold uppercase tracking-wide"
          :class="isFull ? 'bg-white text-ink' : 'bg-red text-white'"
        >{{ isFull ? 'Full' : `${spotsLeft} spots left` }}</span>
      </div>
      <div role="meter" aria-label="Spots taken" aria-valuemin="0" :aria-valuemax="event.capacity" :aria-valuenow="spotsBooked" class="h-2 overflow-hidden rounded-ds bg-white">
        <div class="h-full bg-red" :style="{ width: `${percentTaken}%` }" />
      </div>
      <span class="text-sm">{{ spotsBooked }} of {{ event.capacity }} spots taken</span>
    </div>

    <div class="flex flex-col gap-3">
      <RsvpButton :has-rsvpd="hasRsvpd" :is-waitlisted="isWaitlisted" :loading="rsvping" :full="isFull" @rsvp="saveSpot" @waitlist="waitlist" />
      <RouterLink :to="{ name: 'event-list', hash: '#invite' }" class="rounded-ds border-2 border-ink bg-white px-6 py-3 text-center font-semibold text-ink no-underline hover:bg-sky-soft">
        Invite a friend
      </RouterLink>
      <p v-if="error" role="alert" class="text-sm font-semibold text-red">{{ error }}</p>
    </div>

    <p class="border-t border-ink pt-4 text-sm">
      Included in the Events, Social and Complete plans. Can’t make it? Cancel from your account so someone on the waitlist can come.
    </p>
  </aside>
</template>