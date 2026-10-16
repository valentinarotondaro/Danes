<script setup>
import { toRef } from 'vue'
import { RouterLink } from 'vue-router'
import { useSessionBooking } from '@/composables/useSessionBooking'

const props = defineProps({
  session: { type: Object, required: true }, // a liveClasses document
  hostName: { type: String, default: '' },
})

const { taken, isFull, percentTaken, month, day, time, isBooked, isWaitlisted, rsvping, error, book, waitlist } =
  useSessionBooking(toRef(props, 'session'))
</script>

<template>
  <li class="flex flex-wrap items-center gap-6 rounded-ds bg-surface-secondary py-4 pl-4 pr-6">
    <span class="flex w-[72px] flex-none flex-col items-center rounded-ds bg-white py-2 text-ink">
      <span class="text-xs font-semibold uppercase text-red">{{ month }}</span>
      <span class="text-2xl font-semibold leading-[1.1]">{{ day }}</span>
      <span class="text-xs">{{ time }}</span>
    </span>

    <div class="flex min-w-[200px] flex-[2_1_260px] flex-col gap-2">
      <span v-if="session.level" class="self-start rounded-ds bg-sky px-3 py-1 text-xs font-semibold uppercase tracking-wide text-ink">
        {{ session.level }}
      </span>
      <h3 class="text-2xl font-semibold leading-tight text-ink">{{ session.title }}</h3>
    </div>

    <div v-if="hostName" class="flex flex-[1_1_160px] items-center gap-3">
      <span aria-hidden="true" class="flex h-10 w-10 flex-none items-center justify-center rounded-full bg-red font-semibold text-white">
        {{ hostName[0] }}
      </span>
      <span class="flex flex-col">
        <span class="text-sm font-semibold text-ink">{{ hostName }}</span>
        <span class="text-sm text-ink-muted">Host</span>
      </span>
    </div>

    <div class="flex flex-[1_1_140px] flex-col gap-1.5">
      <span class="text-sm font-semibold text-ink">{{ taken }} of {{ session.capacity }} seats</span>
      <div
        role="meter"
        aria-label="Seats taken"
        aria-valuemin="0"
        :aria-valuemax="session.capacity"
        :aria-valuenow="taken"
        class="h-2 overflow-hidden rounded-ds bg-line"
      >
        <div class="h-full bg-red" :style="{ width: `${percentTaken}%` }" />
      </div>
    </div>

    <div class="flex w-full flex-col gap-1.5 sm:w-[200px] sm:flex-none">
      <template v-if="isBooked">
        <RouterLink
          :to="{ name: 'live-class-detail', params: { id: session.$id } }"
          class="rounded-ds border-2 border-ink bg-white px-6 py-2.5 text-center font-semibold text-ink no-underline hover:bg-ink hover:text-white"
        >
          Open my session
        </RouterLink>
        <span class="self-center rounded-ds bg-success-soft px-3 py-1 text-xs font-semibold uppercase tracking-wide text-success">Booked</span>
      </template>
      <p v-else-if="isWaitlisted" class="rounded-ds bg-white px-4 py-2.5 text-center font-semibold text-ink">You’re on the waitlist</p>
      <button
        v-else-if="isFull"
        type="button"
        :disabled="rsvping"
        class="rounded-ds border-2 border-ink bg-white px-6 py-2.5 font-semibold text-ink hover:bg-ink hover:text-white disabled:opacity-50"
        @click="waitlist"
      >
        {{ rsvping ? 'Please wait…' : 'Join the waitlist' }}
      </button>
      <button
        v-else
        type="button"
        :disabled="rsvping"
        class="rounded-ds bg-red px-6 py-2.5 font-semibold text-white hover:bg-red-hover disabled:opacity-50"
        @click="book"
      >
        {{ rsvping ? 'Please wait…' : 'Book' }}
      </button>
      <p v-if="error" role="alert" class="text-sm font-semibold text-red">{{ error }}</p>
    </div>
  </li>
</template>