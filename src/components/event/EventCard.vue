<script setup>
import { toRef } from 'vue'
import { useEventSignup } from '@/composables/useEventSignup'
import RsvpButton from './RsvpButton.vue'

const props = defineProps({ event: { type: Object, required: true } })

const { spotsBooked, isFull, spotsLeft, month, day, when, hasRsvpd, isWaitlisted, rsvping, error, saveSpot, waitlist } =
  useEventSignup(toRef(props, 'event'))
</script>

<template>
  <article class="flex flex-col overflow-hidden rounded-ds bg-sky">
    <div class="relative">
      <img
        v-if="event.imageUrl"
        :src="event.imageUrl"
        :alt="event.title"
        class="aspect-[4/3] w-full object-cover"
      />
      <div v-else class="aspect-[4/3] w-full bg-sky-soft" />
      <span class="absolute left-4 top-4 flex w-16 flex-col items-center rounded-ds bg-white py-2 text-ink">
        <span class="text-xs font-semibold uppercase text-red">{{ month }}</span>
        <span class="text-2xl font-semibold leading-none">{{ day }}</span>
      </span>
    </div>

    <div class="flex flex-1 flex-col gap-3 p-6">
      <span v-if="event.city" class="self-start rounded-ds bg-sky-soft px-3 py-1 text-xs font-semibold uppercase tracking-wide text-ink">
        {{ event.city }}
      </span>
      <h3 class="text-2xl font-semibold leading-tight text-ink">{{ event.title }}</h3>
      <p class="text-sm font-semibold text-ink">{{ when }} · {{ event.location }}</p>

      <div class="flex items-center justify-between gap-3">
        <span class="text-sm text-ink">{{ spotsBooked }} going</span>
        <span
          class="rounded-ds px-3 py-1 text-xs font-semibold uppercase tracking-wide"
          :class="isFull ? 'bg-white text-ink-muted ring-1 ring-ink-muted' : 'bg-red text-white'"
        >
          {{ isFull ? 'Full' : `${spotsLeft} spots left` }}
        </span>
      </div>

      <div class="mt-auto pt-2">
        <RsvpButton
          :has-rsvpd="hasRsvpd"
          :is-waitlisted="isWaitlisted"
          :loading="rsvping"
          :full="isFull"
          @rsvp="saveSpot"
          @waitlist="waitlist"
        />
        <p v-if="error" role="alert" class="mt-2 text-sm font-semibold text-red">{{ error }}</p>
      </div>
    </div>
  </article>
</template>