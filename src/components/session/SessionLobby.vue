<script setup>
import { computed, toRef } from 'vue'
import { useSessionBooking } from '@/composables/useSessionBooking'
import { useSessionTiming } from '@/composables/useSessionTiming'
import SessionLobbyHeader from './SessionLobbyHeader.vue'
import SessionJoin from './SessionJoin.vue'
import SessionPrep from './SessionPrep.vue'
import SessionRules from './SessionRules.vue'
import SessionGroupCard from './SessionGroupCard.vue'
import SessionActions from './SessionActions.vue'

// Lives in its own component so it only starts once the session has loaded
const props = defineProps({
  session: { type: Object, required: true },
  host: { type: Object, default: null },
  topics: { type: Array, default: () => [] },
  words: { type: Array, default: () => [] },
})

const session = toRef(props, 'session')
const { taken, isFull, isBooked, isWaitlisted, rsvping, error, book, waitlist, cancelSeat } = useSessionBooking(session)
const { timing, label } = useSessionTiming(session)

// The server refuses cancelling once it has started, so the button follows the same rule
const canCancel = computed(() => isBooked.value && ['upcoming', 'open'].includes(timing.value.state))
</script>

<template>
  <SessionLobbyHeader :session="session" :timing="timing" :label="label" />

  <div class="flex flex-col gap-10 lg:flex-row lg:items-start">
    <div class="flex min-w-0 flex-col gap-12 sm:gap-[72px] lg:flex-1">
      <SessionJoin
        :session="session"
        :is-booked="isBooked"
        :is-waitlisted="isWaitlisted"
        :is-full="isFull"
        :can-join="timing.canJoin"
        :ended="timing.state === 'ended'"
        :loading="rsvping"
        :error="error"
        @book="book"
        @waitlist="waitlist"
      />
      <!-- Phone: the group card sits here, like the mobile design -->
      <div class="lg:hidden">
        <SessionGroupCard :host="host" :taken="taken" :capacity="session.capacity" />
      </div>
      <SessionPrep :topics="topics" :words="words" />
      <SessionRules />
    </div>

    <aside class="flex flex-col gap-6 lg:sticky lg:top-8 lg:w-[380px]">
      <div class="hidden lg:block">
        <SessionGroupCard :host="host" :taken="taken" :capacity="session.capacity" />
      </div>
      <SessionActions :session="session" :can-cancel="canCancel" :loading="rsvping" @cancel="cancelSeat" />
    </aside>
  </div>
</template>