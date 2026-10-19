<script setup>
import { computed, toRef } from 'vue'
import { useEventSignup } from '@/composables/useEventSignup'
import RsvpButton from './RsvpButton.vue'

const props = defineProps({ event: { type: Object, required: true } })

const { spotsBooked, isFull, spotsLeft, month, day, when, hasRsvpd, isWaitlisted, rsvping, error, saveSpot, waitlist } =
  useEventSignup(toRef(props, 'event'))

// Width of the "spots taken" bar, e.g. 11 of 15 → 73%
const percentTaken = computed(() =>
  Math.min(100, Math.round((spotsBooked.value / props.event.capacity) * 100))
)
</script>

<template>
  <section aria-labelledby="next-title" class="flex flex-col gap-6 rounded-ds bg-red p-6 text-white lg:flex-row">
    <div class="relative min-w-0 flex-1">
      <img
        v-if="event.imageUrl"
        :src="event.imageUrl"
        :alt="event.title"
        class="h-full max-h-[460px] min-h-[320px] w-full rounded-ds object-cover"
      />
      <div v-else class="h-full min-h-[320px] w-full rounded-ds bg-red-hover" />
      <span class="absolute left-4 top-4 flex w-[72px] flex-col items-center rounded-ds bg-white py-2 text-ink">
        <span class="text-xs font-semibold uppercase text-red">{{ month }}</span>
        <span class="text-[32px] font-semibold leading-none">{{ day }}</span>
      </span>
    </div>

    <div class="flex flex-1 flex-col justify-center gap-6 p-2 lg:p-4">
      <span class="text-xs font-semibold uppercase tracking-wide">Next up</span>
      <h2 id="next-title" class="text-[40px] font-semibold leading-[1.1] sm:text-[56px]">{{ event.title }}</h2>
      <p v-if="event.description" class="max-w-md">{{ event.description }}</p>

      <ul class="flex flex-wrap gap-2">
        <li v-if="event.city" class="rounded-ds bg-sky px-3 py-1 text-xs font-semibold uppercase tracking-wide text-ink">{{ event.city }}</li>
        <li class="rounded-ds bg-sky px-3 py-1 text-xs font-semibold uppercase tracking-wide text-ink">{{ when }} · {{ event.location }}</li>
      </ul>

      <div class="flex max-w-md flex-col gap-2">
        <span class="text-sm font-semibold">
          {{ spotsBooked }} going · {{ isFull ? 'Full' : `${spotsLeft} spots left` }}
        </span>
        <div
          role="meter"
          aria-label="Spots taken"
          aria-valuemin="0"
          :aria-valuemax="event.capacity"
          :aria-valuenow="spotsBooked"
          class="h-2 overflow-hidden rounded-ds bg-white"
        >
          <div class="h-full bg-sky" :style="{ width: `${percentTaken}%` }" />
        </div>
      </div>

      <div class="flex max-w-md flex-col gap-2 sm:flex-row sm:items-center sm:gap-6">
        <div class="sm:w-60">
          <RsvpButton
            variant="sky"
            :has-rsvpd="hasRsvpd"
            :is-waitlisted="isWaitlisted"
            :loading="rsvping"
            :full="isFull"
            @rsvp="saveSpot"
            @waitlist="waitlist"
          />
        </div>
                <RouterLink :to="{ name: 'event-detail', params: { id: event.$id } }" class="font-semibold text-white hover:text-sky">See details</RouterLink>
      </div>
      <p v-if="error" role="alert" class="text-sm font-semibold">{{ error }}</p>
    </div>
  </section>
</template>