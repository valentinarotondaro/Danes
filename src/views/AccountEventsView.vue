<script setup>
import { computed, inject, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { useToast } from '@/composables/useToast'
import SessionRow from '@/components/account/SessionRow.vue'
import EventBookingCard from '@/components/account/EventBookingCard.vue'
import AdminConfirmDialog from '@/components/admin/AdminConfirmDialog.vue'

const { myClasses, myEvents, openClasses, profile, cancelBooking, leaveWaitlist } = inject('learner')
const { showToast } = useToast()

// Booked and waiting sessions first, then the next open ones at the learner's level
const fridays = computed(() => [...myClasses.value.upcoming, ...openClasses.value].sort((a, b) => new Date(a.dateTime) - new Date(b.dateTime)))

const busy = ref(false)
const toCancel = ref(null) // { item, itemType } waiting for "yes"

async function confirmCancel() {
  busy.value = true
  try {
    await cancelBooking(toCancel.value.item, toCancel.value.itemType)
    showToast('Done.', `Your spot at ${toCancel.value.item.title} is free for someone else.`)
    toCancel.value = null
  } catch (err) {
    console.error(err)
    showToast('We couldn’t cancel it.', 'Check your connection and try again.')
  } finally {
    busy.value = false
  }
}

async function onLeave(item) {
  busy.value = true
  try {
    await leaveWaitlist(item)
    showToast('You left the waitlist.', item.title)
  } catch (err) {
    console.error(err)
    showToast('We couldn’t do that.', 'Check your connection and try again.')
  } finally {
    busy.value = false
  }
}

const pastWhen = (iso) => new Date(iso).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })
</script>

<template>
  <div class="flex flex-col gap-14">
    <div class="flex flex-col gap-2">
      <h1 class="text-[40px] font-semibold leading-[1.1] sm:text-[56px]">My events</h1>
      <p class="text-lg text-ink-muted">Your Friday groups, the meet-ups you’re going to, and the ones you’re waiting for.</p>
    </div>

    <section aria-labelledby="fri-title" class="flex flex-col gap-4">
      <div class="flex flex-wrap items-baseline gap-3">
        <h2 id="fri-title" class="text-[32px] font-semibold leading-tight">Speaking Club</h2>
        <span class="text-ink-muted">{{ profile?.level ? `${profile.level} groups · ` : '' }}Fridays on video</span>
      </div>
      <SessionRow
        v-for="s in fridays"
        :key="s.$id"
        :session="s"
        :busy="busy"
        @free="toCancel = { item: s, itemType: 'liveClass' }"
        @leave="onLeave(s)"
      />
      <p v-if="!fridays.length" class="rounded-ds bg-surface-secondary p-6 text-ink-muted">No Friday sessions planned yet. Check back soon.</p>
    </section>

    <section aria-labelledby="ev-title" class="flex flex-col gap-4">
      <h2 id="ev-title" class="text-[32px] font-semibold leading-tight">Events</h2>
      <div v-if="myEvents.upcoming.length" class="grid grid-cols-1 gap-6 md:grid-cols-2">
        <EventBookingCard
          v-for="e in myEvents.upcoming"
          :key="e.$id"
          :event="e"
          :busy="busy"
          @cancel="toCancel = { item: e, itemType: 'event' }"
          @leave="onLeave(e)"
        />
      </div>
      <div v-else class="flex flex-col items-start gap-3 rounded-ds bg-surface-secondary p-6">
        <p class="font-semibold">No events booked</p>
        <p class="text-sm text-ink-muted">Walks, café mornings and hygge nights in Copenhagen, Aarhus, Esbjerg and Odense.</p>
        <RouterLink :to="{ name: 'event-list' }" class="inline-flex h-12 items-center rounded-ds bg-red px-6 font-semibold text-white no-underline hover:bg-red-hover">Find an event</RouterLink>
      </div>
    </section>

    <section v-if="myEvents.past.some((e) => e.status === 'confirmed')" aria-labelledby="past-title" class="flex flex-col gap-4">
      <h2 id="past-title" class="text-2xl font-semibold">Past</h2>
      <RouterLink
        v-for="e in myEvents.past.filter((e) => e.status === 'confirmed')"
        :key="e.$id"
        :to="{ name: 'event-detail', params: { id: e.$id } }"
        class="flex items-center gap-4 rounded-ds border border-line p-4 text-ink no-underline hover:border-ink"
      >
        <img v-if="e.imageUrl" :src="e.imageUrl" alt="" class="h-[72px] w-24 flex-none rounded-ds object-cover" />
        <span class="flex flex-col">
          <span class="text-sm text-ink-muted">{{ pastWhen(e.dateTime) }} · {{ e.city }}</span>
          <span class="text-lg font-semibold">{{ e.title }}</span>
        </span>
      </RouterLink>
    </section>

    <AdminConfirmDialog
      :open="Boolean(toCancel)"
      :title="toCancel ? (toCancel.itemType === 'event' ? `Cancel ${toCancel.item.title}?` : `Free your seat on ${toCancel.item.title}?`) : ''"
      message="Your spot goes back to the group, and the next person on the waitlist can take it."
      :confirm-label="toCancel?.itemType === 'event' ? 'Cancel my spot' : 'Free my seat'"
      cancel-label="Keep it"
      :final="false"
      :busy="busy"
      @confirm="confirmCancel"
      @cancel="toCancel = null"
    />
  </div>
</template>
