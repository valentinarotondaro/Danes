<script setup>
import { computed, onMounted } from 'vue'
import { useLiveClasses } from '@/composables/useLiveClasses'

// Real data: the next Speaking Club session from Appwrite
const { liveClasses, loading, fetchLiveClasses } = useLiveClasses()
onMounted(fetchLiveClasses)

// The list is sorted by date, so the first one still in the future is the next one
const next = computed(() => liveClasses.value.find((s) => new Date(s.dateTime) > new Date()) ?? null)
const when = computed(() =>
  next.value ? new Date(next.value.dateTime).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' }) : ''
)
</script>

<template>
  <section
    aria-label="Next at DANES"
        class="flex flex-col justify-center gap-4 rounded-ds bg-sky p-8 text-ink sm:p-10 lg:min-w-0 lg:flex-1 lg:basis-0 lg:gap-6 lg:p-14"
  >
    <template v-if="next">
      <span class="text-xs font-semibold uppercase tracking-[0.02em]">Next Speaking Club · {{ when }}</span>
      <h1 class="max-w-[520px] text-[32px] font-semibold leading-[1.1] lg:text-[56px]">{{ next.title }}</h1>
      <p v-if="next.spotsBooked" class="text-sm">{{ next.spotsBooked }} learners already booked</p>
    </template>
        <template v-else-if="!loading">
      <span class="text-xs font-semibold uppercase tracking-[0.02em]">Welcome back</span>
      <h1 class="max-w-[520px] text-[32px] font-semibold leading-[1.1] lg:text-[56px]">Your lessons, Fridays and events, in one place.</h1>
    </template>
  </section>
</template>