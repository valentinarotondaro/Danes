<script setup>
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import DateTile from '@/components/account/DateTile.vue'
import StatusTag from '@/components/admin/StatusTag.vue'

// One Friday Speaking Club session: booked, on the waitlist, or still open to book.
const props = defineProps({
  session: { type: Object, required: true }, // liveClass + { status?, host? }
  busy: { type: Boolean, default: false },
})
defineEmits(['free', 'leave'])

const time = computed(() => new Date(props.session.dateTime).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }))
const seatsLeft = computed(() => Math.max(0, props.session.capacity - (props.session.spotsBooked ?? 0)))
const STATUS = {
  confirmed: { label: 'Booked', tone: 'success' },
  waitlist: { label: 'Waitlist', tone: 'sky' },
}
const toSession = computed(() => ({ name: 'live-class-detail', params: { id: props.session.$id } }))
</script>

<template>
  <div class="flex flex-wrap items-center gap-x-6 gap-y-4 rounded-ds px-5 py-4" :class="session.status === 'confirmed' ? 'bg-surface-secondary' : 'border border-line'">
    <DateTile :date="session.dateTime" />
    <img v-if="session.host?.photoUrl" :src="session.host.photoUrl" alt="" class="h-12 w-12 flex-none rounded-full object-cover" />
    <span class="flex min-w-0 flex-[1_1_220px] flex-col">
      <RouterLink :to="toSession" class="text-lg font-semibold leading-tight text-ink no-underline hover:text-red">{{ session.title }}</RouterLink>
      <span class="text-sm text-ink-muted">
        {{ [session.level, time, session.host && `with ${session.host.name}`, session.status ? null : `${seatsLeft} seats left`].filter(Boolean).join(' · ') }}
      </span>
    </span>
    <StatusTag v-if="STATUS[session.status]" v-bind="STATUS[session.status]" />

    <template v-if="session.status === 'confirmed'">
      <RouterLink :to="toSession" class="inline-flex h-10 items-center rounded-ds border-2 border-ink bg-white px-4 text-sm font-semibold text-ink no-underline hover:bg-ink hover:text-white">Open session</RouterLink>
      <button type="button" :disabled="busy" class="text-sm font-semibold underline hover:text-red" @click="$emit('free')">Free my seat</button>
    </template>
    <button v-else-if="session.status === 'waitlist'" type="button" :disabled="busy" class="text-sm font-semibold underline hover:text-red" @click="$emit('leave')">Leave the waitlist</button>
    <RouterLink v-else :to="toSession" class="inline-flex h-10 items-center rounded-ds bg-red px-4 text-sm font-semibold text-white no-underline hover:bg-red-hover">
      {{ seatsLeft ? 'Book a seat' : 'Join the waitlist' }}
    </RouterLink>
  </div>
</template>
